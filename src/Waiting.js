import React, {useState} from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";

import "./assets/stylesheets/styles.scss";
import { getMethod, getOppositeUserId } from './react-components/utils';
import { connectToAlerts, emitIdentity, emitWaiting } from './storage/socketUtil';
import Store from './storage/store';

const store = new Store();
window.APP = { store };

export default function Waiting({method}) {

    // const [method, setMethod] = useState(null)
    const [firstname, setFirstname] = useState(null)
    const [lastname, setLastname] = useState(null)
    const [isAssigned, setIsAssigned] = useState(false)
    const [assignRoomURL, setAssignRoomURL] = useState(null)
    const [avatarId, setAvatarId] = useState(null)
    const [oppositeAvatarID, setOppositeAvatarID] = useState(null)
    const [uid, setUid] = useState(null)
    const [oppositeId, setOppositeId] = useState(null)

    // React.useEffect(() => {
    //   async function SocketConnect() {
    //     // await connectToAlerts()
    //     await emitIdentity(store.state.mvpActions.id);
    //     await emitWaiting(store.state.mvpActions.id);
    //   }

    //   SocketConnect();
    // }, [])

    React.useEffect(() => {
      window.addEventListener("isAssigned", (e) => {
        console.log("assign event from socket")
        // setMethod(store.state.mvpActions.waitingMethod)
        setFirstname(store.state.mvpActions.firstname)
        setLastname(store.state.mvpActions.lastname)
        setIsAssigned(true)
        setAssignRoomURL(e.detail.assignRoomURL)
        setAvatarId(e.detail.assignAvatarId)
        setOppositeAvatarID(e.detail.assignoppositeAvatarID)
        setUid(e.detail.assignuid)
        setOppositeId(e.detail.assignOppositeUserId)
      }, false)
    }, [])

    React.useEffect(() => {
      if (assignRoomURL && avatarId && isAssigned && oppositeAvatarID && uid && oppositeId && method) {
        console.log("assigned!!!")
        getOppositeUserId(oppositeId);

        // local
        // window.location.href = assignRoomURL + `&avatarId=${avatarId}`  + `&oppositeAvatarID=${oppositeAvatarID}` + `&firstname=${firstname}` + `&lastname=${lastname}` + `&uid=${uid}` + `&oppositeId=${oppositeId}` + `&method=${method}`;

        // server 
        window.location.href = assignRoomURL + `?avatarId=${avatarId}`  + `&oppositeAvatarID=${oppositeAvatarID}` + `&firstname=${firstname}` + `&lastname=${lastname}` + `&uid=${uid}` + `&oppositeId=${oppositeId}` + `&method=${method}`;
      }
    }, [
      assignRoomURL,
      avatarId,
      isAssigned,
      oppositeAvatarID,
      uid,
      oppositeId,
      method
    ])

    console.log("waitingMethod in waiting page: ", method)

    if (method == 'photo') {
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
          <div className="page-back">
            <button 
                className="link-button" 
                onClick={e => window.location.href = '/whats-new'}
              >
                Back to dashboard
            </button>
          </div>
        </div>
      )
    } else if (method == 'avatar') {
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
          <div className="page-back">
            <button 
                className="link-button" 
                onClick={e => window.location.href = '/whats-new'}
              >
                Back to dashboard
            </button>
          </div>
        </div>
      )
    } else {
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
          <div className="page-back">
            <button 
                className="link-button" 
                onClick={e => window.location.href = '/whats-new'}
              >
                Back to dashboard
            </button>
          </div>
        </div>
      )
    }
}
