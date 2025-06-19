const express=require('express');

const {addPatient, getPatients, getPatient, updatePatient, deletePatient}=require('../controllers/patientController');
const {authenticate}=require('../middleware/authMiddleware');
const router=express.Router();

router.post('/patients',authenticate, addPatient);
router.get('/patients', authenticate, getPatients);
router.get('/patients/:id', authenticate, getPatient);
router.put('/patients/:id',authenticate, updatePatient);
router.delete('/patients/:id',authenticate, deletePatient);

module.exports=router;