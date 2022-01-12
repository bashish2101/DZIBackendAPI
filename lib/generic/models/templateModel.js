/**
 * @author Ashish Bhalodia
 */

/*#################################            Load modules start            ########################################### */

const mongoose = require("mongoose");
const constants = require('../../constants');
var Schema = mongoose.Schema;

/*#################################            Load modules end            ########################################### */

var schema = new Schema({

    type: { type: String, enum: [constants.TEMPLATE_TYPES.EMAIL, constants.TEMPLATE_TYPES.NOTIFICATION] },
    mailName: {
        type: String,
        required: true,
        enum: [constants.EMAIL_TEMPLATES.CONTACT_US_QUERY
        
        ]
    },
    mailTitle: {
        type: String,
        required: function () {
            return (this.type == constants.TEMPLATE_TYPES.EMAIL) ? true : false
        }
    },
    mailBody: {
        type: String,
        required: function () {
            return (this.type == constants.TEMPLATE_TYPES.EMAIL) ? true : false
        }
    },
    mailSubject: {
        type: String,
        required: function () {
            return (this.type == constants.TEMPLATE_TYPES.EMAIL) ? true : false
        }
    },
    notificationMessage: {
        type: String,
        required: function () {
            return (this.type == constants.TEMPLATE_TYPES.NOTIFICATION) ? true : false
        }
    },
    createdAt: { type: Number },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: constants.DB_MODEL_REF.ADMINS
    },
    editedAt: { type: Number },
    editedBy: {
        type: mongoose.Types.ObjectId,
        ref: constants.DB_MODEL_REF.ADMINS
    },
    status: {
        type: String,
        enum: [constants.STATUS.ACTIVE, constants.STATUS.INACTIVE],
        default: constants.STATUS.ACTIVE
    },
}, {
    strict: true,
    versionKey: false,
    timestamps: true
})

module.exports = mongoose.model(constants.DB_MODEL_REF.EMAILTEMPLATES, schema);