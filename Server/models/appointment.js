const Mongoose =require('mongoose');

const Schema=Mongoose.Schema;
const UserSchema=new Schema(
    {   
        pid:{
            type:String,
            required:true
        },
        did:{
            type:String,
            required:true
        },
        pname:{
            type:String,
            required:true
        },
        mobile:{
            type:Number,
            required:true
        },
        dname:{
            type:String,
            required:true
        },
        admitted_date:{
            type:Date,
            default:Date.now
        },
        schedule_date:{
            type:Date,
            required:true
        },
        time:{
            type:String,
            required:true
        },
        discharge_date:Date,
        status:{
            type:String,
            enum:['cancel','D','P','progress','confirm','I'],
            required:true
        },
        dep:{
            type:String,
            required:true
        },
        notes:String,
        doctor_qs:Array ,
        medicines:Array,
        tests:Array,
        bill:Array,
        weight:Number,
        ctime:Number,
        height:Number,
        feedback:{
            type:Number,
            default:0
        },
        pat_chat:Array,
        doc_chat:Array,
    },{
        versionKey:false,timestamps:true
    }
);

const UserModel=Mongoose.model("Appointment",UserSchema);

module.exports=UserModel;

