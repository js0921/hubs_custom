import React, {useState} from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import "./assets/stylesheets/styles.scss";
import { LoadingAnimation } from '../src/components/LoadingAnimation'
import Store from './storage/store';
import { connectToAlerts, emitIdentity } from './storage/socketUtil';
import { 
  setJwtToken, 
  getJwtToken, 
  setCurrentUserId, 
  setOppositeUserId
} from './react-components/utils';
import {createAndRedirectToNewHub} from '../src/utils/phoenix-utils';
import Waiting from './Waiting';
import UserAuth from './UserAuth';

const store = new Store()
window.APP = { store }


function Root() {
  const [isLoading, setLoading] = useState(false)
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [validationError, setValidationError] = useState('')
  const [mtoken, setMtoken] = useState(null);
  const [guestSignupError, setGuestSignupError] = useState(null);
  const [waitingAmount, setWaitingAmount] = useState({
    simple: 0,
    avatar: 0,
    photo: 0
  });
  const [isLink, setIsLink] = useState(false);

  React.useEffect(() => {
    const qs = new URLSearchParams(location.search);
    if(qs.has("sign_in")) {
      const redirectUrl = new URL("/discord", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    } else if(qs.has("auth_topic")) {
      const redirectUrl = new URL("/verify", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    }

    if (qs.has("new")) {
      createAndRedirectToNewHub(null, null, true);
    }
  }, [])

  React.useEffect(() => {
    connectToAlerts();
    window.addEventListener("waitingAmount", (e) => {
      setWaitingAmount(e.detail);
    }, false)

    const reqOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'http-equiv': 'Content-Security-Policy'
      },
      mode: 'cors'
    }
    fetch('https://snap1.app-spinthe.chat/api/getWaiting', reqOptions)
      .then(res => res.json())
      .then(json => {
        if(json.success) {
          // store.update({mvpActions: {waitingAmount: json.amount} })
          let typeAmount = {
            simple: 0,
            avatar: 0,
            photo: 0
          }
          for(let i = 0; i< json.amount.length; i++) {
              if(json.amount[i].amount == 'simple') {
                  typeAmount.simple += 1;
              } else if(json.amount[i].amount == 'avatar') {
                  typeAmount.avatar += 1;
              } else if(json.amount[i].amount == 'photo') {
                  typeAmount.photo += 1;
              }
          }
          setWaitingAmount(typeAmount);    
        } else {
          console.log("error")
        }
      })
  }, [])

  React.useEffect(() => {
    if(mtoken || guestSignupError) {
      setLoading(false)
    }
  }, [ mtoken, guestSignupError ])
  
  const handleEnterBasicInfo = () => {
    if(firstname !== '' && lastname !== '' && email !== '') {
      let pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if(!pattern.test(email)) {
        setValidationError('Please enter valid email address.');
        return;
      }
      const data = {
        firstname: firstname,
        lastname: lastname,
        email: email
      }
      const reqOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'http-equiv': 'Content-Security-Policy'
        },
        mode: 'cors',
        body: JSON.stringify(data)
      }
  
      // GUEST_SIGNUP_REQUEST
      store.update({mvpActions: {
        id: null,
        role: null,
        guestSignupError: null
      }})
  
      fetch('https://snap1.app-spinthe.chat/api/guestSignup', reqOptions)
        .then(res => res.json())
        .then(json => {
          if(json.hasOwnProperty('message')) {
            setValidationError(json.message);
            return;
          }
          setLoading(true)
          setJwtToken(json.token);
          setCurrentUserId(json.id);
  
          // GUEST_SIGNUP_SUCCESS
          store.update({mvpActions: {
            id: json.id,
            role: json.role,
            firstname: firstname,
            lastname: lastname,
            mtoken: json.token,
            guestSignupError: null,
            waitingMethod: 'simple'
          }})
          setMtoken(json.token)
          setGuestSignupError(null)
  
          emitIdentity(json.id)
          // window.location.href = '/link';
          setIsLink(true);
        })
        .catch(error => {
          console.log(error)
  
          // GUEST_SIGNUP_FAILURE
          store.update({mvpActions: {
            id: null,
            role: null,
            mtoken: null,
            guestSignupError: error.message,
          }})
          setMtoken(null)
          setGuestSignupError(null)
          setIsLink(false);
        })
    } else {
      setValidationError('Please fill all fields to proceed')
      return;
    }
  }

  if(isLink) {
    return <Waiting method={store.state.mvpActions.waitingMethod} />
  }

  if(isLoading) {
    return (
      <LoadingAnimation />
    )
  }

  return (
    <UserAuth>
      <div className="page-wrapper">
        <div className="login-wrapper">
          {/* <Link className="link-button" to='/login'>Login</Link> */}
          <div className="link-button" onClick={e => window.location.href = '/signin'}>Login</div>
        </div>
        <div className="page-title">Welcome!</div>
        <div className="queue-status">
        There are currently <span>simple: {waitingAmount.simple}, avatar: {waitingAmount.avatar}, photo: {waitingAmount.photo}</span> people in the queue.
        </div>
        <div className="form-wrapper">
          <div className="form-item">
            <input type="text" className="form-input" placeholder="First Name" onChange={e => setFirstname(e.currentTarget.value)} required /> 
          </div>
          <div className="form-item">
            <input type="text" className="form-input" placeholder="Last Name" onChange={e => setLastname(e.currentTarget.value)} required /> 
          </div>
          <div className="form-item">
            <input type="email" className="form-input" placeholder="E-mail Address" onChange={e => setEmail(e.currentTarget.value)} required /> 
          </div>
          <div className="form-item">
            <span className="error-alert">{validationError}</span>
          </div>
          <div className="form-item">
            <input 
              type="button" 
              className="form-button" 
              value="Enter" 
              onClick={(e) => handleEnterBasicInfo()}/>
          </div>
        </div>
      </div>
    </UserAuth>
  );
}

ReactDOM.render(<Root />, document.getElementById("home-root-mvp"));
