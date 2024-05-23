import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  subject: { type: String},
  description: { type: String},
  attachment: String ,
  filePath: String ,
  creator: { type: mongoose.Schema.Types.ObjectId},
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    default: null,
  },
  status: { type: String, default: 'Open' }, // Status can be 'Open', 'In Progress', 'Resolved', etc.
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;

