const express = require('express');
const toast = require('toast');

const app = express();
const logger = toast();

app.use(logger.middleware());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});