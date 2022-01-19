/**
 * @author Ashish Bhalodia
 */

/*#################################            Load modules start            ########################################### */

const mongoose = require('mongoose')
const constants = require('../../constants')
const appUtil = require('../../appUtils')

/*#################################            Load modules end            ########################################### */

const Schema = mongoose.Schema({
    name: { type: String },
    emailId: { type: String, lowercase: true },
    contactNumber: { type: String },
    password: { type: String, required: true },
    profilePicture: { type: String, default: 'https://res.cloudinary.com/dizkwji5k/image/upload/v1561362114/nbgeugd7hviq8kgjuacr.jpg' },
    loginActivity: [{
        date: { type: Number },
        device: { type: String },
        browser: { type: String },
        ipaddress: { type: String },
        country: { type: String },
        state: { type: String },
        status: { type: String, enum: [constants.STATUS.ACTIVE, constants.STATUS.INACTIVE] }
    }],
    defaultPassword: { type: String },
    createdAt: { type: Number },
    editedAt: { type: Number },
    isLoggedOut: { type: Boolean, default: true },
}, {
    versionKey: false,
    timeStamp: true,
    strict: true
})

Admin = module.exports = mongoose.model(constants.DB_MODEL_REF.ADMINS, Schema);

createAdmin()

function createAdmin() {
    Admin.countDocuments(async (err, count) => {
        if (err) {

            console.log('error while creating admin');
        } else if (count == 0) {

            let adminObj = {
                "name": process.env.adminFullName,
                "password": process.env.adminPassword,
                "contactNumber": process.env.adminContactNumber,
                "userName": process.env.adminUserName,
                "emailId": process.env.adminEmailId,
                "profilePicture": process.env.adminProfilePicture,
                "createdAt": new Date().getTime(),
            } 

            console.log("adminObj", adminObj)

            let convertedPass = await appUtil.convertPass(adminObj.password);
            adminObj.password = convertedPass

            let adminDetails = new Admin(adminObj)
            adminDetails.save((err, result) => {
                if (err) {
                    console.log({ err })
                } else {
                    console.log('admin created successfully.')
                }
            })
        }
    })
}