const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(cors());
app.use(express.json());
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const run = async () => {
  try {
    await client.connect();
    const db = client.db("event-plan");
    const achievementsCollection = db.collection("achievements");
    const eventsCollection = db.collection("events");
    const servicesCollection = db.collection("services");
    const WhyChooseUsCollection = db.collection("reasons");
    const testimonialsCollection = db.collection("testimonials");
    const howweworkCollection = db.collection("howwework");
    app.get("/achievements", async (req, res) => {
      try {
        const cursor = achievementsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "faild to fetcd achievements" });
      }
    });
    app.get("/events", async (req, res) => {
      try {
        const cursor = eventsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res.status(200).send({ message: "faied to fetched the events data" });
      }
    });
    app.get("/services", async (req, res) => {
      try {
        const cursor = servicesCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res
          .status(200)
          .send({ message: "failed to fetched the services data" });
      }
    });
    app.get("/reasons", async (req, res) => {
      try {
        const cursor = WhyChooseUsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res
          .status(200)
          .send({ message: "failed to fetched the services data" });
      }
    });
    app.get("/testimonials", async (req, res) => {
      try {
        const cursor = testimonialsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res
          .status(200)
          .send({ message: "failed to fetched the services data" });
      }
    });
    app.get("/howwework", async (req, res) => {
      try {
        const cursor = howweworkCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res
          .status(200)
          .send({ message: "failed to fetched the services data" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment");
    app.listen(port, () => {
      console.log(`the${port}port of server in serving.`);
    });
  } finally {
    // await client.close()
  }
};
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("the server home");
});
