const Queue = require("bull");
const nodemailer = require("nodemailer");
const User = require("./models/User");
const Email = require("./models/Email");

const emailQueue = new Queue("email-queue", process.env.REDIS_URL);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

emailQueue.process("bulk-email", async (job) => {
  const { subject, body } = job.data;
  const users = await User.find({ subscribed: true });
  const sentTo = [];

  for (const user of users) {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: subject,
      text: body,
    });
    sentTo.push(user.email);
  }

  await Email.create({ subject, body, sentTo, createdAt: new Date() });
});

emailQueue.process("single-email", async (job) => {
  const { to, subject, body } = job.data;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: to,
    subject: subject,
    text: body,
  });

  await Email.create({ subject, body, sentTo: [to], createdAt: new Date() });
});

console.log("Worker started processing jobs");
