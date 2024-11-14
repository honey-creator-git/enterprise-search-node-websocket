const http = require("http");
const WebSocket = require("ws");
const express = require("express");

const app = express();
const port = process.env.PORT || 8080; // Use Render's provided port

// Create an HTTP server
const server = http.createServer(app);

// Attach the WebSocket server to the HTTP server
const wss = new WebSocket.Server({ server });

// WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  ws.on("message", (message) => {
    console.log("Received message:", message);
    // Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
