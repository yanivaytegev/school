const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const auth = require('../../middleware/auth');
const validation = require('../../validation/registerValidation');
const validationActivity = require('../../validation/activityValidation');
const savePhoto = require('../../files/savephoto')

//manager model
const Manager = require('../../models/manager');
const Activity = require('../../models/activity');


//---------manager routes-------

//route  Post /manager
//desc   manager details
//access public
router.get('/profile', auth, (req, res) => {
    Manager.findOne({ id: req.user.id })
        .select('-password')
        .then(manager => {
            if (manager) {
                return res.status(200).json(manager)
            }
            return res.status(400).json({ msg: "user not found" })
        })
})

//route  Post /manager
//desc   update manager details
//access public
router.post('/', auth, (req, res) => {

    const uniqueNum = Date.now();
    const user = JSON.parse(req.body.user)
    if (!user.password) user.password = '********'
    const errors = validation(user);

    if (Object.entries(errors).length === 0) {

        savePhoto(req.files, uniqueNum, user, 'manager')
            .then(data => {
                Manager.findOne({ id: user.id })
                    .then(manager => {

                        if (user.password === '********') {
                            user.password = manager.password
                            Object.assign(manager, data)
                            manager.save()
                                .then(manager => res.status(200).json({ msg: "successfully updated" }))
                                .catch(err => res.status(400).json({ msg: "save failed" }))
                        }
                        else {

                            Object.assign(manager, data);
                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(manager.password, salt, (err, hash) => {
                                    if (err) throw err;
                                    manager.password = hash;
                                    manager.save()
                                        .then(manager => res.status(200).json({ msg: "successfully updated" }))
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

//route  Get /manager
//desc   get all managers
//access public
router.get('/', (req, res) => {

    Manager.find({ isActive: true })
        .sort({ firstName: 1 })
        .select('-password')
        .then(managers => res.status(200).json({ users: managers, msg: 'manager' }))
        .catch(err => res.status(404).json({ msg: "failed" }))
})

//route  Post /manager
//desc   add new manager
//access public
router.post('/register', auth, (req, res) => {

    const user = JSON.parse(req.body.user)
    const errors = validation(user);
    const file = req.files.image;

    if (Object.entries(errors).length === 0) {

        Manager.findOne({ id: user.id })
            .then(manager => {
                if (manager) return res.status(400).json({ msg: "manager already exist" })
                const newManager = new Manager(user);
                const uniqueNum = Date.now()

                if (file) {
                    file.mv(`${__dirname}/../../client/src/photos/users/manager/${uniqueNum + file.name}`, err => {
                        if (err) return res.status(500).json({ msg: 'failed to upload photo' })
                    })
                }

                newManager.photo = uniqueNum + file.name;

                //create salt & hash
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newManager.password, salt, (err, hash) => {
                        if (err) throw err;
                        newManager.password = hash;
                        newManager.save()
                            .then(manager => res.status(200).json({ msg: "successfully added" }))
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

//route  Get /manager
//desc   get all activities
//access public
router.get('/activity', (req, res) => {

    Activity.find({ isActive: true })
        .sort({ register_date: 1 })
        .then(activities => res.status(200).json(activities))
        .catch(err => res.status(404).json({ msg: "failed" }))
})

//route  Post /manager
//desc   add new activitiy
//access public
router.post('/activity', (req, res) => {

    const activity = JSON.parse(req.body.activity)
    const uniqueNum = Date.now();
    const errors = validationActivity(activity, req.files);

    if (Object.entries(errors).length === 0) {

        savePhoto(req.files, uniqueNum, activity, null)
            .then(data => {

                const newActivity = new Activity(data)

                newActivity.save()
                    .then(activity => res.status(200).json({ msg: 'saved' }))
                    .catch(err => res.status(404).json({ msg: "failed" }))
            })
    }
    else {
        const err = JSON.stringify(errors)
        return res.status(400).json({ msg: err })
    }
})


//route  Delete /manager
//desc   delete activitiy
//access public
router.delete('/activity/:id', (req, res) => {

    Activity.findOne({ _id: req.params.id })
        .then(activity => {
            activity.isActive = false;
            activity.save()
                .then(activity => {
                    return res.status(200).json(activity.id)
                })
                .catch(err => res.status(400).json({ msg: "save failed" }))
        })
        .catch(err => res.status(400).json({ msg: "not found" }))

})

//route  Delete /manager
//desc   delete manager
//access public

router.delete('/:id', auth, (req, res) => {
    console.log(req.params)

    Manager.findOne({ id: req.params.id })
        .then(manager => {
            manager.isActive = false;
            manager.save()
                .then(manager => {
                    return res.status(200).json(manager.id)
                })
                .catch(err => res.status(400).json({ msg: "save failed" }))
        })
        .catch(err => res.status(400).json({ msg: "not found" }))
})

module.exports = router;