const mongoose = require('mongoose');
const Patient = require('../models/Patient');

const addPatient = async (req, res) => {
    const { name, age, disease } = req.body;
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "user not found" });
        }
        if (!name || !age || !disease) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(name.trim()) || name.trim().length === 0) {
            return res.status(400).json({ message: "Name must contain only letters and spaces" });
        }
        const parsedAge = Number(age);
        if (!Number.isInteger(parsedAge) || parsedAge <= 18) {
            return res.status(400).json({ message: "age must be a number greater than 18" });
        }

        if (typeof disease !== "string" || disease.trim().length === 0) {
            return res.status(400).json({ message: "disease must be a non-empty string" });
        }
        const patient = await Patient.create({
            name: name.trim(),
            age: parsedAge,
            disease: disease.trim(),
            createdBy: req.user._id
            ,
        })
        return res.status(201).json(patient);


    }
    catch (error) {
        console.log("adding patient error", error.message);
        return res.status(500).json({ message: "failed to add patient" });

    }

}

const getPatients = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "user not found" });
        }
        const patients = await Patient.find({ createdBy: req.user._id });
        if (!patients || patients.length === 0) {
            return res.status(404).json({ message: "No patients found for this user" });
        }
        return res.status(200).json(patients);

    }
    catch (error) {
        console.log("Error fetching patients", error.message);
        return res.status(500).json({ message: "failed to fetch patients" });

    }
}

const getPatient = async (req, res) => {
    const patientId = req.params.id;
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "user not found" });
        }
        if (!mongoose.Types.ObjectId.isValid(patientId)) {
            return res.status(400).json({ message: "Invalid patientId" });
        }

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: "patient not found" });
        }
        return res.status(200).json(patient);


    }
    catch (error) {
        console.log("Error fetching patient", error.message);
        return res.status(500).json({ message: "failed to fetch patient details" });

    }
}

const updatePatient = async (req, res) => {
    const patientId = req.params.id;
    const { name, age, disease } = req.body;
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "user not found" });
        }
        if (!mongoose.Types.ObjectId.isValid(patientId)) {
            return res.status(400).json({ message: "Invalid patientId" });
        }

        const existingPatient = await Patient.findById(patientId);
        if (!existingPatient) {
            return res.status(404).json({ message: "not existing patient" });
        }
        if (existingPatient.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not Authenticated to update patient details" });
        }


        if (!name || !age || !disease) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(name.trim()) || name.trim().length === 0) {
            return res.status(400).json({ message: "Name must contain only letters and spaces" });
        }
        const parsedAge = Number(age);
        if (!Number.isInteger(parsedAge) || parsedAge <= 18) {
            return res.status(400).json({ message: "age must be a number greater than 18" });
        }

        if (typeof disease !== "string" || disease.trim().length === 0) {
            return res.status(400).json({ message: "disease must be a non-empty string" });
        }

        const updatedPatient = await Patient.findByIdAndUpdate(
            patientId, {
            name: name.trim(),
            age: parsedAge,
            disease: disease.trim()
        }, {
            new: true
        })

        if (!updatedPatient) {
            return res.status(404).json({ message: "patient not found" });
        }

        return res.status(200).json(updatedPatient);
    }
    catch (error) {
        console.log("Error updating patient", error.message);
        return res.status(500).json({ message: "failed to update patient details" });

    }


}

const deletePatient = async (req, res) => {
    const patientId = req.params.id;
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "user not found" });
        }
        if (!mongoose.Types.ObjectId.isValid(patientId)) {
            return res.status(400).json({ message: "Invalid patientId" });
        }

        const existingPatient = await Patient.findById(patientId);
        if (!existingPatient) {
            return res.status(404).json({ message: "not existing patient" });
        }
        if (existingPatient.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not Authenticated to delete patient details" });
        }

        const deletePatient = await Patient.findByIdAndDelete(patientId);
        return res.status(200).json({ message: "patient deleted successfully" });

    }
    catch (error) {
        console.log("Error deleting patient", error.message);
        return res.status(500).json({ message: "failed to delete patient details" });

    }

}

module.exports = { addPatient, getPatients, getPatient, updatePatient, deletePatient };