const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

var schemaOptions = {
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
  };

var UsersSchema = new Schema({
    User_ID:{type: Number},
    First_Name: {type: String, required: true},
    Last_Name: {type: String, required: true},
    Employee_ID: {type: Number, required: true},
    Project_ID: {type: Number, default: null},
    Task_ID: {type: Number, default: null}},
    schemaOptions,
    { collection: 'users' }
);

UsersSchema
.virtual('Full_Name')
.get(function () {
  return this.First_Name + ' ' + this.Last_Name;
});

UsersSchema.plugin(autoIncrement, {inc_field: 'User_ID'});

module.exports = mongoose.model('users', UsersSchema);