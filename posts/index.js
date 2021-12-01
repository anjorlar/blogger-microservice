const express = require('express');
const { randomBytes } = require('crypto');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id,
    title
  };

  await axios.post(`http://event-bus-srv:4005/events`, {
    type: `PostCreated`,
    data: {
      id, title
    }
  }).catch((err) => {
    console.log(err.message)
  });
  res.status(201).send(posts[id]);

});

app.post(`/events`, (req, res) => {
  const { type, data: { id, title } } = req.body
  console.log(`Received Event`, type)
  res.status(200).send({});
})
app.listen(4000, () => {
  console.log('>>>> 55')
  console.log('Listening on 4000');
});
