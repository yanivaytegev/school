const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const secret = config.get('jwtSecret');
const auth = require('../../middleware/auth');

//teacher model
const Teacher = require('../../models/teacher');
//student model
const Student = require('../../models/student');
//manager model
const Manager = require('../../models/manager');


//route  Post /auth
//desc   auth teacher
//access public
router.post('/teacher', (req, res) => {

    Teacher.findOne({ id: req.body.id })
        .then(teacher => {
            if (!teacher) return res.status(400).json({ msg: "teacher does not exist" })
            //validate password
            bcrypt.compare(req.body.password, teacher.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: "invaild credentials" });

                    jwt.sign(
                        { id: teacher.id },
                        secret,
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;
                            return res.status(200).json({
                                token,
                                role: 'teacher',
                                name: `${teacher.firstName} ${teacher.lastName}`
                            })

                        }
                    )

                })
        })
})

//route  Post /auth
//desc   auth Student
//access public
router.post('/student', (req, res) => {

    Student.findOne({ id: req.body.id })
        .then(student => {
            if (!student) return res.status(400).json({ msg: "student does not exist" })
            //validate password
            bcrypt.compare(req.body.password, student.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: "invaild credentials" });

                    jwt.sign(
                        { id: student.id },
                        secret,
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;
                            return res.status(200).json({
                                token,
                                role: 'student',
                                name: `${student.firstName} ${student.lastName}`
                            })

                        }
                    )

                })
        })
})

//route  Post /auth
//desc   auth manager
//access public
router.post('/manager', (req, res) => {

    Manager.findOne({ id: req.body.id })
        .then(manager => {
            if (!manager) return res.status(400).json({ msg: "manager does not exist" })
            //validate password
            bcrypt.compare(req.body.password, manager.password)
                .then(isMatch => {

                    if (!isMatch) return res.status(400).json({ msg: "invaild credentials" });

                    jwt.sign(
                        { id: manager.id },
                        secret,
                        { expiresIn: 36000 },
                        (err, token) => {
                            if (err) throw err;
                            return res.status(200).json({
                                token,
                                role: "manager",
                                name: `${manager.firstName} ${manager.lastName}`
                            })

                        }
                    )

                })
        })
})

module.exports = router;