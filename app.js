const http = require("http");
const WebSocket = require("ws");
const express = require("express");

const app = express();
const port = process.env.PORT || 8080;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected admin clients
const adminClients = new Set();

wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  // Listen for messages from the client to set role
  ws.on("message", (message) => {
    const data = JSON.parse(message);
    // Mark this client as an admin
    adminClients.add(ws);
    // Broadcast to all connected admin clients if this is a normal message
    broadcastToAdmins(data);
  });

  ws.on("close", () => {
    // Remove from admin clients when disconnected
    adminClients.delete(ws);
    console.log("WebSocket connection closed");
  });
});

// Function to broadcast messages to all connected admin clients
const broadcastToAdmins = (data) => {
  const message = JSON.stringify(data);
  adminClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});
