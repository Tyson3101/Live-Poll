require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");

const time = require("./time");
const Keyv = require("@keyv/mongo");
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public/views"));
app.use(express.static(path.join(__dirname, "public")));
app.enable("trust proxy");

const keyv = new Keyv(process.env.DB);
keyv.on("error", (err) => console.log("Connection Error", err));

app.get("/", allPostsFil, (req, res) => {
  res.render("index", {
    allPost: req.posts,
    number: 0,
    time: time,
    link: req.protocol + "://" + req.get("host"),
  });
});

app.get("/poll/", allPosts, (req, res) => {
  res.render("polls", {
    allPost: req.posts,
    number: 0,
    time: time,
    link: req.protocol + "://" + req.get("host"),
  });
});

app.get("/poll/create", (req, res) => {
  res.render("create", {
    number: 2,
  });
});

app.get("/poll/:pollID", async (req, res) => {
  const pollID = parseInt(req.params["pollID"]);
  const Data = await keyv.get("poll");
  let poll = Data.find((pol) => pol.pollID === pollID);
  if (!poll) {
    return res.render("notFound");
  }
  res.render("poll", {
    poll,
    time,
    number: 0,
    link: req.protocol + "://" + req.get("host") + req.originalUrl,
  });
});

app.post("/poll/create", async (req, res) => {
  const Data = await keyv.get("poll");
  const { title, option1, option2, option3, option4, option5, Public, type } =
    req.body;
  if (type === "inforequest") {
    res.json({
      info: Data[0],
    });
  } else {
    let newPoll = {
      type: type,
      pollCount: (Data[0]["pollCount"] += 1),
      pollID: (Data[0]["currentPollID"] += 1),
      Public: Public,
      pollName: title,
      createdAt: Date.now(),
      totalVotes: 0,
      Options: [
        {
          optionName: option1,
          votes: 0,
        },
        {
          optionName: option2,
          votes: 0,
        },
      ],
    };
    if (option3) {
      newPoll.Options.push({ optionName: option3, votes: 0 });
    }
    if (option4) {
      newPoll.Options.push({ optionName: option4, votes: 0 });
    }
    if (option5) {
      newPoll.Options.push({ optionName: option5, votes: 0 });
    }
    Data.push(newPoll);
    keyv.set("poll", Data);
    res.json({
      pollID: newPoll["pollID"],
    });
    console.log(req.body);
  }
});

app.post("/vote/:pollID/:Option", async (req, res) => {
  const Data = await keyv.get("poll");
  console.log(req.body);
  console.log("reqparams", req.params);
  let poll = Data.find((exe) => exe.pollID === parseInt(req.params.pollID));
  console.log(poll);
  poll.Options.find(
    (x) => x.optionName.toLowerCase() === req.params.Option.toLowerCase()
  ).votes += 1;
  poll.totalVotes += 1;
  keyv.set("poll", Data);
  res.sendStatus(200);
});

async function allPostsFil(req, res, next) {
  const Data = await keyv.get("poll");
  console.log(Data);
  let func = (x) => x.Public;
  let cal = [
    Data.filter(func)[Math.floor(Math.random() * Data.filter(func).length)],
  ];
  let nextfunc = (x) =>
    x.Public && cal[0] && cal[0].pollID && cal[0].pollID !== x.pollID;
  cal.push(
    Data.filter(
      (x) => x.Public && cal[0] && cal[0].pollID && cal[0].pollID !== x.pollID
    )[Math.floor(Math.random() * Data.filter(nextfunc).length)]
  );
  console.log(cal);
  req.posts = cal;
  console.log("req.post:", JSON.stringify(req.posts));
  next();
}

async function allPosts(req, res, next) {
  const Data = await keyv.get("poll");
  let func = (x) => x.Public;
  let cal = Data.filter(func).sort((a, b) => b.createdAt - a.createdAt);
  console.log(cal);
  req.posts = cal;
  console.log("req.post:", JSON.stringify(req.posts));
  next();
}

app.listen(process.env.PORT, () => console.log("PORT: " + process.env.PORT));
