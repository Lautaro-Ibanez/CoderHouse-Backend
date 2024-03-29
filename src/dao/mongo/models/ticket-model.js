import mongoose from "mongoose";

const collection = "tickets";

const schema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  amount: Number,
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  purchaser: String,
});

const ticketModel = mongoose.model(collection, schema);

export default ticketModel;
