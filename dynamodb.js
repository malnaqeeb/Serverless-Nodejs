const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient({
	region: 'localhost',
	endpoint: 'http://localhost:8000'
});

module.exports = dynamoDB