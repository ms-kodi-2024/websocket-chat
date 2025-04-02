const messagesSection = document.querySelector('#messages-section');
const messagesList = document.querySelector('#messages-list');
const addMessageForm = document.querySelector('#add-messages-form');
const userNameInput = document.querySelector('#username');
const messageContentInput = document.querySelector('#message-content');
const loginForm = document.querySelector('#welcome-form');

let userName = '';

const socket = io();

const login = (e) => {
  e.preventDefault();
  const enteredName = userNameInput.value.trim();
  if (enteredName === '') {
    alert('Please enter your name!');
  } else {
    userName = enteredName;
    loginForm.classList.remove('show');        
    messagesSection.classList.add('show');
    socket.emit('join', userName); 
  }
};

loginForm.addEventListener('submit', login);

function addMessage(author, content) {
  const message = document.createElement('li');
  message.classList.add('message', 'message--received');
  if (author === 'Chat Bot') message.classList.add('message--bot');
  if (author === userName) message.classList.add('message--self');
  message.innerHTML = `
    <h3 class="message__author">${author === userName ? 'You' : author}</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
}

const sendMessage = (e) => {
  e.preventDefault();
  const messageContent = messageContentInput.value.trim();
  if (messageContent === '') {
    alert('You must write something!');
  } else {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent });
    messageContentInput.value = '';
  }
};

addMessageForm.addEventListener('submit', sendMessage);

socket.on('message', ({ author, content }) => addMessage(author, content));

socket.on('newUser', (newUserName) => {
  addMessage('Chat Bot', `${newUserName} has joined the conversation!`);
});

socket.on('removeUser', (leftUserName) => {
  addMessage('Chat Bot', `${leftUserName} has left the conversation... :(`);
});
