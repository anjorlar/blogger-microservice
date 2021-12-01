// const express, { json } = require('express');
const express = require('express');
const axios = require('axios');

const app = express()
app.use(express.json())
const events = [];
app.post('/events', async (req, res) => {
    try {
        const event = req.body;
        events.push(event)
        console.log('event', event)
        await axios.post('http://posts-clusterip-srv:4000/events', event).catch((err) => {
            console.log(err.message)
        });; // post endpoint
        await axios.post('http://comments-srv:4001/events', event).catch((err) => {
            console.log(err.message)
        });; // comment endpoint
        await axios.post('http://query-srv:4002/events', event).catch((err) => {
            console.log(err.message)
        });; // query endpoint
        await axios.post('http://moderation-srv:4003/events', event).catch((err) => {
            console.log(err.message)
        });; // moderation endpoint
        res.send({ status: 'OK' })
    } catch (err) {
        console.log('err', err.message)
    }
})

app.get('/events', (req, res) => {
    res.send(events)
})

app.listen(4005, () => {
    console.log('listening on port 4005')
})