const express = require('express');
const projectRepo = express.Router();

var Project = require('../models/project');
//var User = require('../models/users');

// to add new project
projectRepo.route('/add').post(function (req, res) {
    let newproject = new Project(req.body);
    newproject.save()
        .then(newproject => {
            res.status(200).json({ 'Success': true })
        })
        .catch(err => {
            res.status(400).send({ 'Success': false, 'Message': 'Error while creating new Project' });
        });
});

// to delete project
projectRepo.route('/delete/:id').get(function (req, res) {
    let _pid = req.params.id;
    Project.find({ Project_ID: _pid }).remove(function (err, user) {
        if (err)
            res.json({ 'Success': false, 'Message': 'Project not found' });
        else
            res.json({ 'Success': true });
    });
});

// to get project by Project_ID
projectRepo.route('/:id').get(function (req, res) {
    let _pid = req.params.id;
    Project.findOne({ Project_ID: _pid }, function (err, project) {
        if (err) {
            res.json({ 'Success': false, 'Message': 'Project not found' })
        }
        else {
            res.json({ 'Success': true, 'Data': project });
        }
    });
});

// to get project by object id
projectRepo.route('/obj/:id').get(function (req, res) {
    let _pid = req.params.id;
    Project.findOne({ _id: _pid }, function (err, project) {
        if (err) {
            res.json({ 'Success': false, 'Message': 'Project not found' })
        }
        else {
            res.json({ 'Success': true, 'Data': project });
        }
    });
});

// to list projects with search and sort criteria
projectRepo.route('/').get(function (req, res) {

    var projectQuery = Project.find();
    var queryparams = req.query;

    if (queryparams.searchKey) {
        projectQuery.or([
            { 'Project': { $regex: queryparams.searchKey, $options: 'i' } }]);
    }

    if (queryparams.sortKey) {
        projectQuery.sort([[queryparams.sortKey, 1]]);
    }

    projectQuery
        .populate('Tasks', ['Task_ID', 'Status'])
        .exec(function (err, projects) {

            if (err) {
                res.json({ 'Success': false })
            }
            else {

                res.json({ 'Success': true, 'Data': projects });
                console.log(projects);
            }
        });
});

// to update project
projectRepo.route('/edit/:id').post(function (req, res) {

    let _pid = req.params.id;
    console.log("Update Project for ID = " + _pid);
    Project.findOne({ Project_ID: _pid }, function (err, project) {
        if (!project)
            return next(new Error('project not found'));
        else {
            project.Project = req.body.Project;
            project.Priority = req.body.Priority;
            project.Manager_ID = req.body.Manager_ID;
            project.Start_Date = req.body.Start_Date;
            project.End_Date = req.body.End_Date;

            project.save().then(project => {
                res.json({ 'Success': true });
            })
                .catch(err => {
                    res.status(400).json({ 'Success': false });
                });
        }
    });
});

module.exports = projectRepo;
