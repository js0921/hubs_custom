import Store from "./storage/store";
import React from 'react';
import { createBrowserHistory } from 'history'

const history = createBrowserHistory()
const store = new Store();
window.APP = { store };

export default function UserAuth({children}) {
   const currentURL = window.location.pathname;
   React.useEffect(() => {
      const mtoken = store.state.mvpActions.mtoken;
      const currentUserRole = store.state.mvpActions.role;

      if(!mtoken) {
         if(currentURL.includes('/whats-new')) {
            window.location.href = "/";
         }
      } else {
         if(currentURL.includes('/cloud') || currentURL.includes('/signin') || (currentURL == "/")) {
            if(currentUserRole == 1) {
               window.location.href = "/whats-new";
            }
         } else if(currentURL.includes('/whats-new')) {
            if(currentUserRole == 0) {
               window.location.href = "/";
            } 
         }
      }
   }, [ currentURL ])
   return children
}