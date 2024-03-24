const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const ParentTaskSchema = new Schema({
    Parent_ID: {type: Number},
    Parent_Task: {type: String, required: true},
    Project_ID: {type: Number, default: null}
});
ParentTaskSchema.plugin(autoIncrement, {inc_field: 'Parent_ID'});
module.exports = mongoose.model('ParentTask', ParentTaskSchema);