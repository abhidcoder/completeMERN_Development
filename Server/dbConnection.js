const mongoose = require("mongoose");

const DB = "mongodb+srv://abhidcoder:abhidcoder@cluster0.k71bdok.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });


const ItemSchema = new mongoose.Schema({
  Contact: {
    type: String,
  },
  CTA: {
    type: String,
  },
  SPOC: {
    type: String,
  },
  Mobile: {
    type: Number,
  },
  Email: {
    type: String,
  },
  CreatedDate:{
    type: String,
  },
//CreatedDate:{ type: Date, default: Date.now },
});




const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;
