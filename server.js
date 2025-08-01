import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import session from "express-session";
import cookieParser from "cookie-parser";
import expressEjsLayouts from "express-ejs-layouts";
import { fileURLToPath } from "url";
import cors from "cors";
import { getConnection } from "./src/database/databaseQuery.js";
import "dotenv/config";
import http from "http";
import { Server as socketIO } from "socket.io";

const app = express();
const httpServer = http.createServer(app);
const io = new socketIO(httpServer);

const students = {};
const admins = {};
io.on("connection", (socket) => {
  // console.log("User connected: " + socket.id);

  socket.on("admin-join", ({ adminId, examId }) => {
    admins[socket.id] = { adminId, examId };
  });

  socket.on("student-join", ({ studentId, examId }) => {
    students[socket.id] = { studentId, examId };
  });

  // socket.on("screen-data", ({ studentId, examId, imageData }) => {
  //   io.emit("admin-screen-data", {
  //     studentId,
  //     examId,
  //     imageData
  //   });
  // });

  socket.on("screen-data", ({ studentId, examId, imageData }) => {
    console.log("admins: ", Object.entries(admins));
    Object.entries(admins).forEach(([adminSocketId, adminInfo]) => {
      
      // if (JSON.parse(adminInfo.examIds).includes(examId)) {
      //   // console.log("admin screen data emit: ", examId);
      //   io.to(adminSocketId).emit("admin-screen-data", {
      //     studentId,
      //     examId,
      //     imageData,
      //   });
      // }

      if(adminInfo.examId == examId) {
        io.to(adminSocketId).emit("admin-screen-data", {
          studentId,
          examId,
          imageData
        })
      }
    });
  });

  socket.on("disconnect", () => {
    // console.log("User disconnected: " + socket.id);
    delete students[socket.id];
    delete admins[socket.id];
  });
});

app.use(cookieParser());
const PORT = process.env.SERVER_PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "./src/views"));
app.set("views", path.resolve("./src/views"));
app.use(expressEjsLayouts);
app.set("layout", "./layouts");
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Log the Incomming Request with Ip Address and Other Details
app.use((req, res, next) => {
  const ip = req.ip; // Get the correct IP address
  const logDetails = {
    ip: ip,
    method: req.method,
    url: req.url,
  };

  console.log(
    `Incoming Request: ${JSON.stringify(
      logDetails
    )} at ${new Date().toISOString()}`
  );
  next();
});

// Getting the Connection For Database
(async () => {
  try {
    const connection = await getConnection();
    if (connection) {
      console.log("Database Connected Successfully!");
    }
  } catch (error) {
    throw new Error(error);
  }
})();

// Using Session Management For Super-Admin
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      name: process.env.SESSION_COOKIE_NAME,
      maxAge: 1000 * 60 * 60 * 1,
      httpOnly: true,
      secure: false,
    },
  })
);

// Use of Cors
app.use(cors());
app.options("*", cors());
var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};
app.use(allowCrossDomain);
cors({
  origin: "*",
});

//  ------------Import Authentication Files------------
import loginRoute from "./src/routes/auth/login.js";
import signupRoute from "./src/routes/auth/signup.js";
import forgotPassRoute from "./src/routes/auth/forgotPassRoute.js";
import checkauthRoute from "./src/routes/auth/checkAuth.js";
app.use("/admin", checkauthRoute);
app.use("/", loginRoute);
app.use("/", signupRoute);
app.use("/", forgotPassRoute);

//  ------------Import Super-Admin Routes Files------------
import SuperAdmin_Route from "./src/routes/SuperAdmin/superadmin.routes.js";
app.use("/super-admin", SuperAdmin_Route);

//  ------------Import All Admin Routes Files------------
import adminRoutes from "./src/routes/Admin_Routes/index.js";
app.use("/", adminRoutes);

//  ------------Import Profile page of admin and student Files------------
import profileRoute from "./src/routes/profile.route.js";
import adminPagesRoute from "./src/routes/profilePage.route.js";
app.use("/", adminPagesRoute);
app.use("/", profileRoute);

//  ------------Import All student Routes Files------------
import studentRoutes from "./src/routes/Student_Routes/index.js";
app.use("/", studentRoutes);

// -------------Landing Page --------------
app.get("/", (req, res) => {
  // console.log("ip address: ", req.socket.remoteAddress);
  res.render("landingPage.ejs", { layout: false });
});

// --------------logout for route for admin and student-----------
import logout from "./src/routes/logout.route.js";
app.use("/", logout);

// Listening To SERVER
httpServer.listen(PORT, () => {
  console.log(`Server Started on: http://localhost:${PORT}`);
});