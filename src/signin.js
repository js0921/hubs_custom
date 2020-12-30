import React, {useState} from "react";
import ReactDOM from "react-dom";
import "./assets/stylesheets/styles.scss";
import Store from './storage/store';
import { connectToAlerts, emitIdentity } from './storage/socketUtil';
import { 
  setJwtToken, 
  setCurrentUserId,
} from './react-components/utils';

const store = new Store()
window.APP = { store }

function Msignin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loginError, setLoginError] = useState('')

  React.useEffect(() => {
    connectToAlerts()
  }, [])

  const onSubmit = () => {
    if(email === '') {
      setError('Please input email address!')
      return
    }
    if(password === '') {
      setError('Please input email password!')
      return
    }

    const data = {
      email: email,
      password: password
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

    fetch('https://snap1.app-spinthe.chat/api/login', reqOptions)
      .then(res => res.json())
      .then(json => {
        console.log(json)
        if( !json.hasOwnProperty('message') ) {
          setJwtToken(json.token)
          setCurrentUserId(json.id)
          setLoginError("")

          // LOGIN_SUCCESS
          store.update({mvpActions: {
            id: json.id,
            role: json.role,
            firstname: json.firstname,
            lastname: json.lastname,
            mtoken: json.token,
            photoURL: json.photoURL,
            isLoggedIn: true,
            loginError: null
          }})
          emitIdentity(json.id);
          window.location.href = '/whats-new';
        } else {
          setLoginError(json.message)

          // LOGIN_FAILURE
          store.update({mvpActions: {
            id: null,
            isLoggedIn: false,
            loginError: json.message
          }})  
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <div className="page-wrapper">
      <div className="login-wrapper">
        <button className="link-button" onClick={e => window.location.href = '/cloud'}>Signup</button>
      </div>
      <div className="page-title">Login</div>
      <div className="form-wrapper">
        <div className="form-item">
          <input type="email" className="form-input" placeholder="E-mail Address" onChange={e => setEmail(e.currentTarget.value)} required /> 
        </div>
        <div className="form-item">
          <input type="password" className="form-input" placeholder="Password" onChange={e => setPassword(e.currentTarget.value)} required /> 
        </div>
        <div className="form-item">
          <span className="error-alert">{error}</span>
        </div>
        <div className="form-item">
          <span className="error-alert">{loginError}</span>
        </div>
        <div className="form-item">
          <input 
            type="button" 
            className="form-button" 
            value="Enter" 
            onClick={(e) => onSubmit()} />
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<Msignin />, document.getElementById("ui-root"));
