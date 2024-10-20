import nodemailer from "nodemailer";

// TODO: Change config
const from = `DEV DEV DEV <dev@woodenwonders.ru>`
export async function sendMail(to, subject, text, html){
    let user = process.env.MAIL_SMTP_USER;
    let pass = process.env.MAIL_SMTP_PASS;
    if (+process.env.MAIL_USE_TEST_ACCOUNT) {
        let testAccount = await nodemailer.createTestAccount();
        // some god tricks
        [user, pass] = [testAccount.user, testAccount.pass]
    }

    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_SMTP_HOST,
        port: +process.env.MAIL_SMTP_PORT,
        secure: +process.env.MAIL_SMTP_PORT === 465, // true for 465, false for other ports
        auth: {
            user: user, // generated ethereal user
            pass: pass, // generated ethereal password
        },
    });

    let info = await transporter.sendMail({
        from,
        to, // list of receivers
        subject, // Subject line
        text, // plain text body
        html, // html body
    });
    console.log("Message sent: %s", info.messageId);

    if (+process.env.MAIL_USE_TEST_ACCOUNT) {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

}