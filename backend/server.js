const express = require('express');
const AWS = require('aws-sdk');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

AWS.config.update({ region: 'us-east-1' });

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).send('Service is healthy');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});