const express=require('express');

const {addDoctor, getDoctors, getDoctor, updateDoctor, deleteDoctor}=require('../controllers/DoctorController');
const {authenticate}=require('../middleware/authMiddleware');
const router=express.Router();

router.post('/doctors',authenticate, addDoctor);
router.get('/doctors',authenticate, getDoctors);
router.get('/doctors/:id', authenticate, getDoctor);
router.put('/doctors/:id', authenticate, updateDoctor);
router.delete('/doctors/:id', authenticate, deleteDoctor);

module.exports=router;