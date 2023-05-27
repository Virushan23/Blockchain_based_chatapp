const express = require('express');
const crypto = require('crypto');
const WebSocket = require('ws');

const app = express();
app.use(express.json());

const users = [];
const blockchain = [];

// WebSocket server setup
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const { userId, recipient, content } = JSON.parse(message);

    const sender = users.find((user) => user.id === userId);
    if (!sender) {
      return ws.send(JSON.stringify({ error: 'Invalid user ID' }));
    }

    const encryptedMessage = encryptMessage(content);

    const block = {
      sender: sender.username,
      recipient,
      message: encryptedMessage,
      timestamp: new Date().getTime(),
    };

    blockchain.push(block);

    wss.clients.forEach((client) => {
      if (client !== ws) {
        client.send(JSON.stringify({ type: 'message', block }));
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const userId = crypto.randomBytes(16).toString('hex');
  users.push({ id: userId, username, password });
  res.json({ message: 'User registered successfully', userId });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find((user) => user.username === username && user.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ message: 'Login successful', userId: user.id });
});

app.post('/send', (req, res) => {
  const { userId, recipient, message } = req.body;

  const sender = users.find((user) => user.id === userId);
  if (!sender) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  const encryptedMessage = encryptMessage(message);

  const block = {
    sender: sender.username,
    recipient,
    message: encryptedMessage,
    timestamp: new Date().getTime(),
  };

  blockchain.push(block);

  res.json({ message: 'Message sent successfully', block });
});

app.get('/chat', (req, res) => {
  res.json({ blockchain });
});

function encryptMessage(message) {
  const key = crypto.randomBytes(16);
  const encrypted = Buffer.from(
    message
      .split('')
      .map((char, index) => char.charCodeAt() ^ key[index % 16])
  );

  return {
    message: encrypted.toString('hex'),
    key: key.toString('hex'),
  };
}

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
