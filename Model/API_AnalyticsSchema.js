const mongoose = require("mongoose");

const ApiAnalyticsSchema= new mongoose.Schema({
    userId: { type: String, required: true },
    collectionId: { type: String, required: true },
    title: { type: String, required: true },
    statusCode: { type: Number, required: true },
    timeStamp: { type: Date, required: true },
  });
  
  module.exports = mongoose.model('ApiAnalytics', ApiAnalyticsSchema);
  