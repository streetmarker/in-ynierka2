const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const serviceAccount = require('./justfirstsite-firebase-adminsdk-a9bgt-65782bfe44.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(bodyParser.json());

// const messaging = admin.messaging();
const db = admin.firestore();

app.post('/send-notification', (req, res) => {
  const { title, body, token } = req.body;

const message = {
    notification: {
      title: title || 'Hello',
      body: body || 'This is a test message',
      image: 'https://miro.medium.com/v2/resize:fit:300/1*R4c8lHBHuH5qyqOtZb3h-w.png'
    },
    token: token || 'cZoSBJLrsOZhsJf5AdE5uf:APA91bEwHczYy_ZE2W9UUmqlh0tztAVHonxMRhMjlLUzbNQ7kLzXnMN_IlFYFG8zOcc5riV4nqwn7bpZJND1_FMIZynM7eHQkxIL_5i9vsBpCn2Kx3Ks2L_Q_xIfdJw-JhJwHvWZrNQ-'
  };

  admin.messaging().send(message)
    .then(response => {

      let today = new Date();
      let data = {
        date : today,
        status: 'SUCCESS',
        message
      };
      db.collection('notification').add(data);

      console.log('Successfully sent message:', response);
      res.status(200).send('Notification sent successfully');
    })
    .catch(error => {

      let e = String(error);
      let today = new Date();
      let data = {
        date : today,
        status: 'ERROR',
        errorMessage: e,
        message
      };
      db.collection('notification').add(data);

      console.log('Error sending message:', error);
      res.status(500).send('Error sending notification');
    });
});

// Uruchomienie serwera
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
