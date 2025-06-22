const express = require('express');
const router = express.Router();
const {
    getJob,
    createJob,
    newForm,
    editForm,
    updateJobByID,
    deleteJobByID
} = require('../controllers/jobs');

router.get('/', getJob);
router.post('/', createJob);
router.get('/new', newForm);
router.get('/edit/:id', editForm);
router.post('/update/:id', updateJobByID);
router.post('/delete/:id', deleteJobByID);

module.exports = router;
