import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import morgan from "morgan";
import { initSupabase } from "./supabaseClient.js";

// configuration
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// view engine
app.set("view engine", "ejs");

// connecting to supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
initSupabase(supabaseUrl, supabaseKey);

// setting routes
app.get("/", (_req, res) => {
  res.render("home");
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send("Unexpected error!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
