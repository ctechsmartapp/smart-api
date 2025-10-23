import express from "express";
const app = express();
import morgan from "morgan";
import bodyParser from "body-parser";
import authRoutes from "./api/routes/auth.js";
import userRoutes from "./api/routes/users.js";
import submissionRoutes from "./api/routes/submission.js";
import consultantRoutes from "./api/routes/consultant.js";

/* This is file is used like Middleware */

app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,PATCH,DELETE");
    return res.status(200).json({});
  }
  next();
});
// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/consultants", consultantRoutes);
app.use("/submissions", submissionRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
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

export default app;
