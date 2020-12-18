import React, {useState} from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import "./assets/stylesheets/styles.scss";
import Store from './storage/store';
import { 
  setJwtToken, 
  setCurrentUserId,
} from './react-components/utils';

const store = new Store()
window.APP = { store }

function Msignup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    const onSubmit = () => {
        if(password !== confirmPassword) {
          setError('Password is not matching, please input passwords again')
          setPassword('')
          setConfirmPassword('')
          return
        }
        if(firstname === '') {
          setError('Please input first name')
          return;
        }
        if(lastname === '') {
          setError('Please input last name');
          return;
        }
        if(email === '') {
          setError('Please input email');
          return;
        }
        setError('')

        const data = {
          email: email,
          password: password,
          firstname: firstname,
          lastname: lastname
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

        fetch('https://snap1.app-spinthe.chat/api/signup', reqOptions)
          .then(res => res.json())
          .then(json => {
            setCurrentUserId(json.id)

            // SIGNUP_SUCCESS
            store.update({mvpActions: {
              isSignedUp: true,
              signupError: null
            }})
            window.location.href = '/signin';
          })
          .catch(error => {
            console.log(error)

            // SIGNUP_FAILURE
            store.update({mvpActions: {
              isSignedUp: false,
              signupError: error.message
            }})            
          })
        }

  return (
    <div className="page-wrapper">
      <div className="login-wrapper">
        {/* <Link className="link-button" to="/login">Login</Link> */}
        <div className="link-button" onClick={e => window.location.href = '/signin'}>Login</div>
      </div>
      <div className="page-title">Create Account!</div>
      <div className="form-wrapper">
        <div className="form-item">
          <input type="text" className="form-input" placeholder="First Name" onChange={e => setFirstname(e.currentTarget.value)} value={firstname} required /> 
        </div>
        <div className="form-item">
          <input type="text" className="form-input" placeholder="Last Name" onChange={e => setLastname(e.currentTarget.value)} value={lastname} required /> 
        </div>
        <div className="form-item">
          <input type="email" className="form-input" placeholder="E-mail Address" onChange={e => setEmail(e.currentTarget.value)} value={email} required /> 
        </div>
        <div className="form-item">
          <input type="password" className="form-input" placeholder="Password" onChange={e => setPassword(e.currentTarget.value)} value={password} required /> 
        </div>
        <div className="form-item">
          <input type="password" className="form-input" placeholder="Confirm Password" onChange={e => setConfirmPassword(e.currentTarget.value)} value={confirmPassword} required />
        </div>
        <div className="form-item">
          <span className="error-alert">{error}</span>
        </div>
        <div className="form-item">
          <span className="error-alert">{}</span>
        </div>
        <div className="form-item">
          <input type="button" className="form-button" value="Enter" onClick={(e) => onSubmit()} />
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<Msignup />, document.getElementById("ui-root"));
