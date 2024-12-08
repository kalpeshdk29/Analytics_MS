const mongoose = require("mongoose");

const apiCallLogSchema = new mongoose.Schema({
    apiId: { type: String, required: true }, // API endpoint identifier.
    collectionId: { type: String, required: true }, // Associated collection ID.
    userId: { type: String, required: true }, // Associated collection ID.
    projectId: { type: String, required: true }, // Associated project ID.
    timestamp: { type: Date, default: Date.now }, // Time of the API call.
    responseTime: { type: Number, required: true }, // Time taken to process the request (ms).
    statusCode: { type: Number, required: true }, // HTTP status code (200, 400, etc.).
    errorMessage: { type: String }, // Error message if the API call fails.
    clientIp: { type: String }, // IP address of the client making the request.
    userAgent: { type: String }, // User agent of the client making the request.
  });
  
  module.exports = mongoose.model('ApiCallLog', apiCallLogSchema);