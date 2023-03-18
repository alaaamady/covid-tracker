import Log, { LogModel } from '../model/Log';

const findByUserId = async (userId: string) => {
  return LogModel.find(
    { userId: userId },
    { createdAt: 1, temperature: 1, _id: 0 }
  )
    .lean()
    .exec();
};
const findAll = async () => {
  return LogModel.find().lean().exec();
};
const insert = async (log: Log) => {
  const now = new Date();
  log.createdAt = now;
  await LogModel.create(log);
  return LogModel.find({}, { createdAt: 1, temperature: 1, _id: 0 });
};

export default {
  findByUserId,
  findAll,
  insert,
};
