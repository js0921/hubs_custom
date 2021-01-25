import io from "socket.io-client";
import Store from './store';

let socket = null;
const store = new Store()
window.APP = { store }


export function connectToAlerts() {
  if (!socket) {
    socket = io("https://snap1.app-spinthe.chat");
    
    socket.on("connect", () => {
        console.log("Socket.io connection success");
    }); 

    socket.on("connect_error", () => {
        console.log("Socket.io connection error. Disconnecting socket ...");
        socket.disconnect();
        socket = null; // set to null
    });

    socket.on("alert", payload => {
        if(payload.type === 'updateWaiting') {
            console.log("payload in udpateWaiting: ", payload.amount);
            // store.update({mvpActions: {
            //     waitingAmount: payload.amount
            // }})
            let typeAmount = {
                simple: 0,
                avatar: 0,
                photo: 0
            }
            for(let i = 0; i< payload.amount.length; i++) {
                if(payload.amount[i].waitingType == 'simple') {
                    typeAmount.simple += 1;
                } else if(payload.amount[i].waitingType == 'avatar') {
                    typeAmount.avatar += 1;
                } else if(payload.amount[i].waitingType == 'photo') {
                    typeAmount.photo += 1;
                }
            }
            window.dispatchEvent(new CustomEvent("waitingAmount", {"detail": typeAmount}))
        } else if(payload.type === 'assignUpdate') {
            console.log("payload in assignUpdate: ", payload)
            try {
                store.update({mvpActions: {
                    assignRoomURL: payload.message.roomURL,
                    assignAvatarId: payload.message.avatarId,
                    assignoppositeAvatarID: payload.message.oppositeAvatarID,
                    assignuid: payload.message.uid,
                    assignOppositeUserId: payload.message.oppositeId,
                    isAssigned: true
                }})
                window.dispatchEvent(new CustomEvent("isAssigned", {
                    "detail": {
                        "assignRoomURL": payload.message.roomURL,
                        "assignAvatarId": payload.message.avatarId,
                        "assignoppositeAvatarID": payload.message.oppositeAvatarID,
                        "assignuid": payload.message.uid,
                        "assignOppositeUserId": payload.message.oppositeId,
                        "isAssigned": true
                    }
                }))
            } catch (e) {
                console.log(e)
            }
        }
    });
  }
}

export function emitIdentity(userId) {
    socket.emit('identity', userId);
}

export function emitWaiting(userId) {
    socket.emit('waiting', userId);
}