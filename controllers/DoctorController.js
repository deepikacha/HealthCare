const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');

const addDoctor = async (req, res) => {
    const { name, specialization } = req.body;
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "user not found" });
        }
        if (!name || !specialization) {
            return res.status(400).json({ message: "name and specialization is required" });
        }
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(name.trim()) || name.trim().length === 0) {
            return res.status(400).json({ message: "Name must contain only letters and spaces" });
        }

        if (typeof specialization !== "string" || specialization.trim().length === 0) {
            return res.status(400).json({ message: "disease must be a non-empty string" });
        }
        const doctor = await Doctor.create({
            name: name.trim(),
            specialization: specialization.trim(),
            createdBy: req.user._id

        })
        return res.status(201).json(doctor)


    }
    catch (error) {
        console.log("Error adding Doctor", error.message);
        return res.status(500).json({ message: "failed to add Doctor" });

    }
}

const getDoctors = async (req, res) => {

    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "user not found" });
        }
        const doctors = await Doctor.find({ createdBy: req.user._id });

        if (!doctors || doctors.length === 0) {
            return res.status(404).json({ message: "No doctors found " });
        }
        return res.status(200).json(doctors);


    }
    catch (error) {
        console.log("Error getting Doctors", error.message);
        return res.status(500).json({ message: "failed to get Doctors details" });

    }
}

const getDoctor = async (req, res) => {
    const doctorId = req.params.id;
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "user not found" });
        }
        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            return res.status(400).json({ message: "Invalid doctorId" });
        }

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "doctor not found" });
        }
        return res.status(200).json(doctor);


    }
    catch (error) {
        console.log("Error fetching Doctor", error.message);
        return res.status(500).json({ message: "failed to fetch doctor details" });

    }
}

const updateDoctor = async (req, res) => {
    const doctorId = req.params.id;
    const { name, specialization } = req.body;
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "user not found" });
        }
        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            return res.status(400).json({ message: "Invalid doctorId" });
        }

        const existingDoctor = await Doctor.findById(doctorId);
        if (!existingDoctor) {
            return res.status(404).json({ message: "not existing Doctor" });
        }
        if (existingDoctor.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not Authenticated to update doctor details" });
        }


        if (!name || !specialization) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(name.trim()) || name.trim().length === 0) {
            return res.status(400).json({ message: "Name must contain only letters and spaces" });
        }

        if (typeof specialization !== "string" || specialization.trim().length === 0) {
            return res.status(400).json({ message: "specialization must be a non-empty string" });
        }

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            doctorId, {
            name: name.trim(),
            specialization: specialization.trim()
        }, {
            new: true
        })

        if (!updatedDoctor) {
            return res.status(404).json({ message: "doctor not found" });
        }

        return res.status(200).json(updatedDoctor);
    }
    catch (error) {
        console.log("Error updating doctor", error.message);
        return res.status(500).json({ message: "failed to update doctor details" });

    }


}

const deleteDoctor = async (req, res) => {
    const doctorId = req.params.id;
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "user not found" });
        }
        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            return res.status(400).json({ message: "Invalid doctorId" });
        }

        const existingDoctor = await Doctor.findById(doctorId);
        if (!existingDoctor) {
            return res.status(404).json({ message: "not existing Doctor" });
        }
        if (existingDoctor.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not Authenticated to delete Doctor details" });
        }

        const deletedDoctor = await Doctor.findByIdAndDelete(doctorId);
        return res.status(200).json({ message: "Doctor deleted successfully" });

    }
    catch (error) {
        console.log("Error deleting Doctor", error.message);
        return res.status(500).json({ message: "failed to delete Doctor details" });

    }

}


module.exports = { addDoctor, getDoctors, getDoctor, updateDoctor, deleteDoctor };