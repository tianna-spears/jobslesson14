const Job = require("../models/Job");
// GET /jobs (display all the job listings belonging to this user)
const getJob = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id });
    res.render('jobs', { jobs });
  } catch (error) {
    res.status(500).send('Error retrieving jobs');
  }
};

const newForm = (req, res) => {
  res.render('job', { job: null });
};

// POST /jobs (Add a new job listing)
const createJob = async (req, res) => {
  try {
    const { company, position, status } = req.body;
    await Job.create({ company, position, status, createdBy: req.user._id });
    res.redirect('/jobs');
  } catch (error) {
    res.status(500).send('Error creating job');
  }
};

const editForm = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!job) return res.status(404).send('Job not found');
    res.render('job', { job });
  } catch (error) {
    res.status(500).send('Error retrieving job');
  }
};

// GET /jobs/edit/:id (Get a particular entry and show it in the edit box)
const updateJobByID = async (req, res) => {
  try {
    const { company, position, status } = req.body;
    await Job.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { company, position, status },
      { runValidators: true }
    );
    res.redirect('/jobs');
  } catch (error) {
    res.status(500).send('Error updating job');
  }
};

// POST /jobs/delete/:id (Delete an entry)
const deleteJobByID = async (req, res) => {
  try {
    await Job.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    res.redirect('/jobs');
  } catch (error) {
    res.status(500).send('Error deleting job');
  }
};

module.exports = {
    getJob, 
    createJob,
    editForm,
    newForm,
    updateJobByID,
    deleteJobByID
};
