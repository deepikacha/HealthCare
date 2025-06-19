require('dotenv').config();
const express=require('express');
const path=require('path');
const cors=require('cors');
const dbConnect=require('./config/db');
const authRoutes=require('./routes/authRoutes');
const patientRoutes= require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const mappingRoutes = require('./routes/mappingRoutes');
const app=express();
app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api",patientRoutes);
app.use("/api",doctorRoutes);
app.use("/api",mappingRoutes);

dbConnect();
const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})