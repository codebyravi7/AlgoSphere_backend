import nodeCron from "node-cron";
import nodemailer from "nodemailer";

export const scheduleEmailNotification = (req, res) => {
  try {
    const { contestTitle, contestStartTime, link } = req.body;
    const email = req?.user?.email;
    
    const contestDate = new Date(contestStartTime);
    const notificationTime = new Date(contestDate.getTime() - 10 * 60 * 1000); // 10 minutes before start time

    if (notificationTime > new Date()) {
      const cronExpression = `${notificationTime.getMinutes()} ${notificationTime.getHours()} ${notificationTime.getDate()} ${
        notificationTime.getMonth() + 1
      } *`;

      // Schedule the email using node-cron
      nodeCron.schedule(cronExpression, () => {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          secure: true,
          port: 465,
          auth: {
            user: "thatnewhomie@gmail.com",
            pass: "vwlqpeuqdcjhzifv", //tobegenerated
          },
        });

        const mailOptions = {
          from: "thatnewhomie@gmail.com",
          to: email,
          subject: `⏰ Reminder: Contest "${contestTitle}" starts soon!`,
          html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
      <h2 style="color: #4CAF50;">🚀 Get Ready for the Contest!</h2>
      <p style="font-size: 16px; margin: 10px 0;">
        The contest <strong>"${contestTitle}"</strong> will start in <strong>10 minutes</strong>. 🎉
      </p>
      <p style="font-size: 16px; margin: 10px 0;">
        Make sure you're all set to showcase your skills and have fun!
      </p>
      <a href="${link}" target="_blank" 
         style="display: inline-block; margin-top: 15px; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">
        🌐 Go to Contest
      </a>
      <footer style="margin-top: 20px; font-size: 14px; color: #555;">
        Good luck! 💪<br>
        - Your Contest Team
      </footer>
    </div>
  `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });
      });

      res.status(200).json({
        success: true,
        message: "Email notification scheduled successfully.",
      });
    } else {
      console.log("contest has started!!!");
      res
        .status(201)
        .json({ message: "Contest has already started or invalid time." });
    }
  } catch (error) {
    console.error("Error scheduling email notification:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
