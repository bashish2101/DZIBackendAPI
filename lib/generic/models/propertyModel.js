/**
 * @author Ashish Bhalodia
 */

/*#################################            Load modules start            ########################################### */

const mongoose = require('mongoose')
const constants = require('../../constants')

/*#################################            Load modules end            ########################################### */

const Schema = new mongoose.Schema({
    properyName: { type: String },
    propertyIcon: { type: String },
    propertyType: { type: String, enum: [constants.PROPERTY_TYPE.RESIDENTIAL, constants.PROPERTY_TYPE.OFFICE, constants.PROPERTY_TYPE.HOTEL, constants.PROPERTY_TYPE.MUSEUM, constants.PROPERTY_TYPE.SHOP], default: constants.PROPERTY_TYPE.RESIDENTIAL },
    propertyLatitude: { type: String },
    propertyLongitude: { type: String },
    propertyAddress: { type: String },
    nftCode: { type: String },
    propertyStatus: { type: String, enum: [constants.PROPERTY_STATUS.AVAILABLE, constants.PROPERTY_STATUS.AUCTIONED, constants.PROPERTY_STATUS.KILLED, constants.PROPERTY_STATUS.MONUMENT, constants.PROPERTY_STATUS.HOT_PROPERTY], default: constants.PROPERTY_STATUS.AVAILABLE },
    basePrice: { type: Number },
    currentBid: { type: Number },
    currentBidBy: { type: mongoose.Types.ObjectId },
    status: { type: String, enum: [constants.STATUS.ACTIVE, constants.STATUS.INACTIVE], default: constants.STATUS.ACTIVE },
    createdAt: { type: Number },
    editedAt: { type: Number },
}, {
    versionKey: false,
    timeStamp: true,
    strict: true
})

module.exports = mongoose.model(constants.DB_MODEL_REF.PROPERTY, Schema);
