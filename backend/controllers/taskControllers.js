const Task = require("../models/Task");
const { validateObjectId } = require("../utils/validation");


exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json({ tasks, status: true, msg: "Tasks found successfully.." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.getTask = async (req, res) => {
  try {
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task id not valid" });
    }

    const task = await Task.findOne({ user: req.user.id, _id: req.params.taskId });
    if (!task) {
      return res.status(400).json({ status: false, msg: "No task found.." });
    }
    res.status(200).json({ task, status: true, msg: "Task found successfully.." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.postTask = async (req, res) => {
  try {
    const { eventName, startTime, endTime, location, description, category } = req.body;
    console.log(req.body);
    if (!eventName && !startTime && !endTime && !location && !description && !category) {
      return res.status(400).json({ status: false, msg: "Required fields are missing" });
    }
    const task = await Task.create({
      user: req.user.id,
      eventName,
      startTime,
      endTime,
      location,
      description,
      category,
    });
    res.status(200).json({ task, status: true, msg: "Task created successfully.." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};

exports.putTask = async (req, res) => {
  try {
    const { eventName, startTime, endTime, location, description, category } = req.body;
    if (!eventName || !startTime || !endTime || !location || !description || !category) {
      return res.status(400).json({ status: false, msg: "Required fields are missing" });
    }

    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task id not valid" });
    }

    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(400).json({ status: false, msg: "Task with given id not found" });
    }

    if (task.user != req.user.id) {
      return res.status(403).json({ status: false, msg: "You can't update task of another user" });
    }

    task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { eventName, startTime, endTime, location, description, category },
      { new: true }
    );
    res.status(200).json({ task, status: true, msg: "Task updated successfully.." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};



exports.deleteTask = async (req, res) => {
  try {
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task id not valid" });
    }

    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(400).json({ status: false, msg: "Task with given id not found" });
    }

    if (task.user != req.user.id) {
      return res.status(403).json({ status: false, msg: "You can't delete task of another user" });
    }

    await Task.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ status: true, msg: "Task deleted successfully.." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.getFilteredTasks = async (req, res) => {
  try {
    const { startTime, endTime, location, category } = req.query;

    let query = {};

    
    if (startTime) {
      query.startTime = { $gte: new Date(startTime) }; 
    }
    if (endTime) {
      query.endTime = { $lte: new Date(endTime) }; 
    }
    if (location) {
      query.location = location; 
    }
    if (category) {
      query.category = category;
    }

   
    const tasks = await Task.find(query).lean();

    res.status(200).json({ tasks, status: true, msg: "Filtered tasks retrieved successfully.." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};
