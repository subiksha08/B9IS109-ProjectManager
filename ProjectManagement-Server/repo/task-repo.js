const express = require('express');
const taskRepo = express.Router();

let Project = require('../models/project');
let Task = require('../models/task');
let User = require('../models/users');

// add new task
taskRepo.route('/add').post(function (req, res) {
    let addTask = new Task(req.body);
    addTask.save()
        .then(addTask => {
            res.status(200).json({ 'Success': true })
        })
        .catch(err => {
            res.status(400).send({ 'Success': false, 'Message': err });
        });
});

//end task
taskRepo.route('/delete/:id').get(function (req, res) {

    let taskId = req.params.id;

    Task.findOne({ Task_ID: taskId }, function (err, task) {

        task.Status = 1;

        task.save().then(updateTask => {
            res.status(200).json({ 'Success': true })
        })
        .catch(err => {
            res.status(400).send({ 'Success': false, 'Message': 'Error while updating task' });
        });

    });
});

// to list tasks of that project
taskRepo.route('/').get(function (req, res) {
    console.log("list tasks of that project");
    var taskQuery = Task.find();
    var queryparams = req.query;

    if (queryparams.projectId) {

        Project.findOne({ Project_ID: queryparams.projectId }, function (err, project) {

            taskQuery.or([
                { Project: project._id}
            ]);

            if (queryparams.sortKey) {
                var sortdirection = 1;
                if (queryparams.sortKey == "Status") {
                    sortdirection = -1;
                }
                taskQuery.sort([[queryparams.sortKey, sortdirection]]);
            }

            taskQuery
                .populate('ProjectSchema')
                .populate('UsersSchema')
                .populate('ParentTaskSchema');

            taskQuery.exec(function (err, tasks) {

                if (err) {
                    res.json({ 'Success': false, 'Error': err});
                }
                else {
                    res.json({ 'Success': true, 'Data': tasks });
                }
            });
        });
    }
});

//get single task
taskRepo.route('/:id').get(function (req, res) {

    let taskId = req.params.id;
console.log("taskId = " + taskId);
    var taskQuery = Task.findOne({ Task_ID: taskId })
        .populate('ProjectSchema')
        .populate('UsersSchema')
        .populate('ParentTaskSchema');

    taskQuery.exec(function (err, task) {
        if (err) {
            res.json({ 'Success': false, 'Message': 'task not found' })
        }
        else {
            res.json({ 'Success': true, 'Data': task });
        }
    });
});

// udate task
taskRepo.route('/edit').post(function (req, res) {

    let updateTask = new Task(req.body);

    Task.findOne({ Task_ID: updateTask.Task_ID }, function (err, task) {

        task.Task = updateTask.Task;
        task.Priority = updateTask.Priority;
        task.Start_Date = updateTask.Start_Date;
        task.End_Date = updateTask.End_Date;
        task.Parent = updateTask.Parent;

        task.save().then(updateTask => {
            res.status(200).json({ 'Success': true })
        })
            .catch(err => {
                res.status(400).send({ 'Success': false, 'Message': 'Error occured while updating doc' });
            });

    });
});

module.exports = taskRepo;
