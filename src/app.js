import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;

const users = [];
const tweets = [];

const ERR_MISSING_FIELDS = "Todos os campos são obrigatórios!";
const ERR_USER_EXISTS = "Usuário já existe!";

const isString = (value) => typeof value === 'string';

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body;

    if (!username || !avatar || !isString(username) || !isString(avatar)) {
        return res.status(400).send(ERR_MISSING_FIELDS);
    }

    const userExists = users.some((user) => user.username === username);

    if (userExists) {
        return res.status(409).send(ERR_USER_EXISTS);
    }

    users.push({ username, avatar });

    res.status(201).send("OK!");
});

app.post("/tweets", (req, res) => {
    const { username, tweet } = req.body;

    if (!username || !tweet || !isString(username) || !isString(tweet)) {
        return res.status(400).send(ERR_MISSING_FIELDS);
    }

    const user = users.find((user) => user.username === username);

    if (!user) {
        return res.status(401).send(UNAUTHORIZED);
    }

    tweets.push({ username, tweet });

    res.status(201).send("OK!");
});

app.get("/tweets", (req, res) => {
    const lastTweets = tweets
        .slice(-10)
        .reverse()
        .map((tweet) => {
            const user = users.find((user) => user.username === tweet.username);
            return {
                username: tweet.username,
                avatar: user.avatar,
                tweet: tweet.tweet,
            };
        });

    res.status(200).send(lastTweets);
});

app.get("/tweets/:username", (req, res) => {
    const { username } = req.params;
    const userTweets = tweets
        .filter((tweet) => tweet.username === username)
        .map((tweet) => {
            const user = users.find((user) => user.username === tweet.username);
            return {
                username: tweet.username,
                avatar: user.avatar,
                tweet: tweet.tweet,
            };
        });

    res.status(200).send(userTweets);
});


app.listen(PORT);