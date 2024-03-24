const express = require('express');
const userRepo = express.Router();
const url = require('url');
let User = require('../models/users');

// to add new user
userRepo.route('/add').post(function (req, res) {
    let newuser = new User(req.body);
    newuser.save()
        .then(newuser => {
            res.status(200).json({ 'Success': true, 'message': 'User added successfully' });
        })
        .catch(err => {
            res.status(400).json({ 'Success': false, 'message': 'Error in adding user' });
        })
})

// to delete user by id
userRepo.route('/delete/:id').get(function (req, res) {
    let _uid = req.params.id;

    User.findOneAndRemove({ User_ID: _uid }, function (err, data) {
        if (err) {
            res.json({ 'Success': false, 'message': 'Error in deleting user' });
        }
        else {
            res.json({ 'Success': true, 'message': 'User deleted Successfully' })
        }
    })
})

// to edit user by id
userRepo.route('/edit/:id').post(function (req, res) {
    let _uid = req.params.id;

    User.findOne({ User_ID: _uid }, function (err, user) {
        if (!user) {
            return next(new Error('User not exists'));
        }
        else {
            user.First_Name = req.body.First_Name;
            user.Last_Name = req.body.Last_Name;
            user.Employee_ID = req.body.Employee_ID;

            user.save()
                .then(user => {
                    res.status(200).json({ 'Success': true, 'message': 'User updated Successfully' });
                })
                .catch(err => {
                    res.status(400).json({ 'Success': false, 'message': 'Error in updating user' });
                })
        }
    })
})

// get user by id
userRepo.route('/:id').get(function (req, res) {
    let _uid = req.params.id;

    User.findOne({ User_ID: _uid }, function (err, user) {
        if (err) {
            res.json({ 'Success': false, 'Message': 'User not exists' })
        }
        else {
            res.json({ 'Success': true, 'Data': user });
        }
    });
});

// get user by object
userRepo.route('/obj/:id').get(function (req, res) {
    let _uid = req.params.id;

    User.findOne({ _id: _uid }, function (err, user) {
        if (err) {
            res.json({ 'Success': false, 'Message': 'User not exists' })
        }
        else {
            res.json({ 'Success': true, 'Data': user });
        }
    });
});

// get users list with search and sort criteria
userRepo.route('/').get(function (req, res) {
    var userQuery = User.find();
    var queryparams = req.query;

    if (queryparams.searchKey) {
        userQuery.or([
            { 'First_Name': { $regex: queryparams.searchKey, $options: 'i' } },
            { 'Last_Name': { $regex: queryparams.searchKey, $options: 'i' } }
        ]);
    }
    if (queryparams.sortKey) {
        userQuery.sort([[queryparams.sortKey, 1]]);
    }

    userQuery.exec(function(err, users) {

        if (err) {
            res.json({ 'Success': false })
        }
        else {
            res.json({ 'Success': true, 'Data': users });
        }
    });
})

// assign user as Project Manager
userRepo.route('/edit/:id').post(function (req, res) {

    let _uid = req.params.id;

    User.findOne({ User_ID: _uid }, function (err, user) {
        if (!user)
            return next(new Error('user not found'));
        else {
            user.update({ 'Project_ID': req.body.Project_ID }).then(user => {
                res.json({ 'Success': true });
            })
                .catch(err => {
                    res.status(400).json({ 'Success': false });
                });
        }
    });
});

// assign user with task
userRepo.route('/edit/:id').post(function (req, res) {

    let _uid = req.params.id;

    User.findOne({ User_ID: _uid }, function (err, user) {
        if (!user)
            return next(new Error('user not found'));
        else {
            user.update({ 'Task_ID': req.body.Task_ID }).then(user => {
                res.json({ 'Success': true });
            })
                .catch(err => {
                    res.status(400).json({ 'Success': false });
                });
        }
    });
});


module.exports = userRepo;
