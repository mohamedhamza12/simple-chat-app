const deploymentUrl = "https://nodejs-chat-app-demo.herokuapp.com";
//const deploymentUrl = "http://localhost:3000";

const showLoadingScreen = () => {
    document.getElementById('loading-screen').className = "show-loading";
}

const hideLoadingScreen = () => {
    document.getElementById('loading-screen').className = "";
}

const addMessage = (...messages) => {
    const messagesDiv = document.getElementById('messages');
    messages.forEach(message => {
        const containerDiv = document.createElement('DIV');
        const senderSpan = document.createElement('SPAN');
        const messageSpan = document.createElement('SPAN');
        const xIcon = document.createElement('I');

        containerDiv.className = "message-container p-1 rounded mb-1 d-flex align-items-center";
        containerDiv.dataset.id = message._id;
        senderSpan.className = "message-sender me-2 text-white-50";
        messageSpan.className = "message-text text-white";
        xIcon.className = "delete-message-icon fas fa-times ms-auto me-1 d-none";

        containerDiv.onmouseover = () => {
            xIcon.classList.remove('d-none');
        }

        containerDiv.onmouseout = () => {
            xIcon.classList.add('d-none');
        }

        xIcon.onclick = () => {
            showLoadingScreen();
            fetch(`${deploymentUrl}/messages/${containerDiv.dataset.id}`, {
                method: 'DELETE'
            })
                .finally(hideLoadingScreen);
        }

        senderSpan.append(`${message.sender}: `);
        messageSpan.append(message.text);
        containerDiv.append(senderSpan, messageSpan, xIcon);
        messagesDiv.append(containerDiv);

    });
};

const deleteOneMessage = id => {
    const messageContainerDiv = document.querySelector(`[data-id='${id}']`);
    messageContainerDiv.remove();
}

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
socket.on('deleteone', deleteOneMessage)
socket.on('onlinecountupdate', updateOnlineUsersCount);

document.addEventListener('DOMContentLoaded', function () {
    fetch(`${deploymentUrl}/messages`)
        .then(res => res.json())
        .then(data => {
            addMessage(...data);
        })
        .catch(err => console.error('An error has occurred: ', err));

    const sendButton = document.getElementById('send-button');
    sendButton.onclick = e => {
        const senderElem = document.getElementById('name-input');
        const textElem = document.getElementById('message-input');
        const messageForm = document.getElementById('message-form');

        if (!messageForm.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
            messageForm.className = 'was-validated';
        } else {
            messageForm.className = '';
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
    }

    const clearAllButton = document.getElementById('clear-all');
    clearAllButton.onclick = () => {
        fetch(`${deploymentUrl}/messages`, {
            method: 'DELETE'
        })
            .catch(err => console.error("Messages deletion failed: ", err));
    }

});



