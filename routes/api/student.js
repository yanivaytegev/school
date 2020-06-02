const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const auth = require('../../middleware/auth');
const validation = require('../../validation/registerValidation');

//student model
const Student = require('../../models/student');


//---------student routes-------

//route  Post /student
//desc   add new student
//access public
router.post('/register', auth, (req, res) => {

    const user = JSON.parse(req.body.user)
    const errors = validation(user);
    const file = req.files.image

    if (Object.entries(errors).length === 0) {

        Student.findOne({ id: user.id })
            .then(student => {

                if (student) return res.status(400).json({ msg: "student already exist" })
                const newStudent = new Student(user);
                const uniqueNum = Date.now();
                if (file) {
                    file.mv(`${__dirname}/../../client/src/photos/users/student/${uniqueNum + file.name}`, err => {
                        if (err) return res.status(500).json({ msg: 'failed to upload photo' })
                    })
                }
                newStudent.photo = uniqueNum + file.name;

                //create salt & hash
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newStudent.password, salt, (err, hash) => {
                        if (err) throw err;
                        newStudent.password = hash;
                        newStudent.save()
                            .then(student => res.status(200).json({ user: student, msg: "successfully added" }))
                    })
                })
            })
            .catch(err => {
                res.status(404).json(err)
            })
    }
    else {
        const err = JSON.stringify(errors)
        return res.status(400).json({ msg: err })
    }
})

//route  Delete /student
//desc   delete student
//access public
router.delete('/:id', (req, res) => {

    Student.findOne({ id: req.params.id })
        .then(student => {
            student.isActive = false;
            student.save()
                .then(student => {
                    return res.status(200).json(student.id)
                })
                .catch(err => res.status(400).json({ msg: "save failed" }))
        })
        .catch(err => res.status(400).json({ msg: "student not found" }))

})

//route  Get /student
//desc   get all students
//access public
router.get('/', auth, (req, res) => {

    Student.find({ isActive: true })
        .sort({ firstName: 1 })
        .select('-password')
        .then(students =>
            res.status(200).json({ users: students, msg: 'student' })
        )
        .catch(err =>
            res.status(404).json({ msg: "failed" })
        )
})

//route  Post /student
//desc   update student details
//access public
router.post('/', auth, (req, res) => {

    const uniqueNum = Date.now();
    const user = JSON.parse(req.body.user)
    if (!user.password) user.password = '********'
    const errors = validation(user);

    if (Object.entries(errors).length === 0) {

        savePhoto(req.files, uniqueNum, user, 'student')
            .then(data => {
                Student.findOne({ id: user.id })
                    .then(student => {

                        if (user.password === '********') {
                            user.password = student.password
                            Object.assign(student, data)
                            student.save()
                                .then(student => res.status(200).json({ msg: "successfully updated" }))
                                .catch(err => res.status(400).json({ msg: "save failed" }))
                        }
                        else {

                            Object.assign(student, data);
                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(student.password, salt, (err, hash) => {
                                    if (err) throw err;
                                    student.password = hash;
                                    student.save()
                                        .then(student => res.status(200).json({ msg: "successfully updated" }))
                                        .catch(err => res.status(400).json({ msg: "save failed" }))
                                })
                            })
                        }
                    })
                    .catch(err => res.status(400).json({ msg: "user not found" }))
            })
            .catch(err => {
                return res.status(400).json({ msg: err })
            })
    }
    else {
        const err = JSON.stringify(errors)
        return res.status(400).json({ msg: err })
    }
})

//route  Post /student
//desc   student details
//access public
router.get('/profile', auth, (req, res) => {

    Student.findOne({ id: req.user.id })
        .select('-password')
        .then(student => {
            if (student) {
                return res.status(200).json(student)
            }
            return res.status(400).json({ msg: "user not found" })
        })
})

//route  Get /student
//desc   get all students from same class
//access public
router.get('/myClass', auth, (req, res) => {

    Student.findOne({ id: req.user.id })
        .then(student =>
            Student.find({ isActive: true, teacherID: student.teacherID })
                .sort({ firstName: 1 })
                .select('-password')
                .then(students => res.status(200).json({ users: students, msg: 'student' }))
                .catch(err => res.status(404).json({ msg: "failed" }))
        )
        .catch(err => res.status(404).json({ msg: "failed" }))
})



module.exports = router;