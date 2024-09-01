const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courseSchema = new Schema({
    day: {
        type: Number
    },
    month: {
        type: Number
    },
    year: {
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    fee: {
        type: Number, 
        required: true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true

    }
});
module.exports = mongoose.model('Course', courseSchema) 
