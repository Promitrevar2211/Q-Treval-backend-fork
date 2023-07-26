import notificationModel from "../../models/notificationModel";

export const notificationSender = async (data) => {
    try {
      const notification = await notificationModel.create({...data});
      return notification;
    } catch (error) {
      // set logs Error function
      return error;
    }
  };