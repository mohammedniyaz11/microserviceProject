const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')


const commentsByPostId = {};
console.log(commentsByPostId)
app.use(bodyParser.json())
app.use(cors())
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || [])
})


app.post('/posts/:id/comments', (req, res) => {
    try {
        const id = randomBytes(4).toString('hex')
        const { content } = req.body
        const comments = commentsByPostId[req.params.id] || []
        comments.push({ id: id, content })
        commentsByPostId[req.params.id] = comments
        res.status(201).send(commentsByPostId[req.params.id])
    } catch (error) {
        console.log(error)
    }
})

app.listen(4001, () => {
    console.log(`listening on  comment the port 4001`)
})