const express = require("express");
const app = express();
const port = 3000;
const { MongoClient } = require("mongodb");

const url =
	"mongodb+srv://admin:hisyCn%24AhkX5Ggz@lab-cluster-1.ihxrn.mongodb.net/test?authSource=admin&replicaSet=atlas-nmhvza-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
const client = new MongoClient(url);
const dbName = "shopping-app";

app.use(express.json());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,POST,HEAD,OPTIONS,PUT,PATCH");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin,X-Requested-With,Content-Type,Accept,token",
	);
	next();
});

var heroes = [
	{ id: 11, name: "Dr Nice", rating: 5 },
	{ id: 12, name: "Narco", rating: 4 },
	{ id: 13, name: "Bombasto", rating: 4.4 },
	{ id: 14, name: "Celeritas", rating: 4.1 },
	{ id: 15, name: "Magneta", rating: 5 },
	{ id: 16, name: "RubberMan", rating: 2.5 },
	{ id: 17, name: "Dynama", rating: 4 },
	{ id: 18, name: "Dr IQ", rating: 4.2 },
	{ id: 19, name: "Magma", rating: 3.5 },
	{ id: 20, name: "Tornado", rating: 5 },
];
app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.post("/api/user/exists", async (req, res) => {
	await client.connect();
	if (req.body.email.length <= 0) {
		return;
	}
	const db = client.db(dbName);
	db.collection("users")
		.find({
			email: req.body.email,
		})
		.toArray()
		.then((docs) => {
			if (docs.length > 0) {
				res.send(true);
			} else {
				res.send(false);
			}
		});
});

app.post("/api/user/signup", async (req, res) => {
	//TODO connect to mongoclient and send
	await client.connect();
	const userDoc = {
		email: req.body.email,
		password: req.body.password,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		mobileNo: req.body.mobileNo,
		_id: req.body.email,
	};

	console.log("Connected successfully to server");
	const db = client.db(dbName);
	db.collection("users")
		.insertOne(userDoc)
		.then((response) => {
			response.acknowledged ? res.send(true) : res.send(false);
		})
		.catch((err) => {
			res.status(501).send({ msg: "server returned error", error: err });
		});
});

app.post("/api/user/login", async (req, res) => {
	//TODO connect to mongoclient and send
	await client.connect();
	console.log("Connected successfully to server");
	const db = client.db(dbName);
	db.collection("users")
		.findOne({
			email: req.body.email,
			password: req.body.password,
		})
		.then((result) => {
			if (result) {
				console.log(result);
				return res.send({ result: true, token: "7y73hf78383n383xn" });
			} else {
				return res.send({ result: false, message: "invalid credentials" });
			}
		})
		.catch((err) => {
			console.log(err);
		});
});

app.get("/api/heroes/all", (req, res) => {
	setTimeout(() => {
		res.send(heroes);
	}, 3000);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
