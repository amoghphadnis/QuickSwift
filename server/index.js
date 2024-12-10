import express from "express";
import { ApolloServer } from "apollo-server-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import http from "http"; // Required for combining HTTP and WebSocket servers
import {} from "./model/database.js"; // Database connection (if required)

import { resolvers } from "./graphql/resolvers/resolver.js"; // Import GraphQL resolvers

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Load GraphQL Schema
const typeDefs = fs.readFileSync(
  path.join(__dirname, "graphql/schemas/schema.graphql"),
  "utf-8"
);

// Initialize ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Attach headers or authentication context
    return { headers: req.headers };
  },
});

// Create HTTP Server
const httpServer = http.createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Replace with your frontend URL in production
    methods: ["GET", "POST"],
  },
});

// WebSocket Handlers
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a room
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // Handle sending messages
  socket.on("sendMessage", (data) => {
    const { room, message, sender } = data;
    console.log(`Message from ${sender} in room ${room}: ${message}`);
    io.to(room).emit("receiveMessage", { sender, message });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start Apollo Server
server.start().then(() => {
  server.applyMiddleware({ app, path: "/graphql", cors: true });
});

// Define port
const port = process.env.PORT || 5000;

// Start the HTTP Server
httpServer.listen(port, () => {
  console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`);
  console.log(`WebSocket Server running at ws://localhost:${port}`);
});
