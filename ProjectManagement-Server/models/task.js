const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

var schemaOptions = {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  };

const TaskSchema = new Schema({
    Task_ID: {type: Number},
    Task: {type: String, required: true},
    Start_Date: {type: Date, default: null},
    End_Date: {type: Date, default: null},
    Priority: {type: Number},
    Status: {type: Number, default: 0},  // 0-Task Open, 1-Task Completed
    Project: {type: Schema.Types.ObjectId, ref: 'Project'},
    Parent: {type: Schema.Types.ObjectId, ref: 'ParentTask'},
    User: {type: Schema.Types.ObjectId, ref: 'User'}},

    schemaOptions,
    {
        collection: 'tasks'
    }
);

TaskSchema.plugin(autoIncrement, {inc_field: 'Task_ID'});
module.exports = mongoose.model('Task', TaskSchema);