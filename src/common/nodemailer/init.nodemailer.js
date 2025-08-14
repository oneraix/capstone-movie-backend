import nodemailer from "nodemailer";

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
   host: "smtp.gmail.com",
   port: 587,
   secure: false, // true for 465, false for other ports
   auth: {
      user: "vominhhieu1087@gmail.com",
      pass: "cvzwyhmeypwuzynz",
   },
});

// Wrap in an async IIFE so we can use await.
const sendMail = async (to) =>{
   const info = await transporter.sendMail({
      from: '"Maddison Foo Koch" vominhhieu1087@gmail.com',
      to: to,
      subject: "Cảnh báo đăng nhập",
      text: "Thông báo đăng nhập: bạn vừa đăng nhập thành công", // plain‑text body
      html: `<div>
         <p style="color: red">Cảnh báo đăng nhập</p> 
         <p>tài khoản của bạn vừa mới thao tác <b>đăng nhập</b></p> 
      </div>`, // HTML body
   });

   console.log("Message sent:", info.messageId);
}

export default sendMail
