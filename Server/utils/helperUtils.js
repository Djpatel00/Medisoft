import helper from '../models/helper.js';

//--------------------------------Helper-------------------------------------

// Update Any helper
export const updateHelper = async (name, content,session) => {
  const doc = await helper.updateOne({ name }, { $set: { content } },{session});
  return doc;
};

//optimized the updation procees of the content
export const updateOnlyContentHelper = async (name, value,session) => {
  const doc = await helper.findOneAndUpdate(
    { name }, 
    { $push: { content: value } },
    { new: true,session } 
  );
  return true;
};

//optimized the deletion procees of the content
export const removeContentHelper = async (name, value,session) => {
  const doc = await helper.findOneAndUpdate(
    { name }, 
    { $pull: { content: value } },
    { new: true,session }
  );
  return false;
};

//generate Id
export const generateId = async (item,session) => {
  const number = await helper.findOneAndUpdate(
    { name: item },
    { $inc: { "content.0": 1 } },
    { new: true, session }
  );

  const base36 = number.content[0].toString(36).toUpperCase();
  const padded = base36.padStart(7, '0');
  // console.log(padded);
  return padded;
};

// Send document
export const getItem = async (name,session) => {
  const doc = await helper.findOne({ name }).session(session);
  return doc;
};

