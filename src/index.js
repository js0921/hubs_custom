import React, {useState} from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import "./assets/stylesheets/styles.scss";
import { LoadingAnimation } from '../src/components/LoadingAnimation'
import Store from './storage/store';
import { 
  setJwtToken, 
  getJwtToken, 
  setCurrentUserId, 
  setOppositeUserId
} from './react-components/utils';

const store = new Store()
window.APP = { store }


function Root() {
  const [isLoading, setLoading] = useState(false)
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [validationError, setValidationError] = useState('')

  React.useEffect(() => {
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
          store.update({mvpActions: {waitingAmount: json.amount} })
        } else {
          console.log("error")
        }
      })
  }, [])

  React.useEffect(() => {
    if(store.state.mvpActions.mtoken || store.state.mvpActions.guestSignupError) {
      setLoading(false)
    }
  }, [
    store.state.mvpActions.mtoken,
    store.state.mvpActions.guestSignupError
  ])
  
  const handleEnterBasicInfo = () => {
    if(firstname !== '' && lastname !== '' && email !== '') {
      setLoading(true)
    } else {
      setValidationError('Please fill all fields to proceed')
      return;
    }
    // window.location.href = '/mdashboard'

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
        } })
        window.location.href = '/mwaiting';
      })
      .catch(error => {
        console.log(error)

        // GUEST_SIGNUP_FAILURE
        store.update({mvpActions: {
          id: null,
          role: null,
          mtoken: null,
          guestSignupError: error.message,
        } })
      })
    

  }

  if(isLoading) {
    return (
      <LoadingAnimation />
    )
  }

  return (
    <div className="page-wrapper">
      <div className="login-wrapper">
        {/* <Link className="link-button" to='/login'>Login</Link> */}
        <div className="link-button" onClick={e => window.location.href = '/msignin'}>Login</div>
      </div>
      <div className="page-title">Welcome!</div>
      <div className="queue-status">
        There are currently <span>{store.state.mvpActions.waitingAmount}</span> people in the queue.
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
          <span className="error-alert">{}</span>
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
  );
}

ReactDOM.render(<Root />, document.getElementById("home-root-mvp"));
