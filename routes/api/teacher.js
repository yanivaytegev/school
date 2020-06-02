const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const auth = require('../../middleware/auth');
const validation = require('../../validation/registerValidation');

//teacher model
const Teacher = require('../../models/teacher');
const Student = require('../../models/student');

//---------teacher routes-------

//route  Post /teacher
//desc   teacher details
//access public
router.get('/profile', auth, (req, res) => {

    Teacher.findOne({ id: req.user.id })
        .select('-password')
        .then(teacher => {
            if (teacher) {
                return res.status(200).json(teacher)
            }
            return res.status(400).json({ msg: "user not found" })
        })
})

//route  Post /teacher
//desc   update teacher details
//access public
router.post('/', auth, (req, res) => {

    const uniqueNum = Date.now();
    const user = JSON.parse(req.body.user)
    if (!user.password) user.password = '********'
    const errors = validation(user);

    if (Object.entries(errors).length === 0) {

        savePhoto(req.files, uniqueNum, user, 'teacher')
            .then(data => {
                Teacher.findOne({ id: user.id })
                    .then(teacher => {

                        if (user.password === '********') {
                            user.password = teacher.password
                            Object.assign(teacher, data)
                            teacher.save()
                                .then(teacher => res.status(200).json({ msg: "successfully updated" }))
                                .catch(err => res.status(400).json({ msg: "save failed" }))
                        }
                        else {

                            Object.assign(teacher, data);
                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(teacher.password, salt, (err, hash) => {
                                    if (err) throw err;
                                    teacher.password = hash;
                                    teacher.save()
                                        .then(teacher => res.status(200).json({ msg: "successfully updated" }))
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

//route  Delete /teacher
//desc   delete teacher
//access public
router.delete('/:id', auth, (req, res) => {

    Teacher.findOne({ id: req.params.id })
        .then(teacher => {
            teacher.isActive = false;
            teacher.save()
                .then(teacher => {
                    return res.status(200).json(teacher.id)
                })
                .catch(err => res.status(400).json({ msg: "save failed" }))
        })
        .catch(err => res.status(400).json({ msg: "not found" }))
})

//route  Post /teacher
//desc   add new teacher
//access public
router.post('/register', auth, (req, res) => {

    const user = JSON.parse(req.body.user)
    const errors = validation(user);
    const file = req.files.image;

    if (Object.entries(errors).length === 0) {

        Teacher.findOne({ id: user.id })
            .then(teacher => {

                if (teacher) return res.status(400).json({ msg: "teacher already exist" })
                const newTeacher = new Teacher(user);
                const uniqueNum = Date.now();
                if (file) {
                    file.mv(`${__dirname}/../../client/src/photos/users/teacher/${uniqueNum + file.name}`, err => {
                        if (err) return res.status(500).json({ msg: 'failed to upload photo' })
                    })
                }
                newTeacher.photo = uniqueNum + file.name;

                //create salt & hash
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newTeacher.password, salt, (err, hash) => {
                        if (err) throw err;
                        newTeacher.password = hash;
                        newTeacher.save()
                            .then(teacher => res.status(200).json({ user: teacher, msg: "successfully added" }))
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

//route  Get /teacher
//desc   get all teachers
//access public
router.get('/', (req, res) => {

    Teacher.find({ isActive: true })
        .sort({ firstName: 1 })
        .select('-password')
        .then(teachers => res.status(200).json({ users: teachers, msg: 'teacher' }))
        .catch(err => res.status(404).json({ msg: "failed" }))
})

//route  Get /teacher
//desc   get my class teacher
//access public
router.get('/myClass', auth, (req, res) => {

    Teacher.findOne({ id: req.user.id })
        .then(teacher =>
            Student.find({ isActive: true, teacherID: teacher._id })
                .sort({ firstName: 1 })
                .select('-password')
                .then(students => res.status(200).json({ users: students, msg: 'student' }))
                .catch(err => res.status(404).json({ msg: "failed" }))
        )
        .catch(err => res.status(404).json({ msg: "failed" }))
})

module.exports = router;