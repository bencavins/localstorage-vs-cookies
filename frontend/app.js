const saveDataBtn = document.getElementById('save-data-btn');
const sendDataBtn = document.getElementById('send-data-btn');

let loadedToken;

function getAndSaveTokenLocalStorage() {
  fetch('http://localhost:3000/authenticate-token')
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem('token', data.token);
    });
}

function getAndSaveTokenCookie() {
  fetch('http://localhost:3000/authenticate-token')
    .then((response) => response.json())
    .then((data) => {
      document.cookie = 'token=' + data.token;
    });
}

function getAndSaveTokenHttpOnlyCookie() {
  fetch('http://localhost:3000/authenticate-cookie')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
}

function loadFromLocalStorage() {
  const token = localStorage.getItem('token');
  loadedToken = token;
}

function loadFromCookie() {
  try {
    const token = document.cookie
      .split(';')
      .find((c) => c.startsWith('token'))
      .split('=')[1];
    loadedToken = token;
  } catch (err) {
    console.log('No cookie found.');
  }
}

async function sendData() {
  // loadFromLocalStorage();
  loadFromCookie();
  console.log(loadedToken);
  const response = await fetch('http://localhost:3000/user-data', {
    headers: {
      Authorization: 'Bearer ' + loadedToken,
    },
  });
  const responseData = await response.json();
  if (response.ok) {
    console.log('SUCCESS!');
  } else {
    console.log('FAILED!');
  }
  console.log(responseData);
}

sendDataBtn.addEventListener('click', sendData);
// saveDataBtn.addEventListener('click', getAndSaveTokenLocalStorage);
saveDataBtn.addEventListener('click', getAndSaveTokenCookie);
// saveDataBtn.addEventListener('click', getAndSaveTokenHttpOnlyCookie);

const messageInput = document.getElementById('message');
const imageUrlInput = document.getElementById('image-url');
const inputForm = document.querySelector('form');
const userOutputElement = document.getElementById('user-output');

function renderUserInput(msg, imageUrl) {
  fetch('http://localhost:5555/messages')
    .then(response => response.json())
    .then(messages => {
      let content = ''
      for (message of messages) {
        const renderedContent = `
          <div>
            <p>
              <img src="${message['img-src']}" alt="${message['message-text']}">
              ${message['message-text']}
            </p>
          </div>
        `;
        content += renderedContent
      
      }
      userOutputElement.innerHTML = content;
      userOutputElement.style.display = 'block';
    });
  inputForm.reset();
}
renderUserInput();

inputForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const enteredMessage = messageInput.value;
  const enteredImageUrl = imageUrlInput.value;

  sendMessageData({
    "message-text": enteredMessage,
    "img-src": enteredImageUrl
  });

  renderUserInput(enteredMessage, enteredImageUrl);
});

function sendMessageData(message) {
  fetch('http://localhost:5555/messages', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  })
  .then(response => response.json());
}

