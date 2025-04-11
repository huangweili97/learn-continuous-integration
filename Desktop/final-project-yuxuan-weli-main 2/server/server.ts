import cors from "cors";
import mongoose from "mongoose";
import express, { type Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import yaml from "yaml";
import fs from "fs";
import { middleware } from "express-openapi-validator";
import path from "path";
import https from "https";
import { Server } from "https";

import tagController from "./controllers/tagController";
import questionController from "./controllers/questionController";
import answerController from "./controllers/answerController";
import userController from "./controllers/userController";
import { auth } from "./middleware/auth";
import { upvoteQuestion, downvoteQuestion } from "./controllers/questionController";
import { upvoteAnswer, downvoteAnswer } from "./controllers/answerController";


const MONGO_URL: string = "mongodb://127.0.0.1:27017/fake_so";
//const CLIENT_URL: string = "http://localhost:3000";
const CLIENT_URLS = ["http://localhost:3000", "http://localhost:3001", "https://localhost:3000", "https://localhost:3001"];
const port: number = 8000;

// Function to check if SSL certificates exist
const checkCertificates = () => {
  const certPath = path.join(__dirname, 'certificates');
  const keyPath = path.join(certPath, 'private.key');
  const certFilePath = path.join(certPath, 'certificate.crt');

  if (!fs.existsSync(certPath)) {
    console.error('Certificates directory not found. Please run "npm run generate-certs" first.');
    return false;
  }

  if (!fs.existsSync(keyPath) || !fs.existsSync(certFilePath)) {
    console.error('SSL certificates not found. Please run "npm run generate-certs" first.');
    return false;
  }

  return { keyPath, certFilePath };
};

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log(" Successfully connected to MongoDB!");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const app: Express = express();

// The middleware function to allow cross-origin requests from the client URL.
// app.use(
//   cors({
//     credentials: true,
//     origin: [CLIENT_URL],
//   })
// );
app.use(
  cors({
    credentials: true,
    origin: CLIENT_URLS,
  })
);

// The middleware function to parse the request body.
app.use(express.json());

// 注册 API 路由
app.use("/tag", tagController);
app.use("/question", questionController);
app.use("/answer", answerController);
app.use("/users", userController);

// 注册投票相关的路由
app.post("/question/:qid/upvote", auth, upvoteQuestion);
app.post("/question/:qid/downvote", auth, downvoteQuestion);
app.post("/answer/:aid/upvote", auth, upvoteAnswer);
app.post("/answer/:aid/downvote", auth, downvoteAnswer);

// Defining the path to the Open API specification file and parsing it.
const openApiPath = path.join(__dirname, "openapi.yaml");
const openApiDocument = yaml.parse(fs.readFileSync(openApiPath, "utf8"));

// Defining the Swagger UI options. Swagger UI renders the Open API specification file.
const swaggerOptions = {
  customSiteTitle: "Fake Stack Overflow API Documentation",
  customCss:
    ".swagger-ui .topbar { display: none } .swagger-ui .info { margin: 20px 0 } .swagger-ui .scheme-container { display: none }",
  swaggerOptions: {
    displayRequestDuration: true,
    docExpansion: "none",
    showCommonExtensions: true,
  },
};

// The middleware function to serve the Swagger UI with the Open API specification file.
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, swaggerOptions)
);

// The middleware function to validate the request and response against the Open API specification.
app.use(
  middleware({
    apiSpec: openApiPath,
    validateRequests: true,
    validateResponses: true,
    formats: {
      "mongodb-id": /^[0-9a-fA-F]{24}$/,
    },
  })
);

// Start HTTPS server
let server: Server;
try {
  const certificates = checkCertificates();
  if (!certificates) {
    process.exit(1);
  }

  const httpsOptions = {
    key: fs.readFileSync(certificates.keyPath),
    cert: fs.readFileSync(certificates.certFilePath)
  };

  server = https.createServer(httpsOptions, app);

  server.listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
});

  // Graceful shutdown
  process.on("SIGINT", () => {
    server.close(() => {
      console.log("Server closed.");
      mongoose
        .disconnect()
        .then(() => {
          console.log("Database instance disconnected.");
          process.exit(0);
        })
        .catch((err) => {
          console.error("Error during disconnection:", err);
          process.exit(1);
        });
    });
});

} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}

export default server;

// The middleware function to handle errors.
app.use(
  (
    err: {
      status: number;
      message: string;
      errors: Array<Record<string, string>>;
    },
    req: Request,
    res: Response
  ) => {
    if (err.status && err.errors) {
      res.status(err.status).json({
        message: err.message,
        errors: err.errors,
      });
    } else {
      res.status(500).json({
        message: err.message || "Internal Server Error",
      });
    }
  }
);

