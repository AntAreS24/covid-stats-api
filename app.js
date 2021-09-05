var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// In case you're behind a corporate firewall with self-signed certificates
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var indexRouter = require("./routes/covid")(logger);

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use("/covid/", indexRouter);

module.exports = app;
