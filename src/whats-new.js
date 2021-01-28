import React, {useState} from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import "./assets/stylesheets/styles.scss";
import { setMethod } from './react-components/utils'
import Store from "./storage/store";
import { connectToAlerts, emitIdentity } from './storage/socketUtil';
import Waiting from './Waiting';
import UserAuth from './UserAuth';

const store = new Store();
window.APP = { store };

function Mdashboard() {
  const [photoFile, setPhotoFile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [uploadFail, setUploadFail] = useState(false);
  const [waitingAmount, setWaitingAmount] = useState({
    simple: 0,
    avatar: 0,
    photo: 0
  });
  const [isLink, setIsLink] = useState(false);
  const [emptyPhoto, setEmptyPhoto] = useState('');
  const [checkUpdateStore, setCheckUpdateStore] = useState(false);

  React.useEffect(() => {
    connectToAlerts()
    emitIdentity(store.state.mvpActions.id);
    setCurrentUser(store.state.mvpActions)
  }, [checkUpdateStore])

  React.useEffect(() => {
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
          console.log("json in whats news: ", json);
          console.log("typeAmount in whats news: ", typeAmount);
          setWaitingAmount(typeAmount);
        } else {
          console.log("error")
        }
      })
  }, [])

  React.useEffect(()=>{
    if(uploadFail) {
      setPhotoFile(null)
    }
  },[uploadFail])

  const onUploadPhoto = (e) => {
    document.getElementById("upload").click()
  }

  const getPhotoURL = (file) => {
    const mtoken = store.state.mvpActions.mtoken;
    if(mtoken == null) window.location.href = '/cloud';
    let formData = new FormData();
    formData.append("file", file);

    const reqOptions = {
      method: 'POST',
      headers: {
        'Authorization': mtoken,
        'http-equiv': 'Content-Security-Policy'
      },
      mode: 'cors',
      body: formData
    }

    fetch("https://snap1.app-spinthe.chat/api/getPhotoURL", reqOptions)
      .then(res => res.json())
      .then(json => {
        setUploadFail(false);

        // GET_PHOTO_URL_SUCCESS
        store.update({mvpActions: {
          photoURL: json.url,
          uploadFailed: false
        }})
        setCheckUpdateStore(true);
      })
      .catch(error => {
        console.log(error);
        setUploadFail(true);

        // GET_PHOTO_URL_FAILURE
        store.update({mvpActions: {
          uploadFailed: true
        }})
      })

  }

  const onChangePhoto = (event) => {
    event.preventDefault();
    let file = event.target.files[0];
    setPhotoFile(file)
    // avatar file upload to the s3 bucket
    getPhotoURL(file)

  }

  const enterWaitingRequest = (type) => {
    const mtoken = store.state.mvpActions.mtoken;

    const body = {
      waiting: 1,
      type: type
    }
    const reqOptions = {
      method: "POST",
      headers: {
        'Authorization': mtoken,
        'Content-Type': 'application/json',
        'http-equiv': 'Content-Security-Policy'
      },
      mode: 'cors',
      body: JSON.stringify(body)
    }

    fetch('https://snap1.app-spinthe.chat/api/enterWaiting', reqOptions)
      .then(res => res.json())
      .then(json => {
        if(type == 'avatar') {
          // ENTER_WAITING_SUCCESS
          store.update({mvpActions: {
            isWaiting: true,
            waitingMethod: 'avatar'
          }})
        } else if(type == 'photo') {
          // ENTER_PHOTO_WAITING_SUCCESS
          store.update({mvpActions: {
            isWaiting: true,
            waitingMethod: 'photo'
          }})
        } else if(type == 'simple') {
          // ENTER_SIMPLE_WAITING_SUCCESS
          store.update({mvpActions: {
            isWaiting: true,
            waitingMethod: 'simple'
          }})
        }
        // window.location.href = '/link';
        setIsLink(true);
      })
      .catch(error => {
        console.log(error)
        // ENTER_ALL_WAITING_SUCCESS
        store.update({mvpActions: {
          isWaiting: false
        }})
        setIsLink(false)
      })
  }

  const onEnter = () => {
    store.update({mvpActions: {waitingMethod: 'avatar'} })
    enterWaitingRequest('avatar')
    
  }

  const RandomMethod = () => {
    let randomNumber = Math.floor(Math.random() * 2) + 1;
    if (randomNumber == 1) {
      return onEnter();
    } else {
      return onEnterGuess();
    }
  }

  const onEnterDemo = () => {
    let demoType = store.state.mvpActions.demoType;
    if(!demoType) {
      store.update({mvpActions: {demoType: 1}}) 
      onEnter();
    } else if(demoType == 1) {
      store.update({mvpActions: {demoType: 2}})
      onEnterGuess();
    } else if(demoType == 2) {
      store.update({mvpActions: {demoType: 3}})
      RandomMethod();
    } else if(demoType == 3) {
      RandomMethod();
    }
  }

  const onEnterSimple = () => {
    store.update({mvpActions: {waitingMethod: 'simple'} })
    enterWaitingRequest('simple')
  }

  const onEnterGuess = () => {
    if(!currentUser.photoURL) {
      setEmptyPhoto("Please upload your photo!");
      return;
    }
    store.update({mvpActions: {waitingMethod: 'photo'} })
    enterWaitingRequest('photo')
  }

  const logout = () => {
    console.log("logout")
    store.update({mvpActions: {mtoken: ""}})
    window.location.href = "/"
  }

  if(isLink) {
    return <Waiting method={store.state.mvpActions.waitingMethod} />
  } else {
    return (
      <UserAuth>
        <div className="row">
          <div style={{
            textAlign: 'center',
            width: '100%',
            paddingTop: 20,
            color: '#464E5F',
            fontSize: 35,
            fontWeight: 'bold'
          }}>
            <span>USER DASHBOARD</span>
          </div>
        </div>
        <div className="row">
          <div className="column" >
            <div className="left-page-wrapeer">
              <div className="queue-status">
              There are currently <span>simple: {waitingAmount.simple}, avatar: {waitingAmount.avatar}, photo: {waitingAmount.photo}</span> people in the queue.
              </div>
              <div className="info-head">
                <div className={"upload-photo"} onClick={e => onUploadPhoto(e)}>
                  {
                    photoFile ?
                      <img
                        src={URL.createObjectURL(photoFile)}
                        alt={photoFile.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      /> : 
                      (
                        currentUser?.photoURL ?
                        <img
                          src={`https://app-spinthe-bucket.s3-us-west-2.amazonaws.com/photos/${currentUser.id}/${currentUser.photoURL}`}
                          alt={'avatar'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        /> : 
                        <label style={{ position: "absolute" }}>Upload your photo</label>
                      )
                      
                  }
                  <input id="upload" type="file" onChange={(event) => {
                    onChangePhoto(event)
                  }} />
                </div>
                <div className="info-body">
                  <div className="success-rate">
                    SUCCESS<br /> RATE
                  </div>
                  <div className="total-points">
                    TOTAL<br /> POINTS
                  </div>
                </div>
              </div>
            </div>
            <div className='left-page-wrapeer'>
              <div className='friend-body'>
                <div className="friend-input">
                  I am a ...
                </div>
                <div className="friend-input">
                  I am a ...
                </div>
                <div className="friend-input">
                  I am a ...
                </div>
                <div className="friend-input">
                  I am a ...
                </div>
              </div>
            </div>
          </div>
          <div className="columnMiddle">
  
            <button className="demoBtn" onClick={e => onEnterDemo()}>
              <span>
                DEMO<br />
                VERSION
              </span>
            </button>

            <button className="waitingBtn" onClick={e => onEnterSimple()}>
              <span>
                SIMPLE<br />
                CHAT
              </span>
            </button>
  
            <button className="waitingBtn" onClick={e => onEnter()} >
              <span>
                GUESS<br />
                MY <br />
                AVATAR
              </span>
            </button>
  
            <button className="waitingBtn" onClick={e => onEnterGuess()} >
              <span>
                GUESS<br />
                MY<br />
                PHOTO
              </span>
            </button>

            <div className="error-container">
              <span className="error">
                {emptyPhoto}
              </span>
            </div>
  
          </div>
          <div className="column" >
            <div className="login-wrapper">
              <button 
                className="link-button"
                onClick={() => logout()}
              >
                Logout
              </button>
            </div>
            <div className='left-page-wrapeer'>
              <div className='friend-title'>
                FRIEND LIST
              </div>
              <div className='friend-body'>
                <div className="friend-input">
                  Friend1
                </div>
                <div className="friend-input">
                  Friend2
                </div>
                <div className="friend-input">
                  Friend3
                </div>
                <div className="friend-input">
                  Friend4
                </div>
                <div className="friend-input">
                  Friend5
                </div>
                <div className="friend-input">
                  Friend6
                </div>
              </div>
            </div>
          </div>
        </div>
      </UserAuth>
    );
  }
  }




document.addEventListener("DOMContentLoaded", async () => {
  ReactDOM.render(<Mdashboard />, document.getElementById("ui-root"));
});
