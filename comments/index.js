const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')
const { urls } = require('../helpers/urls.helpers')
const axios = require('axios')

const commentsByPostId = {};
console.log(commentsByPostId)
app.use(bodyParser.json())
app.use(cors())
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || [])
})


app.post('/posts/:id/comments', async (req, res) => {
    try {
        const id = randomBytes(4).toString('hex')
        const { content } = req.body
        const comments = commentsByPostId[req.params.id] || []
        comments.push({ id: id, content })
        commentsByPostId[req.params.id] = comments;
        await axios.post(`http://${urls.URL_EVENT_SERVICE}/events`, {
            type: "CommentCreated",
            data: {
                id: id,
                content: content,
                postId: req.params.id,
                status: 'Pending'
            }
        })
        res.status(201).send(commentsByPostId[req.params.id])
    } catch (error) {
        console.log(error)
    }
})


app.post('/events', async (req, res) => {
    console.log('Event recives:', req.body.type)
    const { type, data } = req.body
    if (type === 'CommentModerated') {
        const { postId, id, status, content } = data
        const comments = commentsByPostId[postId]
        const comment = comments.find(comment => {
            return comment.id === id
        })
        comment.status = status
        await axios.post(`http://${urls.URL_EVENT_SERVICE}/events`, {
            type: 'CommentUpdated',
            data: {
                id, status, postId, content
            }
        })
    }
    res.send({});

})

app.listen(4001, () => {
    console.log(`listening on  comment the port 4001 comment port`)
})