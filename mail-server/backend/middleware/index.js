const jwt = require("jsonwebtoken");
const redis = require("redis");
const redisClient = redis.createClient(process.env.REDIS_URL);

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided." });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(500).json({ message: "Failed to authenticate token." });
    req.userId = decoded.id;
    next();
  });
};

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = "__express__" + req.originalUrl || req.url;
    redisClient.get(key, (err, reply) => {
      if (reply) {
        res.send(JSON.parse(reply));
      } else {
        res.sendResponse = res.send;
        res.send = (body) => {
          redisClient.setex(key, duration, JSON.stringify(body));
          res.sendResponse(body);
        };
        next();
      }
    });
  };
};

module.exports = { verifyToken, cacheMiddleware };
