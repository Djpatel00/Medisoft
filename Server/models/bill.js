import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const BillSchema = new Schema(
  {
    name:String,    
    aid: { type: mongoose.Schema.Types.ObjectId, ref: "appointment" },
    pid: { type: mongoose.Schema.Types.ObjectId },
    date: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['pharmacy', 'doctor', 'lab','room','other'],
    },
    //it will store 
    status: {
      type: String,
      default: "f",
    },
    billed_date:Date,
  },
  {
    versionKey: false,
  }
);

const BillModel = model('Bill', BillSchema);

export default BillModel;
