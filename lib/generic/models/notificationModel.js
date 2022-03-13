/**
 * @author Ashish Bhalodia
 */

/*#################################            Load modules start            ########################################### */

const mongoose = require("mongoose");
const constants = require('../../constants');
let Schema = mongoose.Schema;

/*#################################            Load modules end            ########################################### */

let schema = new Schema({

    receiverId: { type: mongoose.Schema.Types.ObjectId },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Number },
    editedAt: { type: Number },
    categoryType: {
        type: String, enums: [constants.NOTIFICATION_CATEGORIES.NO_BID, constants.NOTIFICATION_CATEGORIES.NEW_BID]
    },
    refId: { type: mongoose.Schema.Types.ObjectId },
    message: {
        type: String
    },
    status: {
        type: String,
        enum: [constants.STATUS.ACTIVE, constants.STATUS.INACTIVE],
        default: constants.STATUS.ACTIVE
    }

}, {
    strict: true,
    versionKey: false,
    timestamps: true
})

module.exports = mongoose.model(constants.DB_MODEL_REF.NOTIFICATIONS, schema);