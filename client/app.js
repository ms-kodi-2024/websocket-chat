const messagesSection = document.querySelector('#messages-section');
const messagesList = document.querySelector('#messages-list');
const addMessageForm = document.querySelector('#add-messages-form');
const userNameInput = document.querySelector('#username');
const messageContentInput = document.querySelector('#message-content');
const loginForm = document.querySelector('#welcome-form');

let userName = '';

const login = (e) => {
  e.preventDefault();
  const enteredName = userNameInput.value.trim();
  if (enteredName === '') {
    alert('Please enter your name!');
  } else {
    userName = enteredName;
    loginForm.classList.remove('show');        
    messagesSection.classList.add('show');
  }
};

loginForm.addEventListener('submit', login);
