const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const { urls } = require('../helpers/urls.helpers')

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