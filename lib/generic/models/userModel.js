/**
 * @author Ashish Bhalodia
 */

/*#################################            Load modules start            ########################################### */

const mongoose = require('mongoose')
const constants = require('../../constants')

/*#################################            Load modules end            ########################################### */

const Schema = new mongoose.Schema({
    name: { type: String },
    emailId: { type: String, lowercase: true },
    contactNumber: { type: String },
    userName: { type: String },
    password: { type: String },
    profilePicture: { type: String, default: 'https://res.cloudinary.com/dutr8hwiw/image/upload/v1643437064/y9glw1n7i9aew491h8hu.png' },
    status: { type: String, enum: [constants.STATUS.ACTIVE, constants.STATUS.INACTIVE], default: constants.STATUS.ACTIVE },
    registeredVia: { type: String, enum: [constants.USER_ACCOUNT_TYPE.NORMAL, constants.USER_ACCOUNT_TYPE.GOOGLE], default: constants.USER_ACCOUNT_TYPE.NORMAL },
    googleId: { type: String },
    cartProperties: [{
        propertyId: { type: mongoose.Types.ObjectId },
        addedAt: { type: Number }
    }],
    properties: [{
        propertyId: { type: mongoose.Types.ObjectId },
        boughtAt: { type: Number }
    }],
    favouriteProperties: [{ type: mongoose.Types.ObjectId }],
    soldProperties: [{ type: mongoose.Types.ObjectId }],
    loginActivity: [{
        date: { type: Number },
        device: { type: String },
        browser: { type: String },
        ipaddress: { type: String },
        country: { type: String },
        state: { type: String },
        isLoggedOut: { type: Boolean, default: false },
        loggedOutAt: { type: Number },
        status: { type: String, enum: [constants.STATUS.ACTIVE, constants.STATUS.INACTIVE], default: constants.STATUS.ACTIVE }
    }],
    createdAt: { type: Number },
    createdBy: { type: mongoose.Types.ObjectId },
    editedAt: { type: Number },
    editedBy: { type: mongoose.Types.ObjectId },
    isLoggedOut: { type: Boolean, default: false }
}, {
    versionKey: false,
    timeStamp: true,
    strict: true
})

module.exports = mongoose.model(constants.DB_MODEL_REF.USERS, Schema);
