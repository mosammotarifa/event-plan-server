const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
    const faqCollection = db.collection("FAQ");
    const eventRequestsCollection = db.collection("eventRequests");
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
    app.get("/services/:serviceId", async (req, res) => {
      try {
        const { serviceId } = req.params;

        const query = { _id: new ObjectId(serviceId) };

        const result = await servicesCollection.findOne(query);

        if (!result) {
          return res.status(404).send({
            message: "Service not found",
          });
        }

        res.send(result);
      } catch (error) {
        res.status(500).send({
          message: "Failed to fetch service details",
        });
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
    app.post("/testimonials", async (req, res) => {
      try {
        const {
          clientName,
          eventType,
          rating,
          review,
          clientImage,
          eventDate,
        } = req.body;

        if (!clientName || !eventType || !rating || !review) {
          return res.status(400).send({
            message: "Please provide all required fields",
          });
        }

        const newTestimonial = {
          clientName,
          eventType,
          rating: Number(rating),
          review,
          clientImage: clientImage || "",
          eventDate: eventDate || "",
          isApproved: true,
          createdAt: new Date().toISOString(),
        };

        const result = await testimonialsCollection.insertOne(newTestimonial);

        res.status(201).send({
          success: true,
          message: "Feedback submitted successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error(error);

        res.status(500).send({
          message: "Failed to submit feedback",
        });
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
    app.get("/faq", async (req, res) => {
      try {
        const cursor = faqCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res
          .status(200)
          .send({ message: "failed to fetched the services data" });
      }
    });
    app.get("/event-requests", async (req, res) => {
      try {
        const cursor = eventRequestsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res
          .status(500)
          .send({ message: "failed to fetched the services data" });
      }
    });

    app.post("/event-requests", async (req, res) => {
      try {
        const {
          fullName,
          email,
          phone,
          eventType,
          services,
          eventDate,
          guestCount,
          budget,
          location,
          message,
        } = req.body;

        // Validate required fields
        if (
          !fullName ||
          !email ||
          !phone ||
          !eventType ||
          !message ||
          !Array.isArray(services) ||
          services.length === 0
        ) {
          return res.status(400).send({
            success: false,
            message: "Please provide all required information.",
          });
        }

        // Prepare event request
        const newEventRequest = {
          fullName,
          email,
          phone,
          eventType,
          services,
          eventDate: eventDate || null,
          guestCount: guestCount ? Number(guestCount) : null,
          budget: budget || "Not Decided Yet",
          location: location || "",
          message,

          status: "pending",
          createdAt: new Date(),
        };

        // Save to MongoDB
        const result = await eventRequestsCollection.insertOne(newEventRequest);

        res.status(201).send({
          success: true,
          message: "Your event request has been submitted successfully!",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error("Event request error:", error);

        res.status(500).send({
          success: false,
          message: "Failed to submit your event request.",
        });
      }
    });
    app.patch("/event-requests/:id", async (req, res) => {
      try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({
            success: false,
            message: "Invalid request ID",
          });
        }

        const {
          fullName,
          email,
          phone,
          eventType,
          services,
          eventDate,
          guestCount,
          budget,
          location,
          message,
        } = req.body;

        if (
          !fullName ||
          !email ||
          !phone ||
          !eventType ||
          !message ||
          !Array.isArray(services) ||
          services.length === 0
        ) {
          return res.status(400).send({
            success: false,
            message: "Please provide all required information.",
          });
        }

        const updatedData = {
          fullName,
          email,
          phone,
          eventType,
          services,
          eventDate: eventDate || null,
          guestCount: guestCount ? Number(guestCount) : null,
          budget: budget || "Not Decided Yet",
          location: location || "",
          message,
          updatedAt: new Date(),
        };

        const result = await eventRequestsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData },
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({
            success: false,
            message: "Event request not found",
          });
        }

        res.send({
          success: true,
          message: "Event request updated successfully!",
        });
      } catch (error) {
        console.error(error);

        res.status(500).send({
          success: false,
          message: "Failed to update event request",
        });
      }
    });
    app.delete("/event-requests/:id", async (req, res) => {
      try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({
            success: false,
            message: "Invalid request ID",
          });
        }

        const result = await eventRequestsCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return res.status(404).send({
            success: false,
            message: "Event request not found",
          });
        }

        res.send({
          success: true,
          message: "Event request deleted successfully!",
        });
      } catch (error) {
        console.error(error);

        res.status(500).send({
          success: false,
          message: "Failed to delete event request",
        });
      }
    });
    app.post("/meetings", async (req, res) => {
      try {
        const bookingData = req.body;

        const newMeeting = {
          ...bookingData,
          status: "pending",
          createdAt: new Date(),
        };

        const result = await db.collection("meetings").insertOne(newMeeting);

        res.status(201).send({
          success: true,
          message: "Consultation booked successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: "Failed to book consultation",
        });
      }
    });
    app.get("/meetings", async (req, res) => {
      try {
        const meetings = await db
          .collection("meetings")
          .find()
          .sort({ createdAt: -1 })
          .toArray();

        res.status(200).send(meetings);
      } catch (error) {
        res.status(500).send({
          message: "Failed to fetch consultation requests",
        });
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
app.delete("/meetings/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid meeting ID",
      });
    }

    const result = await db.collection("meetings").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Consultation booking not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Consultation booking deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to delete consultation booking",
    });
  }
});
