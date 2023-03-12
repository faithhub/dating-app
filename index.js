const express = require("express");
var log4js = require("log4js");
const morgan = require("morgan");
// const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
const expressSession = require("express-session");
const dotenv = require("dotenv");
const flash = require("express-flash");
const routes = require("./src/routes");

dotenv.config();
const app = express();
const port = process.env.PORT;
//request handling
app.use(flash());

// var sessionFlash = function (req, res, next) {
//   // res.locals.currentUser = req.user;
//   res.locals.error = req.flash("error");
//   res.locals.success = req.flash("success");
//   next();
// };
// app.use(sessionFlash);
// app.use(
//   fileUpload({
//     limits: { fileSize: 500 * 1024 * 1024 },
//     createParentPath: true,
//   })
// );

app.use(morgan("dev"));
app.use(cors());
// app.use(express.limit(50000000));
app.use(express.json({ limit: 50000000 }));
app.use(express.urlencoded({ limit: 50000000, extended: true }));

//Auth
const session = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false,
};

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
if (app.get("env") === "production") {
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}

// logger.error("log message");
// app.use(log4js.connectLogger(log4js.getLogger("http"), { level: "auto" }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views/"));
app.use(express.static(path.join(__dirname, "src/public")));

app.use("/", routes);

// app.use((req, res, next) => {
//   const error = new Error("Page not found");
//   res.status(error.status || 500);
//   res.json({
//     error: {
//       message: error.message,
//     },
//   });
// });

app.use((req, res, next) => {
  const error = new Error("Page not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(port, () => {
  console.log(`Listening on port:: http://localhost:${port}/`);
});
