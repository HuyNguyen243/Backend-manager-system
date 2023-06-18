const {
    STMP_EMAIL_HOST,
    STMP_EMAIL_PORT,
    STMP_EMAIL_USER,
    STMP_EMAIL_PASSWORD,
} = require('./../config/constain.config');
const nodemailer = require('nodemailer');
// const { APP_WEBSITE_URL } = require("./../config/app.config");
const transporter = nodemailer.createTransport({
    host: STMP_EMAIL_HOST,
    port: STMP_EMAIL_PORT,
    secure: false,
    auth: {
        user: STMP_EMAIL_USER,
        pass: STMP_EMAIL_PASSWORD,
    },
});
transporter.verify(function (error) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});
const templater_mail = (data) => {
    let link = `${data.host}/reset-password?id=${data.id}&token=${data.token}`;
    const now = new Date();
    const year = now.getFullYear();
    return `<!DOCTYPE html>
    <html lang="en-US">
        <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>Reset Password Email</title>
            <meta name="description" content="Reset Password Email" />
        </head>
    
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8" leftmargin="0">
            <!--100% body table-->
            <table cellspacing="0" border="0" cellpadding="0" width="100%"  style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;background-image: url('https://api.1touchteam.com/images/bg.jpeg'); background-position: center; background-repeat: no-repeat;background-size: cover; ">
                <tr>
                    <td>
                        <table style="background-color: #f2f3f8; max-width: 670px; margin: 0 auto" width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="height: 80px">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align: center">
                                    <a href="https://www.1touchteam.com/" title="Reset Pasword" target="_blank">
                                        <img width="300" src="https://api.1touchteam.com/static/logo_email.png" title="One Touch Team" alt="1Touch Systems" />
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td style="height: 20px">&nbsp;</td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width: 670px; background: #fff; border-radius: 3px; text-align: center; -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06); -moz-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06); box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06)">
                                        <tr>
                                            <td style="heightemplater_mailt: 40px">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 0 35px">
                                                <h1 style="color: #1e1e2d; font-weight: 500; margin: 0; font-size: 32px; font-family: 'Rubik', sans-serif">Yêu cầu đặt lại mật khẩu</h1>
                                                <span style="display: inline-block; vertical-align: middle; margin: 29px 0 26px; border-bottom: 1px solid #cecece; width: 100px"></span>
                                                <p style="color: #455056; font-size: 15px; line-height: 24px; margin: 0 ;text-align: center;">
                                                    <span>Chúng tôi nhận được thông báo yêu cầu tạo mật khẩu cho tài khoản có tên:<strong style="color: #0061f4"> ${data?.username}.</strong></span>
                                                    <span>Chúng tôi cung cấp cho bạn một liên kết duy nhất để đặt lại mật khẩu cho tài khoản của bạn. Để đặt lại mật khẩu của bạn, hãy nhấp vào liên kết sau và làm theo hướng dẫn.</span>
                                                </p>
                                                <a href="${link}" style="cursor: pointer; background: #0061f4; text-decoration: none !important; font-weight: 500; margin-top: 35px; color: #fff; text-transform: uppercase; font-size: 14px; padding: 10px 24px; display: inline-block; border-radius: 50px">Đặt lại mật khẩu</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="height: 40px">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
    
                            <tr>
                                <td style="height: 20px">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align: center">
                                    <p style="font-size: 14px; color: rgba(69, 80, 86, 0.7411764705882353); line-height: 18px; margin: 0 0 0">Copyright ${year} &copy; <strong>1TouchTeam</strong>. Author by Dev Da Nang</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="height: 80px">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <!--/100% body table-->
        </body>
    </html>
`;
};
const sendMail = async function sendEmail(to, data) {
    await transporter.sendMail({
        from: { name: '1TouchTeam System', address: 'noreply@1touchteam.com' },
        to: to,
        subject: '[Quan trọng] - Đặt lại mật khẩu',
        html: templater_mail(data),
    });
};

module.exports = sendMail;
