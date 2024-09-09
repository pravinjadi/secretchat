// Import socket.io-client
const socket = io('https://your-backend-server-url'); // Use the URL where you deployed your backend

// Get elements
const newRoomButton = document.getElementById('newRoomButton');
const roomCodeInput = document.getElementById('roomCodeInput');
const chatPage = document.getElementById('chat-page');
const homePage = document.getElementById('home-page');
const leaveRoomButton = document.getElementById('leaveRoomButton');
const sendMessageButton = document.getElementById('sendMessageButton');
const messageInput = document.getElementById('messageInput');
const chatWindow = document.getElementById('chatWindow');

let currentRoom = null;

// Handle New Room Creation
newRoomButton.addEventListener('click', function() {
    const roomId = generateRoomId();
    window.history.pushState({}, '', `?room=${roomId}`);
    loadChatRoom(roomId);
});

// Handle Enter Room Code
roomCodeInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const roomId = roomCodeInput.value.trim();
        if (roomId) {
            window.history.pushState({}, '', `?room=${roomId}`);
            loadChatRoom(roomId);
        }
    }
});

// Load Chat Room Page and join the room via WebSocket
function loadChatRoom(roomId) {
    homePage.style.display = 'none';
    chatPage.style.display = 'flex';
    currentRoom = roomId;
    
    socket.emit('joinRoom', roomId);
    initializeChat();
}

// Generate Random Room ID
function generateRoomId() {
    return Math.random().toString(36).substring(2, 9);
}

// Leave Chat Room
leaveRoomButton.addEventListener('click', function() {
    window.history.pushState({}, '', '/');
    homePage.style.display = 'flex';
    chatPage.style.display = 'none';
    chatWindow.innerHTML = '';  // Clear chat window when leaving
});

// Initialize the chat room
function initializeChat() {
    sendMessageButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Listen for incoming messages
    socket.on('receiveMessage', function(data) {
        displayMessage(data.sender, data.message);
    });
}

// Handle sending a message
function sendMessage() {
    const message = messageInput.value.trim();
    if (message !== '') {
        displayMessage('You', message);
        socket.emit('sendMessage', { roomId: currentRoom, sender: 'You', message });
        messageInput.value = '';  // Clear input after sending
    }
}

// Function to display message in the chat window
function displayMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    const senderElement = document.createElement('span');
    senderElement.classList.add('sender');
    senderElement.textContent = `${sender}: `;
    
    const messageTextElement = document.createElement('span');
    messageTextElement.classList.add('message-text');
    messageTextElement.textContent = message;
    
    messageElement.appendChild(senderElement);
    messageElement.appendChild(messageTextElement);
    
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to the latest message
}
