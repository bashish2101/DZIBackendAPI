const nodemailer = require('nodemailer');
// var client = new twilio(process.env.accountSid, process.env.authToken);

function sendEmail(mailOptions, mailConfigs) {
    console.log({mailConfigs})
    let EMAIL_CONFIG = {
        pool: true,
        host: process.env.smtp_host,
        port: process.env.smtp_port,
        secure: true,
        auth: {
            // type:'PLAIN',
            user: mailConfigs.emailId, // generated ethereal user
            pass: mailConfigs.password // generated ethereal password
        }
    }
    let transporter = nodemailer.createTransport(EMAIL_CONFIG)

    return transporter.sendMail(mailOptions);
}

/**
 * [createMailOption preparing a mail option model]
 * @param  {[type]} subject [subject of the mail]
 * @param  {[type]} html    [html content]
 * @param  {[type]} toMail  [reciever of the mail]
 * @return {[type]}         [object] 
 */
function createMailOption(subject, html, toMail, sender) {
    let mailOptions = {
        from: sender, // sender address
        to: toMail, // list of receivers
        subject: subject, // Subject line
        text: 'DZI', // plain text body
        html: html // html body
    };
    return mailOptions;
}

function value(cn) {
    return cn.replace(/\${(\w+)}/, '$1')
}

async function sending_logic(mailBodyDetails, templateDetails, mailConfigs) {

    if (templateDetails && (Object.keys(templateDetails).length > 0)) {
        let mailBody = templateDetails.mailBody;

        let idx = mailBody.match(new RegExp(/\${\w+}/g));
        if (idx && idx.length > 0) {
            idx.map((val, id) => {
                mailBody = mailBody.replace(/\${(\w+)}/, mailBodyDetails[value(idx[id])])
                return val;
            })
        };
        let returnedValue = await createMailOption(templateDetails.mailSubject, mailBody, mailBodyDetails.emailId, mailConfigs.emailId);
        return sendEmail(returnedValue, mailConfigs)
    } else {
        return true;
    }
}

function SEND_MAIL(mailBodyDetails, templateDetails, mailConfigs) {

    return sending_logic(mailBodyDetails, templateDetails, mailConfigs)
}

function SEND_CONTACT_US_QUERY_MAIL(mailBodyDetails, templateDetails, mailConfigs) {
    console.log({mailBodyDetails, templateDetails, mailConfigs})
    return sending_contact_us_query_logic(mailBodyDetails, templateDetails, mailConfigs)
}

function createMailOptionContactUsQuery(subject, html, toMail, fromMail) {

    let mailOptions = {
        from: fromMail, // sender address
        to: toMail, // list of receivers
        subject: subject, // Subject line
        text: 'DZI', // plain text body
        html: html, // html body
        replyTo: fromMail
    };
    return mailOptions;
}

async function sending_contact_us_query_logic(mailBodyDetails, templateDetails, mailConfigs) {

    if (templateDetails && (Object.keys(templateDetails).length > 0)) {
        let mailBody = templateDetails.mailBody;

        let idx = mailBody.match(new RegExp(/\${\w+}/g));
        if (idx && idx.length > 0) {
            idx.map((val, id) => {
                mailBody = mailBody.replace(/\${(\w+)}/, mailBodyDetails[value(idx[id])])
                return val;
            })
        };
        let returnedValue = await createMailOptionContactUsQuery(templateDetails.mailSubject, mailBody, mailBodyDetails.adminEmailId, mailBodyDetails.userEmailId);
        return sendEmail(returnedValue, mailConfigs)
    } else {
        return true;
    }

}

function convertNotificationMessage(nameObj, body) {

    let idx = body.match(new RegExp(/\${\w+}/g));
    if (idx && idx.length > 0) {
        idx.map((val, id) => {
            body = body.replace(/\${(\w+)}/, nameObj[value(idx[id])])
            return val;
        })
    };
    return body

}





function SEND_CONTACT_US_QUERY_MAIL1(mailBodyDetails, templateDetails, mailConfigs) {
    console.log({mailBodyDetails, templateDetails, mailConfigs})
    return sending_contact_us_query_logic1(mailBodyDetails, templateDetails, mailConfigs)
}

function createMailOptionContactUsQuery1(subject, html, toMail, fromMail) {

    let mailOptions = {
        from: fromMail, // sender address
        to: toMail, // list of receivers
        subject: "New Contact Query", // Subject line
        text: 'SAMArena', // plain text body
        html: html, // html body
        replyTo: fromMail
    };
    return mailOptions;
}

async function sending_contact_us_query_logic1(mailBodyDetails, templateDetails, mailConfigs) {

    if (templateDetails && (Object.keys(templateDetails).length > 0)) {
        let mailBody = "Hello Admin,<div><br>You received a new query: <br>Name: ${name}, <br>Email: ${userEmailId}, <br>Contact no: ${contactNumber}, <br>Comment: ${comment}</div><div></div><div><br></div><div>Best Regards,</div><div>SAMArena Team</div>"

        let idx = mailBody.match(new RegExp(/\${\w+}/g));
        if (idx && idx.length > 0) {
            idx.map((val, id) => {
                mailBody = mailBody.replace(/\${(\w+)}/, mailBodyDetails[value(idx[id])])
                return val;
            })
        };
        let returnedValue = await createMailOptionContactUsQuery1(templateDetails.mailSubject, mailBody, mailBodyDetails.adminEmailId, mailBodyDetails.userEmailId);
        return sendEmail(returnedValue, mailConfigs)
    } else {
        return true;
    }

}

module.exports = {

    SEND_MAIL,

    convertNotificationMessage,

    SEND_CONTACT_US_QUERY_MAIL,

    SEND_CONTACT_US_QUERY_MAIL1
}