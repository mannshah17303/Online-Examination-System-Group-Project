import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER_NAME,
    pass: process.env.EMAIL_APP_PASS,
  },
});
export const successfulMail = async (to, exam_details) => {
  let toStr = to.join();
  let startTime = getISTTime(exam_details.exam_start_datetime);

  const mailOptions = {
    from: process.env.EMAIL_USER_NAME,
    to: `${toStr}`,
    subject: "📢 Exam Invitation - Online Examination System",
    html: `
      <div style="max-width: 600px; margin: 20px auto; font-family: Arial, sans-serif; background-color: #eff6ff; border-radius: 8px; padding: 20px; box-shadow: 4px 4px 12px rgba(6,56,115,0.2);">
          <h2 style="color: #304673; text-align: center;">You're Invited to an Online Exam!</h2>
          <hr style="border: none; height: 1px; background-color: #304673;">
          <p style="font-size: 16px; color: #333;">Dear Participant,</p>
          <p style="font-size: 16px; color: #333;">
              You have been registered for the upcoming exam: <b style="color: #304673;">${exam_details.exam_name}</b>.
              The exam is scheduled to begin at <b>${startTime}</b>.
          </p>
          <p style="font-size: 16px; color: #333;">
              <b>Description:</b> ${exam_details.exam_description}
          </p>
          <hr style="border: none; height: 1px; background-color: #304673; margin-top: 20px;">
          <p style="font-size: 14px; text-align: center; color: #555;">If you have any questions, please contact us.</p>
      </div>`,
  };

  await transporter.sendMail(mailOptions);
}


export const removedMail = async (to, exam_details) => {
  let toStr = to.join();

  const mailOptions = {
    from: process.env.EMAIL_USER_NAME,
    to: `${toStr}`,
    subject: "🚨 Exam Removal Notification - Online Examination System",
    html: `
      <div style="max-width: 600px; margin: 20px auto; font-family: Arial, sans-serif; background-color: #eff6ff; border-radius: 8px; padding: 20px; box-shadow: 4px 4px 12px rgba(6,56,115,0.2);">
          <h2 style="color: #304673; text-align: center;">Exam Removal Notification</h2>
          <hr style="border: none; height: 1px; background-color: #304673;">
          <p style="font-size: 16px; color: #333;">Dear Participant,</p>
          <p style="font-size: 16px; color: #333;">
              You have been **removed** from the exam: <b style="color: #304673;">${exam_details.exam_name}</b>.
          </p>
          <p style="font-size: 16px; color: #333;">
              If you believe this was a mistake or have any questions, please contact the administration.
          </p>
          <hr style="border: none; height: 1px; background-color: #304673; margin-top: 20px;">
          <p style="font-size: 14px; text-align: center; color: #555;">Thank you.</p>
      </div>`,
  };

  await transporter.sendMail(mailOptions);
};


export const timeStatusMail = async (to, exam_details) => {
  let toStr = to.join();
  let startTime = getISTTime(exam_details.exam_start_datetime);

  const mailOptions = {
    from: process.env.EMAIL_USER_NAME,
    to: `${toStr}`,
    subject: "⏰ Exam Reschedule Notification - Online Examination System",
    html: `
      <div style="max-width: 600px; margin: 20px auto; font-family: Arial, sans-serif; background-color: #eff6ff; border-radius: 8px; padding: 20px; box-shadow: 4px 4px 12px rgba(6,56,115,0.2);">
          <h2 style="color: #304673; text-align: center;">Exam Reschedule Notification</h2>
          <hr style="border: none; height: 1px; background-color: #304673;">
          <p style="font-size: 16px; color: #333;">Dear Participant,</p>
          <p style="font-size: 16px; color: #333;">
              The exam <b style="color: #304673;">${exam_details.exam_name}</b> has been **rescheduled** to <b>${startTime}</b>.
          </p>
          <p style="font-size: 16px; color: #333;">
              Please update your schedule accordingly and reach out if you have any concerns.
          </p>
          <hr style="border: none; height: 1px; background-color: #304673; margin-top: 20px;">
          <p style="font-size: 14px; text-align: center; color: #555;">Thank you.</p>
      </div>`,
  };

  await transporter.sendMail(mailOptions);
};

function getISTTime(str) {
  let date = new Date(str);
  date.setHours(date.getHours() + 5);
  date.setMinutes(date.getMinutes() + 30);

  let currentTimestamp = date.toISOString();

  let timestampDate = currentTimestamp.slice(0, 10);
  let currentHour = currentTimestamp.slice(11, 13);
  let currentMinute = currentTimestamp.slice(14, 16);
  let currentSecond = currentTimestamp.slice(17, 19);

  let time = currentHour + ":" + currentMinute + ":" + currentSecond;
  let timestampInIST = timestampDate + " " + time;

  return timestampInIST;
}
