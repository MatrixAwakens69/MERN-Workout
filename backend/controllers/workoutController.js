const Workout = require('../models/WorkoutModel');
const mongoose = require('mongoose');

const getWorkouts = async (req, res) => {
    const workouts = await Workout.find({}).sort({ createdAt: -1 });
    
    res.status(200).json(workouts);
};

const getSingleWorkout = async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid ID" });
    }
    
    const workout = await Workout.findById(id);
    
    if (!workout) {
        return res.status(404).json({ error: 'Workout not found!' });
    }
    
    res.status(200).json(workout);
};

const createWorkout = async (req, res) => {
    const { title, load, reps } = req.body;

    let emptyFields = [];

    if (!title) {
        emptyFields.push('title');
    }
    if (!load) {
        emptyFields.push('load');
    }
    if (!reps) {
        emptyFields.push('reps');
    }
    if (emptyFields.length) {
        return res.status(400).json({
            error: 'Please fill in all the fields',
            emptyFields
        })
    }

    try {
        const workout = await Workout.create({ title, load, reps });
        res.status(200).json(workout);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const deleteWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid ID" });
    }

    const workout = await Workout.findOneAndDelete({ _id: id });

    if(!workout) {
        return res.status(404).json({ error: "Workout not found!" })
    }

    res.status(200).json("Deleted Successfully!");
}

const updateWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid ID" });
    }

    const workout = await Workout.findOneAndUpdate({ _id: id }, {
        // title: req.body.title,
        // load: req.body.load,
        // reps: req.body.reps
        ...req.body
    });

    if(!workout) {
        return res.status(404).json({ error: "Workout not found!" });
    }

    res.status(200).json("Updated Successfully!");
}

module.exports = {
    createWorkout,
    getWorkouts,
    getSingleWorkout,
    deleteWorkout,
    updateWorkout
};