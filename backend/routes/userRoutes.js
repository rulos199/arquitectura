// backend/routes/userRoutes.js
const express = require('express');
const { registerPatient, loginPatient, registerDoctor, loginDoctor } = require('../controllers/userController');

const router = express.Router();

router.post('/register/patient', registerPatient);
router.post('/login/patient', loginPatient);
router.post('/register/doctor', registerDoctor);
router.post('/login/doctor', loginDoctor);

module.exports = router;