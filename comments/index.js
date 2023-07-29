const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')
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
        await axios.post('http://localhost:4005/events', {
            type: "comment created",
            data: {
                id: id,
                content: content,
                postId: req.params.id
            }
        })
        res.status(201).send(commentsByPostId[req.params.id])
    } catch (error) {
        console.log(error)
    }
})


app.post('/events', (req, res) => {
    console.log('Event recives:', req.body.type)
    res.send({});

})

app.listen(4001, () => {
    console.log(`listening on  comment the port 4001 comment port`)
})