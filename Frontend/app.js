// app.js

// Register Form
const registerForm = document.getElementById('register-form');
const registerUsernameInput = document.getElementById('register-username-input');
const registerPasswordInput = document.getElementById('register-password-input');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = registerUsernameInput.value.trim();
  const password = registerPasswordInput.value.trim();

  if (username === '' || password === '') {
    alert('Please enter a username and password.');
    return;
  }

  try {
    const response = await axios.post('http://localhost:3000/register', {
      username,
      password,
    });

    alert(response.data.message);
    // Optionally, redirect the user to the chat page or perform other actions upon successful registration
  } catch (error) {
    alert(error.response.data.error);
  }

  registerUsernameInput.value = '';
  registerPasswordInput.value = '';
});

// Login Form
const loginForm = document.getElementById('login-form');
const loginUsernameInput = document.getElementById('login-username-input');
const loginPasswordInput = document.getElementById('login-password-input');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = loginUsernameInput.value.trim();
  const password = loginPasswordInput.value.trim();

  if (username === '' || password === '') {
    alert('Please enter a username and password.');
    return;
  }

  try {
    const response = await axios.post('http://localhost:3000/login', {
      username,
      password,
    });

    alert(response.data.message);
    // Optionally, redirect the user to the chat page or perform other actions upon successful login
  } catch (error) {
    alert(error.response.data.error);
  }

  loginUsernameInput.value = '';
  loginPasswordInput.value = '';
});

// Fetch Messages
async function fetchMessages() {
  try {
    const response = await axios.get('http://localhost:3000/chat');
    const blockchain = response.data.blockchain;

    // Display messages in the chat interface
    blockchain.forEach((block) => {
      const message = decryptMessage(block.message);
      displayMessage(block.sender, message, block.timestamp);
    });
  } catch (error) {
    console.log(error);
  }
}

function displayMessage(sender, content, timestamp) {
  // Create and display the message in the chat interface
  // ...
}

// Fetch and display messages when the page loads
fetchMessages();
