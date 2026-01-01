const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
  // Session auth object is usually set during login like:
  // req.session.authorization = { accessToken: token, username: <username> }

  const authSession = req.session.authorization;

  if (!authSession || !authSession.accessToken) {
    return res.status(401).json({ message: "Access token missing. Please login." });
  }

  const token = authSession.accessToken;

  try {
    const payload = jwt.verify(token, "fingerprint_customer"); // must match your login secret
    // Optional: attach decoded payload to request for downstream routes
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
