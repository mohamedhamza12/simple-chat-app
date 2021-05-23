const deploymentUrl = "https://nodejs-chat-app-demo.herokuapp.com";

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

const socket = io();

socket.on('message', message => addMessage(message));
socket.on('deleteall', () => deleteAllMessages());
socket.on('onlinecountupdate', updateOnlineUsersCount);

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('new-button').onclick = () => alert('Hello');
    fetch(`${deploymentUrl}/messages`)
        .then(res => res.json())
        .then(data => addMessage(...data));

    const sendButton = document.getElementById('send-button');
    sendButton.onclick = () => {
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
    }

    const clearAllButton = document.getElementById('clear-all');
    clearAllButton.onclick = () => {
        fetch(`${deploymentUrl}/messages`, {
            method: 'DELETE'
        });
    }

});



