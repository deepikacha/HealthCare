const express=require('express');

const {assignDoctorToPatient, getAllMappings, getAllDoctors, deleteMapping}=require('../controllers/mappingController');
const {authenticate}=require('../middleware/authMiddleware');
const router=express.Router();

router.post('/mappings',authenticate, assignDoctorToPatient);
router.get('/mappings',authenticate, getAllMappings);
router.get('/mappings/:patient_id',authenticate, getAllDoctors);
router.delete('/mappings/:id',authenticate, deleteMapping);


module.exports=router;