import React, {useState} from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";

import "./assets/stylesheets/styles.scss";
import { getMethod } from './react-components/utils';
import Store from './storage/store';

const store = new Store();
window.APP = { store };

function Mwaiting() {
    // const method = getMethod();
    const method = store.state.mvpActions.waitingMethod

    if (method == 'simple') {
        return (
          <div className="page-wrapper">
            <div className="page-title-simple">PLEASE WAIT WHILE WE FIND YOU A MATCH!</div >
            <p className="waiting-page-instruction-simple">
              Once you are matched, you will have five minutes<br />
              to chat before being matched with someone new.<br />
              <br />
              To play more games, create friend lists and filter<br />
              possible matches, please login<br />
            </p>
            <br /><br />
            {/* {
              currentUser.role == 0 ?
                <div className="form-wrapper">
                  <div className="form-item">
                    <Link className="login-button" to='/login'>Login</Link>
                    <div className="link-button" onClick={e => window.location.href = '/msignin'}>Login</div>
                  </div>
                </div> : null
            } */}
          </div>
        )
      } else if (method == 'photo') {
        return (
          <div className="page-wrapper">
            <div className="page-title-simple">PLEASE WAIT WHILE WE FIND YOU A MATCH!</div >
            <p className="waiting-page-instruction-simple">
              Once you are matched, you will see three six photos.<br />
              One is of you.<br />
              One is of the person you've been metched with.<br />
              The other four photos are random users.<br />
              <br />
              You'll each have five minutes to guess which is the real photo!<br />
            </p>
          </div>
        )
      } else {
        return (
          <div className="page-wrapper">
            <div className="page-title-simple">PLEASE WAIT WHILE WE FIND YOU A MATCH!</div >
            <p className="waiting-page-instruction-simple">
              Once matched, your goal is to help your partner figure out <br /> what type of Avatar they are!<br />
    
              You’ll be given a series of clues!<br />
              <br />
              Clues in RED are forbidden!<br />
    
              Once a clue turns GREEN, you can use it to help your partner <br />guess their Avatar!<br />
              <br />
              You and your partner will have FIVE MINUTES to help each <br />other guess your Avatars!<br />
            </p>
            <div className="page-title">GOOD LUCK AND HAVE FUN!</div> 
          </div>
        )
      }
}

ReactDOM.render(<Mwaiting />, document.getElementById("ui-root"));
