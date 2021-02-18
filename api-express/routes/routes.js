const express = require('express');
const status = require('http-status-codes');

const router = express.Router();

router.get('/customer', (req, res) => {
  res.status(status.OK).send('Your have reached the example route');
});

router.post('/customer', (req, res) => {
  res
    .status(status.OK)
    .send(`You have reached post with data ${req.body.username}`);
});

module.exports = router;
