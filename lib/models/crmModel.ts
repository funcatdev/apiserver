import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const ContactSchema = new Schema({
    phoneNum:{
        type:String,
        required:'enter the phone number'
    },
    create_date:{
        type:Date,
        default:Date.now
    }
})