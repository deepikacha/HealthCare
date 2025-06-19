const mongoose = require('mongoose');
const User = require('../models/User');
const Mapping = require('../models/Mapping');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

const assignDoctorToPatient = async (req, res) => {
    const { doctorId, patientId } = req.body;
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "user not found" });
        }
        if (!mongoose.Types.ObjectId.isValid(doctorId) || !mongoose.Types.ObjectId.isValid(patientId)) {
            return res.status(400).json({ message: "Invalid doctorId or patientId" });
        }

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(400).json({ message: "patient not found" });
        }
        if (patient.createdBy.toString() !== req.user._id.toString()) {
            return res.status(400).json({ message: "you are not authorized to assign doctor to patients" });
        }
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(400).json({ message: "doctor not found" });
        }
        const mapping = await Mapping.create({
            patient: patientId,
            doctor: doctorId
        })
        return res.status(200).json({ message: "doctor assigned to patient successfully", mapping });

    }

    catch (error) {
        console.log("Error assigning doctor to patient", error.message);
        return res.status(500).json({ message: "failed to assign doctor to patient" });

    }


}

const getAllMappings = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "user not found" });
        }
        const mappings = await Mapping.find()
            .populate('patient', 'name age disease createdBy')
            .populate('doctor', 'name specialization');

        if (!mappings || mappings.length === 0) {
            return res.status(404).json({ message: "no mappings found" });
        }

        const userId = req.user._id.toString();
        const userMappings = mappings.filter(mapping => {
            return mapping?.patient?.createdBy.toString() == userId;
        })

        if (!userMappings || userMappings.length === 0) {
            return res.status(404).json({ message: "no  mappings found for this user" });
        }
        return res.status(200).json(userMappings);

    }
    catch (error) {
        console.log("Error getting all patient-doctor details", error.message);
        return res.status(500).json({ message: "failed to get all patient-doctor details" });

    }

}

const getAllDoctors = async (req, res) => {
    const patientId = req.params.patient_id;
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "user not found" });
        }
        if (!mongoose.Types.ObjectId.isValid(patientId)) {
            return res.status(400).json({ message: "Invalid doctorId or patientId" });
        }
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        if (patient.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "you are not authorized to access this patients doctor list" });
        }
        const mappings = await Mapping.find({ patient: patientId }).populate('doctor', 'name specialization');
        if (!mappings || mappings.length === 0) {
            return res.status(404).json({ message: "no  mappings found for this user" });
        }
        const doctors = mappings.map(m => m.doctor);

        return res.status(200).json(doctors);
    }
    catch (error) {
        console.log("Error getting patient-doctor details", error.message);
        return res.status(500).json({ message: "failed to get patient-doctor details" });

    }
}

const deleteMapping = async (req, res) => {
    const id = req.params.id;
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "user not found" });
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid mappingId" });
        }
        const mapping = await Mapping.findById(id);
        if (!mapping) {
            return res.status(404).json({ message: "mapping not found" });
        }
        const patient = await Patient.findById(mapping.patient);
        if (patient.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "you are not authorized to remove the mapping " });

        }
        const deletedMapping = await Mapping.findByIdAndDelete(id);
        return res.status(200).json({ message: "doctor removed from patient successfully" });

    }
    catch (error) {
        console.log("Error deleting doctor from patient ", error.message);
        return res.status(500).json({ message: "failed to delete doctor from patient" });

    }
}

module.exports = { assignDoctorToPatient, getAllMappings, getAllDoctors, deleteMapping }