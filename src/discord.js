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

registerTelemetry("/signin", "Hubs Sign In Page");

const store = new Store();
window.APP = { store };

function Root() {
  const [isMlobby, setIsMlobby] = React.useState(false);

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
                // emitIdentity(json.id);
                store.update({mvpActions: {
                    isWaiting: true
                }})
                window.location.href = '/link';
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
    }
  }, [])

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
