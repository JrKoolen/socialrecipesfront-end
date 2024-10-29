const session = require('express-session');

module.exports = session({
  secret: 'your-session-secret', 
  resave: false,                 
  saveUninitialized: false,      
  cookie: { 
    secure: false,              
    maxAge: 24 
  }
});
