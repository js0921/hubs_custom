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

function Mlobby() {
    const mtoken = store.state.mvpActions.mtoken;
    const waitingMethod = store.state.mvpActions.waitingMethod;
    React.useEffect(() => {
        if(mtoken) {
            /////
            const data = {
                token: mtoken,
                currentURL: 'lobby'
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
            fetch('https://snap1.app-spinthe.chat/api/authCheck', reqOptions)
                .then(res => res.json())
                .then(json => {
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
                    // emitIdentity(json.id);
                    store.update({mvpActions: {
                        isWaiting: true
                    }})
                    window.location.href = '/mwaiting';
                })
                .catch( error => {
                    console.log(error);
                    store.update({mvpActions: {
                        isWaiting: false
                    }})
                })
            /////
        } else {
            window.location.href = "/";
        }
    }, [])

    return (
    <div className="page-spinner">
        <span>loading...</span>
    </div>
);
}

ReactDOM.render(<Mlobby />, document.getElementById("ui-root"));
