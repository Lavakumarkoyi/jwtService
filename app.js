let jwt = require('jsonwebtoken');
// const serverless = require("serverless-http");
require('dotenv').config();
let config = require('./config.js');
const cors = require('cors');

let express = require('express'),
  app = express(),
  port = process.env.PORT || 8001,
  bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(cors({
  origin: ['http://127.0.0.1:5501', 'https://www.cuone.org/'], 
  methods: ['POST'], 
  maxAge: 86400
}));


app.post('/visifi-sts', function (req, res) {
  let identity = req.body.identity;
  let tenant = (req.body.tenant) ? req.body.tenant : config.tenant;
  let clientId = config[tenant].clientId;
  let clientSecret = config[tenant].clientSecret;  
  let isAnonymous = req.body.isAnonymous || false;
  let aud = req.body.aud || "https://idproxy.kore.com/authorize";
  let options = {
    "iat": new Date().getTime()/1000,
    // "exp": new Date(new Date().getTime()/1000 + (24 * 60 * 60)).getTime(),
    "exp" : new Date(new Date().getTime()/1000 + (10)).getTime(),
    "aud": aud,
    "appId": clientId,
    "iss": clientId,
    "sub": identity,
    "isAnonymous": isAnonymous
  }
  console.log("called");
  let token = jwt.sign(options, clientSecret);
  console.log(token);
  res.status(200).send({"jwt":token});
});

app.get('/', (req, res) => {
  console.info(req.body);
  res.json({
    "message": "I am running"
  });
});


app.listen(port,() => {console.log(`Connected on ${port}`)});
