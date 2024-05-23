import mongoose from "mongoose";

const agentSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: true,
  },
  password: {
    type: String,
    // required: true,
  },
});

const Agent = mongoose.model('Agent', agentSchema);

export default Agent
