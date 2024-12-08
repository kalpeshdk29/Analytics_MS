const ApiCallLog = require('../Model/APICallLogSchema');
const CollectionAnalytics = require('../Model/CollectionAnalyticsSchema');
const collectionSchemaModel = require('../Model/CollectionsModel');
/**
 * Handles API Call Logs and updates Collection Analytics
 * @param {Object} data - object containing API call log data
 * @param {string} data.apiId - API endpoint identifier
 * @param {string} data.collectionId - Associated collection ID
 * @param {number} data.statusCode - HTTP status code of the API call
 * @param {number} data.responseTime - Time taken to process the request (ms)
 * @param {string} data.clientIp - IP address of the client making the request
 * @param {string} data.userAgent - User agent of the client making the request
 * @param {Date} data.timestamp - Time of the API call
 * @param {Object} data.requestHeaders - Request headers
 */
const handleApiCallLogs = async (data) => {
    try {
      const {
        apiId,
        collectionId,
        statusCode,
        responseTime,
        clientIp,
        userAgent,
        timestamp,
        requestHeaders,
      } = data;
        console.log("id",collectionId);
      // Fetch the collection details
      const collection = await collectionSchemaModel.findOne({ collectionId:collectionId });
  
      if (!collection) {
        console.log("Collection not found: ", collectionId);
        return;
      }
  
      // Log the API Call
      const apiLog = new ApiCallLog({
        apiId,
        collectionId,
        projectId: collection.projectId || "unknown",
        userId: collection.userId || "unknown",
        statusCode,
        responseTime,
        clientIp,
        userAgent,
        timestamp,
      });
      await apiLog.save();
  
      // Update Collection Analytics
      const analytics =
        (await CollectionAnalytics.findOne({ collectionId })) ||
        new CollectionAnalytics({
          collectionId,
          projectId: collection.projectId,
          userId: collection.userId,
        });
  
      analytics.totalApiCalls += 1;
      if (statusCode >= 400) analytics.errorCount += 1;
      analytics.averageResponseTime =
        ((analytics.averageResponseTime * (analytics.totalApiCalls - 1)) +
          responseTime) /
        analytics.totalApiCalls;
  
      const region = requestHeaders["x-region"] || "Unknown"; // Example: use a custom region header
      const regionEntry = analytics.usageByRegion.find((r) => r.region === region);
      if (regionEntry) {
        regionEntry.callCount += 1;
      } else {
        analytics.usageByRegion.push({ region, callCount: 1 });
      }
  
      const apiIndex = analytics.topApis.findIndex((api) => api.apiId === apiId);
      if (apiIndex !== -1) {
        analytics.topApis[apiIndex].callCount += 1;
      } else {
        analytics.topApis.push({ apiId, callCount: 1 });
      }
  
      await analytics.save();
      console.log("API Call Log and Analytics updated for collection:", collectionId);
    } catch (error) {
      console.error("Error handling API Call Logs:", error.message);
    }
  };
  

/**
 * Handles Error Logs and updates Collection Analytics
 * @param {Object} data - object containing error log data
 * @param {string} data.apiId - API endpoint identifier
 * @param {string} data.collectionId - Associated collection ID
 * @param {number} data.statusCode - HTTP status code of the error
 * @param {string} data.errorMessage - Error message
 * @param {string} data.clientIp - IP address of the client causing the error
 * @param {string} data.userAgent - User agent of the client causing the error
 * @param {Date} data.timestamp - Time of the error occurrence
 */
  const handleErrorLogs = async (data) => {
    try {
      const {
        apiId,
        collectionId,
        statusCode,
        errorMessage,
        clientIp,
        userAgent,
        timestamp,
      } = data;
  
      // Fetch the collection details
      const collection = await collectionSchemaModel.findOne({ collectionId });
  
      if (!collection) {
        console.log("Collection not found for error log: ", collectionId);
        return;
      }
  
      // Log the Error
      const errorLog = new ErrorLog({
        apiId,
        collectionId,
        projectId: collection.projectId || "unknown",
        userId: collection.userId || "unknown",
        statusCode,
        errorMessage,
        clientIp,
        userAgent,
        timestamp,
      });
      await errorLog.save();
  
      // Update Collection Analytics
      const analytics =
        (await CollectionAnalytics.findOne({ collectionId })) ||
        new CollectionAnalytics({
          collectionId,
          projectId: collection.projectId,
          userId: collection.userId,
        });
  
      analytics.totalApiCalls += 1;
      analytics.errorCount += 1;
  
      await analytics.save();
      console.log("Error Log and Analytics updated for collection:", collectionId);
    } catch (error) {
      console.error("Error handling Error Logs:", error.message);
    }
  };
  

module.exports = { handleApiCallLogs, handleErrorLogs };