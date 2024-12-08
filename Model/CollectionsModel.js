const mongoose = require("mongoose");

const collectionSchemaModel= new mongoose.Schema({
    userId: { type: String, required: true },
    projectId: { type: String, required: true },
    collectionId: { type: String, required: true },
    collectionName: { type: String, required: true },
    description: { type: String, required: true },
    token: { type: String, required: true },
    documentCount: { type: Number, default:0 },
    dataSize: { type: Number, required: true },
    creationDate: { type: Date, required: true },
    lastUpdated: { type: Date, required: true },
    schema: { type: Object, required: true , null:false}
  });
  
  module.exports = mongoose.model('CollectionSchema', collectionSchemaModel);
  