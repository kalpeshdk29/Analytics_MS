const mongoose = require("mongoose");
const collectionAnalyticsSchema = new mongoose.Schema({
    collectionId: { type: String, required: true, unique: true }, // Associated collection ID.
    projectId: { type: String, required: true }, // Associated project ID.
    userId: { type: String, required: true }, // Associated project ID.
    totalApiCalls: { type: Number, default: 0 }, // Total API calls for this collection.
    errorCount: { type: Number, default: 0 }, // Total errors in the collection.
    averageResponseTime: { type: Number, default: 0 }, // Avg response time (ms).
    topApis: [{ apiId: String, callCount: Number }], // List of top APIs by usage.
    usageByRegion: [{ region: String, callCount: Number }], // API usage by region.
  });

  module.exports = mongoose.model('CollectionAnalytics', collectionAnalyticsSchema);