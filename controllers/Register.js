import Register from "../models/RegisterModel.js";
import Ticket from "../models/Ticket.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from "../models/userLogin.js";
import Agent from "../models/Agent.js";
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

export const createAccount = async (req, res) => {

  try {
    const { doctorDetails } = req.body;
    const { username, email, password, num } = doctorDetails;
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const reg = new Register({ username, email, password: hashedPassword, num });
    const regSaved = await reg.save();
    res.status(201).json(regSaved);
  } catch (err) {
    res.status(500).json("error :", err);
  }
}


// export const createTicket = async (req, res) => {

//     try {
//         const { subject, description, attachment, creator } = req.body;
//         console.log(creator);

//         const ticket = new Ticket({
//             subject,
//             description,
//             attachment,
//             creator,
//         });

//         await ticket.save();

//         res.status(201).json({ message: 'Ticket created successfully', ticket });
//     } catch (error) {
//         console.error('Error creating ticket:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }

export const createTicket = async (req, res) => {

  try {
    const { subject, description, creator } = req.body;
    const attachment = req.file ? req.file.path : null;

    const ticket = new Ticket({
      subject,
      description,
      attachment,
      creator,
    });

    await ticket.save();

    res.status(201).json({ message: 'Ticket created successfully', ticket });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const getTickets = async (req, res) => {

  const userId = req.params.user;
  console.log(userId)
  try {
    const tickets = await Ticket.find({ creator: userId }).sort({ createdAt: -1 });
    res.status(200).json({ tickets });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
}

export const AdminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Search for a user with the provided username in the User model
    const user = await User.findOne({ username });
    // console.log(user)

    if (!user) {
      return res.status(401).json({ authenticated: false, message: 'Invalid credentials' });
    }

    // Compare the provided plaintext password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET, // Use an environment variable for your secret key
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        authenticated: true,
        message: 'Login successful',
        user: user.username,
        userId: user._id,
        token,
      });
    } else {
      return res.status(401).json({ authenticated: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ authenticated: false, error: 'An error occurred during login' });
  }
};


export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.status(200).json({ tickets });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
}


export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {

    const updatedTicket = await Ticket.findByIdAndUpdate(id, { status }, { new: true });


    if (!updatedTicket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }


    res.status(200).json({ message: 'Ticket status updated successfully', ticket: updatedTicket });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
};

//   export const createAgent = async (req, res) => {

//     const { name, number } = req.body;

//     try {
//       const newAgent = new Agent({ name, number });
//       await newAgent.save();
//       res.status(201).json({ message: 'Agent created successfully', agent: newAgent });
//     } catch (error) {
//       console.error('Error creating agent:', error);
//       res.status(500).json({ error: 'Failed to create agent' });
//     }
// }

export const createAgent = async (req, res) => {

  try {
    const { username, password } = req.body;
    console.log(req.body);
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const reg = new Agent({ username, password: hashedPassword });
    // console.log('Doctor object:', doctor);
    const regSaved = await reg.save();
    res.status(201).json(regSaved);
  } catch (err) {
    res.status(500).json("error :", err);
  }
}


export const getAgents = async (req, res) => {

  try {
    const agents = await Agent.find();
    res.status(200).json({ agents });
  } catch (error) {
    console.error('Error fetching tech support agents:', error);
    res.status(500).json({ error: 'Failed to fetch tech support agents' });
  }
}


export const updateAgent = async (req, res) => {
  const { ticketId } = req.params;
  const { agentId } = req.body;
  console.log(agentId);
  try {
    const ticket = await Ticket.findByIdAndUpdate(ticketId, { assignedAgent: agentId }, { new: true });
    res.status(200).json({ message: 'Ticket assigned to agent successfully', ticket });
  } catch (error) {
    console.error('Error assigning ticket to agent:', error);
    res.status(500).json({ error: 'Failed to assign ticket to agent' });
  }
};


export const AgentLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Search for a user with the provided username in the User model
    const user = await Agent.findOne({ username });
    // console.log(user)

    if (!user) {
      return res.status(401).json({ authenticated: false, message: 'Invalid credentials' });
    }

    // Compare the provided plaintext password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET, // Use an environment variable for your secret key
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        authenticated: true,
        message: 'Login successful',
        user: user.username,
        userId: user._id,
        token,
      });
    } else {
      return res.status(401).json({ authenticated: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ authenticated: false, error: 'An error occurred during login' });
  }
};


export const getAgentTickets = async (req, res) => {

  const userId = req.params.user;
  console.log(userId)
  try {
    const tickets = await Ticket.find({ assignedAgent: userId }).sort({ createdAt: -1 });
    res.status(200).json({ tickets });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
}


export const sendFile = async (req, res) => {
  try {
    const {ticketId} = req.params;
    const filePath = req.file.path; // Get the file path
    console.log(ticketId);
    // Update the ticket with the file path
    await Ticket.findByIdAndUpdate(ticketId, { filePath: filePath });
    res.status(200).json({ message: 'File sent successfully' });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
}

export const downloadFile = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const filePath = ticket.filePath;
    console.log(filePath);

    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath, path.basename(filePath), (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ error: 'Failed to download file' });
      }
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
};


