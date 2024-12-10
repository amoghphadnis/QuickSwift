import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Update with your server URL

const ChatBox = ({ room, sender }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.emit("joinRoom", room);

        socket.on("receiveMessage", (data) => {
            console.log('data..!!',data)
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [room]);

    const handleSendMessage = () => {
        if (message.trim()) {
            const messageData = { room, message, sender };
            console.log('messageData...!!',messageData)
            socket.emit("sendMessage", messageData);
            setMessage("");
        }
    };

    return (
        <Box sx={{ border: "1px solid #ccc", borderRadius: "8px", p: 2, maxWidth: 400 }}>
            <Typography variant="h6" gutterBottom>Chat with Driver</Typography>
            <Box sx={{ height: 200, overflowY: "auto", mb: 2, border: "1px solid #ddd", borderRadius: "4px", padding: "8px" }}>
                {messages.map((msg, index) => (
                    <Typography
                        key={index}
                        sx={{ textAlign: msg.sender === sender ? "right" : "left", mb: 1 }}
                    >
                        <strong>{msg.sender}:</strong> {msg.message}
                    </Typography>
                ))}
            </Box>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleSendMessage} fullWidth>Send</Button>
        </Box>
    );
};

export default ChatBox;
