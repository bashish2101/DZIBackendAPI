db.emailtemplates.insert({status: "ACTIVE", type: "EMAIL", mailName: "New contact-us query", mailTitle: "DZI", mailSubject: "DZI New Contact Query", mailBody: "Hello Admin,<div><br>You received a new query: <br>Name: ${name}, <br>Email: ${userEmailId}, <br>Contact no: ${contactNumber}, <br>Comment: ${comment}</div><div></div><div><br></div><div>Best Regards,</div><div>SAMArena Team</div>", createdAt: Date.now()})
db.emailtemplates.insert({status: "ACTIVE", type: "EMAIL", mailName: "User: Forgot password", mailTitle: "DZI", mailSubject: "DZI Password Recovery", mailBody: "<p>Hello ${name},</p><div>&nbsp;</div><div><p>We heard you lost your password. Please click this link and set your new password http://127.0.0.1:4402/DZI/v1/api/user/setNewPassword/${redisId}</p></div><div>&nbsp;</div><div><p>Best Regards,</p></div><div><p>DZI Team</p></div>", createdAt: Date.now()})
db.emailtemplates.insert({status: "ACTIVE", type: "EMAIL", mailName: "Admin: Forgot password", mailTitle: "DZI", mailSubject: "DZI Password Recovery", mailBody: "<p>Hello Admin,</p><p>We heard you lost your password. Please click this link and set your new password&nbsp;</p><p>http://127.0.0.1:3000/auth/set-password/${redisId}</p><p>Best Regards,</p><p>DZI Team</p>", createdAt: Date.now()})
db.emailtemplates.insert({status: "ACTIVE", type: "EMAIL", mailName: "Admin: Reset password", mailTitle: "DZI", mailSubject: "DZI Password Reset", mailBody: "Hello Admin,<div><br></div><div>Your password has been reset</div><div><br></div><div>Best Regards,</div><div>DZI Team</div>", createdAt: Date.now()})
db.thirdpartyservices.insert({status: "ACTIVE", type: "MAIL_GATEWAY", emailId: "smtpconfig123@gmail.com", password: "mine@123", createdAt: Date.now()})
db.admins.insert({profilePicture: "https://res.cloudinary.com/dutr8hwiw/image/upload/v1643437064/y9glw1n7i9aew491h8hu.png", isLoggedOut: true, name: "Admin", password: "$2a$10$gC0l.2q1375wJJMVPpZJcewNdDNCpfO4jQ1w0pLi7LveHX/rdDOWi", contactNumber: "+914522213891", userName: "admin", emailId: "info@dziearth.io", createdAt: 1642913699089, loginActivity: []})