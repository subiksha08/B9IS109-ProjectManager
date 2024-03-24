const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;
const Task = require('./task')

const ProjectSchema = new Schema({
    Project_ID: {type: Number},
    Project: {type: String, required: true},
    Start_Date: {type: Date, default: null},
    End_Date: {type: Date, default: null},
    Priority: {type: Number},
    Manager_ID: {type: Number, default: null}
});

ProjectSchema
.virtual('Tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'Project'
});

ProjectSchema
.virtual('NoOfTasks').get(function () {
  return this.get('Tasks') ? this.get('Tasks').length : 0;
});

ProjectSchema
.virtual('CompletedTasks').get(function () {
  if (this.get('Tasks') && this.get('Tasks').length > 0) {
    var tasks = this.get('Tasks').filter(function (task) {
      return task.Status == 1;
    });
    console.log("Virtual CompletedTasks="+ tasks.length);
    return tasks.length;
  }
  else {
    return 0;
  }
});

ProjectSchema.plugin(autoIncrement, { inc_field: 'Project_ID' }); 
module.exports = mongoose.model('Project', ProjectSchema);