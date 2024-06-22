import memoryCache from "memory-cache";

// Define cache duration in seconds
const duration = 60; // Adjust as needed

// Cache middleware
export const cacheMiddleware = (req, res, next) => {
  const key = '__express__' + (req.originalUrl || req.url);
  const cachedBody = memoryCache.get(key);
  if (cachedBody) {
    res.send(cachedBody);
    return;
  } else {
    const sendResponse = res.send;
    res.send = (body) => {
      memoryCache.put(key, body, duration * 700); // Set cache duration in seconds
      sendResponse.call(res, body);
    };
    next();
  }
};
