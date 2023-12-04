// Importing packages
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const upload = require("express-fileupload");
const app = express();
var request = require("request");

// Ensble CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "POST, GET, OPTIONS, DELETE, PUT,PATCH"
  );
  next();
});
// Link body parser for url reading
app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: "10gb",
  })
);
// Use for expreess added today
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

////////////////////////////////
app.use(
  bodyParser.json({
    limit: "10gb",
  })
);

app.use(upload());

// Initialize passport for authenticated routes
app.use(passport.initialize());
require("./passport")(passport);

// Import routes
const {
  personnel,
  categories,
  products,
  videos,
  messages,
  employees,
  personnelType,
  uploads,
  flyers,
} = require("./routes");
const { login } = require("./controllers/PersonnelController");
const { response } = require("express");

// Initialize routes
app.use("/personnel-type", personnelType);
app.use("/personnel", personnel);
app.use("/employees", employees);
app.use("/messages", messages);
app.use("/videos", videos);
app.use("/products", products);
app.use("/categories", categories);
app.use("/upload", uploads);
app.use("/flyers", flyers);

app.post("/Login.php", function (req, res, next) {
  console.log(req.body.number.toString());
  var options = {
    uri: "http://172.17.0.4/Login.php",
    method: "POST",
    form: {
      number: req.body.number,
    },
    headers: { "content-type": "application/x-www-form-urlencoded" },
    json: true,
  };
  // console.log(req.body.number)
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body); // Print the shortened url.
    }
  }).pipe(res);
});

app.post("/Verify.php", function (req, res, next) {
  var options = {
    uri: "http://172.17.0.4/Verify.php",
    method: "POST",
    form: {
      number: req.body.number,
      phone: req.body.phone,
    },
    headers: { "content-type": "application/x-www-form-urlencoded" },
    json: true,
  };
  // console.log(req.body.number)
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body); // Print the shortened url.
    }
  }).pipe(res);
});
q 
module.exports = app;
