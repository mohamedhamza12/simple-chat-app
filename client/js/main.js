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

const socket = io();

socket.on('message', message => addMessage(message));

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3000/messages')
        .then(res => res.json())
        .then(data => addMessage(...data));

    const sendButton = document.getElementById('send-button');
    sendButton.onclick = () => {
        const senderElem = document.getElementById('name-input');
        const textElem = document.getElementById('message-input');

        fetch('http://localhost:3000/messages', {
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

});



