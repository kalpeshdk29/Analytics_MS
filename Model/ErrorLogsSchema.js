const mongoose = require("mongoose");

const errorLogSchema = new mongoose.Schema({
    errorId: { type: String, required: true }, // Unique identifier for the error.
    apiId: { type: String, required: true }, // Associated API endpoint.
    collectionId: { type: String, required: true }, // Associated collection ID.
    userId: { type: String, required: true }, // Associated collection ID.
    projectId: { type: String, required: true }, // Associated project ID.
    timestamp: { type: Date, default: Date.now }, // Time of the error occurrence.
    statusCode: { type: Number, required: true }, // HTTP status code of the error.
    errorMessage: { type: String, required: true }, // Error message.
    stackTrace: { type: String }, // Stack trace for debugging.
    clientIp: { type: String }, // IP address of the client causing the error.
    userAgent: { type: String }, // User agent of the client causing the error.
  });

  module.exports = mongoose.model('ErrorLog', errorLogSchema);