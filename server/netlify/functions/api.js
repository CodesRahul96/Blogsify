const serverless = require("serverless-http");
const app = require("../../index");

// Wrap express app with serverless-http for Netlify Functions runtime
const handler = serverless(app);

module.exports.handler = async (event, context) => {
  // Allow Netlify functions to return immediately without waiting for NodeJS event loop to empty (preserves mongoose pool)
  context.callbackWaitsForEmptyEventLoop = false;
  return await handler(event, context);
};
