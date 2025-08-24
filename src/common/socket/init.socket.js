import { Server } from "socket.io";
import prisma from "../prisma/init.prisma";
import { colors } from "chalk";

const initSocket = (httpServer) => {
   const io = new Server(httpServer, {
      /* options */
   });

   io.on("connection", (socket) => {
      console.log(`id`, socket.id);

      socket.on("CREATE_ROOM", async (data) => {
         try {
            console.log("CREATE_ROOM", data);
            let { ownerId, targetUserIds, name } = data;

            targetUserIds = targetUserIds || [];
            const uniqueUserIds = Array.from(new Set([...targetUserIds, ownerId]));
            const countUserIds = uniqueUserIds.length;

            console.log("uniqueUserIds", uniqueUserIds);

            if (countUserIds < 2) {
               throw new Error("Bắt buộc phải tối thiểu 2 member");
            }

            await prisma.$transaction(async (tx) => {
               // tìm nhóm chát đã tồn tại hay chưa ----------------------------------------
               // lấy ra các nhóm chat mà TẤT CẢ thành viên trong nhóm đều có userId nằm trong uniqueUserIds
               let chatGroupDraw = await tx.chatGroups.findMany({
                  where: {
                     ChatGroupMembers: {
                        every: {
                           userId: {
                              in: uniqueUserIds,
                           },
                        },
                        some: {}, // đảm bảo phải có ít nhất 1 thành viên, để tránh every hợp lệ cho nhóm rỗng
                     },
                  },
                  include: {
                     ChatGroupMembers: {
                        select: {
                           userId: true,
                        },
                     },
                  },
               });


               let chatGroupsExist = chatGroupDraw.find((groupDraw) => {
                  const isLength = groupDraw.ChatGroupMembers.length === countUserIds;
                  const isSomeUserId = groupDraw.ChatGroupMembers.every((member) => {
                     return uniqueUserIds.includes(member.userId);
                  });
                  return isLength && isSomeUserId;
               });
               // ------------------------------------------------------------------------

               // Nếu chatGroup chưa tồn tại thì tạo mới
               if (!chatGroupsExist) {
                  // tạo ra group chat
                  chatGroupsExist = await tx.chatGroups.create({
                     data: {
                        ownerId: ownerId,
                        name: countUserIds <= 2 ? null : name,
                     },
                  });

                  const dataCreateGroupMembers = uniqueUserIds.map((userId) => {
                     return {
                        userId: userId,
                        chatGroupId: chatGroupsExist.id,
                     };
                  });

                  // tạo từng thành viên cho goup
                  await tx.chatGroupMembers.createMany({
                     data: dataCreateGroupMembers,
                  });
               }

               // luôn tồn tại chatGroupsExist
               socket.join(`chat${chatGroupsExist.id}`);

               console.log(`id:${ownerId} join room: `, `chat${chatGroupsExist.id}`);

               socket.emit("CREATE_ROOM", {
                  chatGroupId: chatGroupsExist.id,
               });
            });
         } catch (error) {
            console.log(`Lỗi CREATE_ROOM`, error);
         }
      });

      socket.on("JOIN_ROOM", (data) => {
         console.log("JOIN_ROOM", data);
         socket.join(`chat${data.chatGroupId}`);
         socket.emit("JOIN_ROOM", {
            chatGroupId: data.chatGroupId,
         });
      });

      socket.on("SEND_MESSAGE", async (data) => {
         console.log("SEND_MESSAGE", data);
         const { message, userIdSender, userIdRecipient, chatGroupId } = data;

         const createdAt = new Date().toISOString();
         io.to(`chat${chatGroupId}`).emit("SEND_MESSAGE", {
            messageText: message,
            userIdSender: userIdSender,
            chatGroupId: chatGroupId,
            createdAt: createdAt,
         });

         await prisma.chatMessages.create({
            data: {
               chatGroupId: chatGroupId,
               messageText: message,
               userIdSender: userIdSender,
               createdAt: createdAt,
            },
         });
      });

      socket.on("LEAVE_ROOM", (data) => {
         console.log("LEAVE_ROOM", data);

         socket.leave(`chat${data.chatGroupId}`);
      });
   });
};

export default initSocket;