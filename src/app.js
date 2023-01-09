import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;

const users = [];
const tweets = [];

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body;

    if (!username || !avatar) {
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }

    const usersList = users.find((user) => user.username === username);

    if (usersList) {
        res.status(409).send("Usuário já existe!");
        return;
    }

    users.push({ username, avatar });

    res.status(201).send("OK!");
});

app.post("/tweets", (req, res) => {
    const newTweet = req.body;

    const userData = users.find(user => user.username === newTweet.username);

    if (!userData) {
        res.status(401).send(UNAUTHORIZED);
        return;
    }

    if (!newTweet.username || !newTweet.tweet) {
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }

    tweets.push(newTweet);

    res.status(201).send("OK!");
});

app.get("/tweets", (req, res) => {
    let lastTweets = []
    let userData

    tweets.map(tweet => {
        userData = users.find(user => user.username === tweet.username);

        lastTweets.push({
            username: tweet.username,
            avatar: userData.avatar,
            tweet: tweet.tweet
        })
    })

    let listSize = 0;

    if (lastTweets.length >= 10) listSize = tweets.length - 10;

    lastTweets = lastTweets.slice(listSize).reverse();

    res.status(200).send(lastTweets);
});

app.listen(PORT);