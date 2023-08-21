const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const urls = {
    URL_EVENT_SERVICE: 'event-bus-srv:4005',
    URL_POST_SERVICE: 'posts-clusterip-srv:4000'
}

const app = express()
app.use(bodyParser.json())

app.post('/events', async (req, res) => {
    const { type, data } = req.body;
    if (type === 'CommentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';
        await axios.post(`http://${urls.URL_EVENT_SERVICE}/events`, {
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        })
        res.send({})
    }

})

app.listen(4003, () => {
    console.log('listening on 4003')
})