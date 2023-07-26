import notificationModel from "../../models/notificationModel.js";
import MemberModel from "../../models/memberModel.js";
import UserModel from "../../models/userModel.js";
export const notificationSender = async (data) => {
    try {
      const notification = await notificationModel.create({...data});
      const result = await Promise.all(data.receiver_id.map(async(id)=>{
        const member = await MemberModel.findOne({_id:id});
        if(member){
            await MemberModel.findOneAndUpdate({_id:id},{
                notifications: [...member.notifications,notification._id]
            },{new: true});
        }
        else{
            const user =await UserModel.findOne({_id:id});
            if(user){
                await UserModel.findOneAndUpdate({_id:id},{
                    notifications: [...user.notifications,notification._id]
                },{new: true});
            }
        }
      }));
      return notification;
    } catch (error) {
      // set logs Error function
      return error;
    }
  };