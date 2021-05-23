const deploymentUrl = "https://nodejs-chat-app-demo.herokuapp.com";
//const deploymentUrl = "http://localhost:3000";

const addMessage = (...messages) => {
    const messagesDiv = document.getElementById('messages');
    messages.forEach(message => {
        const containerDiv = document.createElement('DIV');
        const senderHeading = document.createElement('H3');
        const messageDiv = document.createElement('DIV');

        senderHeading.className = "message-sender text-muted";
        messageDiv.className = "message-text";

        senderHeading.append(message.sender);
        messageDiv.append(message.text);
        containerDiv.append(senderHeading, messageDiv);
        messagesDiv.append(containerDiv);
    });
};

const deleteAllMessages = () => {
    const messages = document.getElementById('messages').children;

    //starting loop at the end of the list because children property is live meaning messages will be updated each time the document changes
    for (let i = messages.length - 1; i >= 0; i--)
        messages[i].remove();
};

const updateOnlineUsersCount = count => {
    const countSpan = document.getElementById('online-users').lastElementChild;
    countSpan.textContent = count;
}

const updateTabTitleOnMessageUpdate = (interval) => {
    let intervalId = null;
    let unseenMessages = 0;

    const clearTitle = () => {
        clearInterval(intervalId);
        unseenMessages = 0;
        document.title = 'Simple Chat App';
    }

    const incrementUnseenMessages = () => {
        clearInterval(intervalId);
        unseenMessages++;
        let defaultTitle = false;
        intervalId = setInterval(() => {
            document.title = defaultTitle ? 'Simple Chat App' : `(${unseenMessages}) New Messages!`;
            defaultTitle = !defaultTitle;
        }, interval)
    };

    return {
        newMessage: incrementUnseenMessages,
        reset: clearTitle
    }
};

const socket = io();
const notificationHandler = updateTabTitleOnMessageUpdate(2000);

let isWindowActive = true;

window.onblur = () => isWindowActive = false;

window.onfocus = () => {
    isWindowActive = true;
    notificationHandler.reset();
};

socket.on('message', message => {
    addMessage(message);
    if (!isWindowActive)
        notificationHandler.newMessage();
});
socket.on('deleteall', () => deleteAllMessages());
socket.on('onlinecountupdate', updateOnlineUsersCount);

document.addEventListener('DOMContentLoaded', function () {
    fetch(`${deploymentUrl}/messages`)
        .then(res => res.json())
        .then(data => {
            addMessage(...data);
        })
        .catch(err => console.error('An error has occurred: ', err));

    const sendButton = document.getElementById('send-button');
    sendButton.onclick = () => {
        console.log('send button clicked');
        const senderElem = document.getElementById('name-input');
        const textElem = document.getElementById('message-input');

        fetch(`${deploymentUrl}/messages`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "sender": senderElem.value,
                "text": textElem.value
            })
        })
            .then(() => textElem.value = "")
            .catch(err => console.error('Message creation failed: ', err));
    }

    const clearAllButton = document.getElementById('clear-all');
    clearAllButton.onclick = () => {
        console.log("Clear all button clicked");
        fetch(`${deploymentUrl}/messages`, {
            method: 'DELETE'
        })
            .catch(err => console.error("Messages deletion failed: ", err));
    }

});



