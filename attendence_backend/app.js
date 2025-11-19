const Express = require("express");
const Mongoose = require("mongoose");
const Bcrypt = require("bcrypt");
const Cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Models
const userModel = require("./models/users");
const attendenceModel = require("./models/attendence");
const taskModel = require("./models/task");
const taskTimeModel = require("./models/taskTime");

dotenv.config();
let app = Express();

app.use(Express.json());
app.use(Cors());

Mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));



// GET tasks assigned to a user
app.get("/tasks/user/:userId", async (req, res) => {
  try {
    const tasks = await taskModel.find({ userId: req.params.userId });
    res.json({ status: "success", data: tasks });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// CREATE TASK
app.post("/createTask", async (req, res) => {
  const task = new taskModel({
    title: req.body.title,
    description: req.body.description,
    userId: req.body.userId,
  });

  await task.save();
  res.json({ status: "success", message: "Task created" });
});

// GET all users (Admin)
app.get("/admin/users", async (req, res) => {
  try {
    const users = await userModel.find({}, "name email role");
    res.json({ status: "success", data: users });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});


// GET all attendance records
app.get("/admin/attendance", async (req, res) => {
  try {
    const records = await attendenceModel
      .find()
      .populate("userId", "name email")
      .sort({ checkInTime: -1 });

    res.json({ status: "success", data: records });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// GET attendance by user
app.get("/admin/attendance/:userId", async (req, res) => {
  try {
    const records = await attendenceModel
      .find({ userId: req.params.userId })
      .sort({ checkInTime: -1 });

    res.json({ status: "success", data: records });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Employees currently checked-in
app.get("/admin/attendance/present", async (req, res) => {
  try {
    const present = await attendenceModel
      .find({ status: "checked-in" })
      .populate("userId", "name email");

    res.json({ status: "success", data: present });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// CHECK-IN
app.post("/checkin", async (req, res) => {
  const userId = req.body.userId;

  // Check if already checked in
  const lastRecord = await attendenceModel.findOne({
    userId: userId,
    status: "checked-in",
  });

  if (lastRecord) {
    const now = new Date();
    const difference = now - new Date(lastRecord.checkInTime);
    const hours = difference / (1000 * 60 * 60);

    if (hours >= 8) {
      lastRecord.checkOutTime = new Date(
        lastRecord.checkInTime.getTime() + 8 * 60 * 60 * 1000
      );
      lastRecord.status = "checked-out";
      await lastRecord.save();
    } else {
      return res.json({
        status: "error",
        message: "User is already checked in",
      });
    }
  }

  const newAttendance = new attendenceModel({
    userId: req.body.userId,
    checkInTime: new Date(),
    status: "checked-in",
  });

  await newAttendance.save();

  res.json({
    status: "success",
    message: "Checked in successfully",
  });
});

// CHECK-OUT
app.post("/checkout", async (req, res) => {
  const record = await attendenceModel.findOne({
    userId: req.body.userId,
    status: "checked-in",
  });

  if (!record) {
    return res.json({
      status: "error",
      message: "User has not checked in",
    });
  }

  record.checkOutTime = new Date();
  record.status = "checked-out";

  await record.save();

  res.json({
    status: "success",
    message: "Checked out successfully",
  });
});


// START timer
app.post("/task/start", async (req, res) => {
  try {
    const { userId, taskId } = req.body;

    const open = await taskTimeModel.findOne({
      userId,
      taskId,
      endTime: null,
    });

    if (open)
      return res.status(400).json({
        status: "error",
        message: "A timer for this task is already running",
      });

    const log = new taskTimeModel({
      userId,
      taskId,
      startTime: new Date(),
    });

    await log.save();
    await taskModel.findByIdAndUpdate(taskId, { status: "in-progress" });

    res.json({
      status: "success",
      message: "Task timer started",
      logId: log._id,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// STOP timer
app.post("/task/stop", async (req, res) => {
  try {
    const { userId, taskId } = req.body;

    const log = await taskTimeModel
      .findOne({ userId, taskId, endTime: null })
      .sort({ startTime: -1 });

    if (!log)
      return res
        .status(400)
        .json({ status: "error", message: "No running timer found" });

    const end = new Date();
    const durationMs = end - new Date(log.startTime);
    const durationSeconds = Math.round(durationMs / 1000);

    log.endTime = end;
    log.durationSeconds = durationSeconds;
    await log.save();

    await taskModel.findByIdAndUpdate(taskId, {
      $inc: { timeSpentSeconds: durationSeconds },
    });

    res.json({
      status: "success",
      message: "Task timer stopped",
      durationSeconds,
      logId: log._id,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// GET time logs by user
app.get("/task/times/user/:userId", async (req, res) => {
  try {
    const logs = await taskTimeModel
      .find({ userId: req.params.userId })
      .populate("taskId", "title description");

    res.json({ status: "success", data: logs });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// GET time logs by task
app.get("/task/times/task/:taskId", async (req, res) => {
  try {
    const logs = await taskTimeModel
      .find({ taskId: req.params.taskId })
      .populate("userId", "name email");

    res.json({ status: "success", data: logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
});


// SIGN IN
app.post("/signIn", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) return res.json({ status: "Invalid email Id" });

    const valid = Bcrypt.compareSync(req.body.password, user.password);
    if (!valid) return res.json({ status: "Incorrect Password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      status: "success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// SIGN UP
app.post("/signup", async (req, res) => {
  let input = req.body;
  let hashedPassword = Bcrypt.hashSync(req.body.password, 10);

  req.body.password = hashedPassword;

  const existing = await userModel.find({ email: req.body.email });

  if (existing.length > 0)
    return res.json({ status: "email Id already exist" });

  let result = new userModel(input);
  await result.save();

  res.json({ status: "success" });
});

// GET user by ID
app.get("/user/:id", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Attendance Tracking Backend Running Successfully ");
});


const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
