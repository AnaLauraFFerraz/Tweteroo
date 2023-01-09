import express from "express";
import cors from "cors";

const app = express(); 
app.use(express.json());
app.use(cors());

const PORT = 5000;

const users = [];

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body;
  
    if (!username || !avatar) {
      res.status(400).send("All fields are required!");
    }
    users.push({ username, avatar });
    console.log(users);
    res.sendStatus(201);
  });

app.listen(PORT);