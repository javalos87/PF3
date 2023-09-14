import { messagesModel } from "../models/messages.js";
export default class Messages {
  constructor() {}

  getAll = async () => {
    const messages = await messagesModel.find();

    return messages.map((message) => message.toObject());
  };
  saveMessage = async (message) => {
    try {
      const result = await messagesModel.create(message);
      return result;
    } catch (error) {
      return error;
    }
  };
}
