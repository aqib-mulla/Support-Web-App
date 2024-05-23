import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import multer from 'multer';
import  helmet from 'helmet'
import morgan from 'morgan';
import path from "path";
import { fileURLToPath } from 'url';
import { Login } from './controllers/login.js';
import { AdminLogin, createAccount, getTickets, getAllTickets, updateStatus, createAgent , getAgents} from './controllers/Register.js';
import { createTicket } from './controllers/Register.js';
import { updateAgent, AgentLogin, getAgentTickets, sendFile } from './controllers/Register.js';

// CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
// Allow requests from the frontend origin (http://localhost:3000)
app.use(cors({ origin: 'http://localhost:3000' }));
// app.use("/assets", express.static(path.join(__dirname, 'public/assets')));
app.use(express.static(path.join(__dirname, './build')));



//FILE  STORAGE CONFIG
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

const upload = multer({storage});


//User Login 
app.post("/auth/login", Login);





//Register
app.post("/auth/ticket-register", createAccount);
app.post("/auth/create-ticket", upload.single('attachment'), createTicket);
app.get("/auth/tickets/:user", getTickets);

//admin all tickets
app.get("/auth/admin-tickets", getAllTickets);
//admin update status
app.put("/auth/update-ticket-status/:id", updateStatus);
//Update the agent
app.put("/auth/update-ticket-agent/:ticketId", updateAgent);

//create-agents
app.post("/auth/create-agent", createAgent);
//get-agents
app.get("/auth/tech-support-agents", getAgents);
//get agent particular tickets
app.get("/auth/agent-tickets/:user", getAgentTickets);

app.post("/auth/upload-file/:ticketId", upload.single('file'), sendFile);



//Admin Login
app.post("/auth/admin-login", AdminLogin);

//Agent Login
app.post("/auth/agent-login", AgentLogin);


app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname,'./build/index.html'))
})


// MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL,{
useNewUrlParser: true,
useUnifiedTopology: true,
})
.then(()=>{
app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
})
.catch((error)=> console.log(`${error} did not connect`))




