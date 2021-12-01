const express = require('express');
// const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const commentsByPostId = {};
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  try {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({ id: commentId, content, status: "pending" });

    commentsByPostId[req.params.id] = comments;

    await axios.post(`http://event-bus-srv:4005/events`, {
      type: `CommentCreated`,
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: "pending"
      }
    }).catch((err) => {
      console.log(err.message)
    });
    res.status(201).send(comments);
  } catch (e) {
    console.log('error message:', e)
  };
})

app.post(`/events`, async (req, res) => {
  const { type, data: { id, content, status, postId } } = req.body
  console.log(`PP >>>>Received Event`, type)
  if (type === 'CommentModerated') {
    const comments = commentsByPostId[postId];

    const comment = comments.find(comment => {
      return comment.id === id;
    })
    comment.status = status
    await axios.post(`http://event-bus-srv:4005/events`, {
      type: 'CommentUpdated',
      data: {
        id, content, status, postId
      }
    }).catch((err) => {
      console.log(err.message)
    });
  }
  res.status(200).send({});
})

app.listen(4001, () => {
  console.log('Listening on 4001');
});
