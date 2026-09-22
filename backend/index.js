require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors")
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./src/api/swagger");
const { sessionMiddleware, errorHandlingMiddleware } = require("./src/api/middleware");
const route = require("./src/api/router");
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;
const origin = process.env.ORIGIN || "http://localhost:5173";

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.use(cors({ origin, credentials: true }));

app.use(sessionMiddleware);

app.use(express.static("../admin_panel"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    swaggerOptions: { persistAuthorization: true },
}));

route(app);

app.use(errorHandlingMiddleware);

server.listen(port, () => {
    console.log(`Server running on http://${host}:${port}`);
    console.log(`API Documentation available at http://${host}:${port}/api-docs`);
});