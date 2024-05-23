import mongoose from "mongoose";

const RegisterSchema = new mongoose.Schema({

    username: {
        type: String
    },

    email: {
        type: String
    },

    password: {
        type: String
    },

    num: {
        type: Number
    },


})

const Register =  mongoose.model('RegisterModel', RegisterSchema);

export default Register;