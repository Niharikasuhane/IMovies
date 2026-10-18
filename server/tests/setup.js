process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret';
process.env.SEAT_LOCK_MINUTES = '5';
process.env.CANCEL_BEFORE_HOURS = '2';
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongo;
exports.connect = async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
};
exports.clear = async () => {
  for (const key of Object.keys(mongoose.connection.collections)) await mongoose.connection.collections[key].deleteMany({});
};
exports.close = async () => {
  await mongoose.disconnect();
  await mongo.stop();
};
