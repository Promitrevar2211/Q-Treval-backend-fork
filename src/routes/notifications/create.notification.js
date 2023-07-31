import notificationModel from "../../models/notificationModel.js";
import MemberModel from "../../models/memberModel.js";
import UserModel from "../../models/userModel.js";
import { StatusCodes } from "http-status-codes";
import {
    responseGenerators,
  } from "../../lib/utils.js";

export const notificationSender = async (data) => {
       const presentNotification = await notificationModel.findOne({...data});
       if(presentNotification) return;
       else{
      const notification = await notificationModel.create({...data});
      const result = await Promise.all(data.receiver_id.map(async(id)=>{
        const member = await MemberModel.findOne({_id:id});
        if(member){
            await MemberModel.findOneAndUpdate({_id:id},{
                notifications: [...member.notifications,{id:notification._id,read: false}]
            },{new: true});
        }
        else{
            const user =await UserModel.findOne({_id:id});
            if(user){
                await UserModel.findOneAndUpdate({_id:id},{
                    notifications: [...user.notifications,{id:notification._id,read: false}]
                },{new: true});
            }
        }
      }));
    }
  };

  export const markRead = async(req,res) => {
        try{
            let result;
            const member = await MemberModel.findOne({_id: req.params.userId});
            if(member){
                console.log(member);
                const newNotifications = member.notifications.filter(item => item.id != req.params.notificationId);
                result = await MemberModel.findOneAndUpdate({
                    _id: req.params.userId,
                },{
                    notifications: [...newNotifications,{id: req.params.notificationId,read:true}]
                },
                {
                    new: true
                });
            }
            else{
                const user = await UserModel.findOne({_id: req.params.userId});
                if(user){
                    const newNotifications = member.notifications.filter(item => item.id != req.params.notificationId);
                    result = await MemberModel.findOneAndUpdate({
                        _id: req.params.userId,
                    },{
                        notifications: [...newNotifications,{id: req.params.notificationId,read:true}]
                    },
                    {
                        new: true
                    });
                }
            }
            return res
            .status(StatusCodes.OK)
            .send(
                responseGenerators(
                { result },
                StatusCodes.OK,
                "NOTIFICATION MARKED READ SUCCESSFULLY",
                0
                )
            );
        }
        catch(error){
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(
                    responseGenerators(
                    {},
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    "Internal Server Error",
                    1
                    )
                );
        }
  }