const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios')
const urls = {
    URL_EVENT_SERVICE: 'event-bus-srv:4005',
    URL_POST_SERVICE: 'posts-clusterip-srv:4000'
}
const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};
const handleEvent = (type, data) => {

    if (type === 'PostCreated') {
        const { id, title } = data;

        posts[id] = { id, title, comments: [] };
    }

    if (type === 'CommentCreated') {
        // console.log(data, "===data")
        const { id, content, postId, status } = data;

        const post = posts[postId];
        post.comments.push({ id, content, status });
    }
    if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data
        const post = posts[postId]
        const comment = post.comments.find(comment => {
            return comment.id === id
        })
        comment.status = status
        comment.content = content
    }
}

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);



    res.send({});
});

app.listen(4002, async () => {
    try {
        console.log('Listening on 4002 query port');
        const res = await axios.get(`http://${urls.URL_EVENT_SERVICE}/events`)
        for (let event of res.data) {
            console.log('processing events', event.type)
            handleEvent(event.type, event.data)
        }
    } catch (err) {
        console.log(err)
    }
});
