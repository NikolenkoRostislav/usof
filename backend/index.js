require("dotenv").config();
const http = require("http");
const express = require("express");
const { sessionMiddleware, errorHandlingMiddleware } = require("./src/api/middleware");
const route = require("./src/api/router");
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.use(sessionMiddleware);

route(app);

app.use(errorHandlingMiddleware);

server.listen(port, () => {
    console.log(`Server running on http://${host}:${port}`);
});