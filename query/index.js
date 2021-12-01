const express = require('express');
const cors = require('cors')
const app = express()
const axios = require('axios')
app.use(cors())
app.use(express.json())

const posts = {}

const handleEvent = (type, data) => {
    if (type == 'PostCreated') {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] }
    }

    if (type == 'CommentCreated') {
        const { id, postId, content, status } = data
        const post = posts[postId]
        post.comments.push({ id, content, status })
    }

    if (type === 'CommentUpdated') {
        const { id, postId, content, status } = data
        const post = posts[postId]
        const comment = post.comments.find(comment => {
            return comment.id === id
        });
        comment.status = status
        comment.content = content
    }
}

app.get('/posts', async (req, res) => {
    res.send(posts)
});


app.post('/events', async (req, res) => {
    try {
        const { type, data } = req.body
        handleEvent(type, data)
        res.send({})
    } catch (error) {
        console.log('error message:', error.message)
    }

});

app.listen(4002, async () => {
    console.log(`app running on post 4002`)
    const res = await axios.get('http://event-bus-srv:4005/events').catch((err) => {
        console.log(err.message)
    });

    for (let event of res.data) {
        console.log(`Processing event:`, event.type)
        handleEvent(event.type, event.data)
    }
})