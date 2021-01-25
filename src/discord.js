import React from "react";
import ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import registerTelemetry from "./telemetry";
import Store from "./storage/store";
import "./utils/theme";
import { lang, messages } from "./utils/i18n";
import { AuthContextProvider } from "./react-components/auth/AuthContext";
import { SignInPage } from "./react-components/auth/SignInPage";
import "./assets/stylesheets/globals.scss";
import { connectToAlerts, emitIdentity, emitWaiting } from './storage/socketUtil';
import Waiting from './Waiting';

registerTelemetry("/signin", "Hubs Sign In Page");

const store = new Store();
window.APP = { store };

function Root() {
  const [isMlobby, setIsMlobby] = React.useState(false);
  const [isLink, setIsLink] = React.useState(false);

  React.useEffect(() => {
    connectToAlerts()
  }, [])

  React.useEffect(() => {
    const qs = new URLSearchParams(location.search);
    const mtoken = store.state.mvpActions.mtoken;
    
    if(qs.has('mlobby')) {
      setIsMlobby(true)
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

                store.update({mvpActions: {
                    isWaiting: true
                }})
                emitIdentity(json.id);
                emitWaiting({
                  userId: json.id,
                  type: store.state.mvpActions.waitingMethod
                });
                // window.location.href = '/link';
                setIsLink(true);
            })
            .catch( error => {
                console.log(error);
                store.update({mvpActions: {
                    isWaiting: false
                }})
                setIsLink(false)
            })
        /////
      } else {
          window.location.href = "/";
      }
    }
  }, [])

  if(isLink) {
    return <Waiting method={store.state.mvpActions.waitingMethod} />
  }
  if(isMlobby) { 
    return (
      <div className="page-spinner">
        <span>loading...</span>
      </div>
    )
  } else {
    return ( 
      <IntlProvider locale={lang} messages={messages}>
        <AuthContextProvider store={store}>
          <SignInPage />
        </AuthContextProvider>
      </IntlProvider>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById("ui-root"));
