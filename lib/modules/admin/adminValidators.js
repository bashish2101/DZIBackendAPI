/**
 * @author Kavya Patel
 */

/*#################################            Load modules start            ########################################### */

const admConst = require('./adminConstants')
var ObjectId = require('mongoose').Types.ObjectId;
const jwtHandler = require('../../middleware/jwtHandler');
const mapper = require('./adminMapper');
const appUtils = require('../../appUtils');
const constants = require('../../constants');

/*#################################            Load modules end            ########################################### */

/**
 * Validating login request
 */
function checkLoginRequest(req, res, next) {

    let error = []
    let { emailId, userName, password, device, browser, ipaddress, date, country, state } = req.body

    if ((!emailId && !userName) || !password || !device || !browser || !ipaddress || !country || !state || !date) {

        error.push({ responseCode: admConst.CODE.BadRequest, responseMessage: admConst.MESSAGE.InvalidDetails })
    }

    if (error.length > 0) {

        res.json(mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails))
    } else {

        next()
    }
}

/**
 * Validate JWT token
 */
function checkToken(req, res, next) {

    let token = req.headers['authorization']
    let { id } = req.params

    if (!token || !id || (!ObjectId.isValid(id))) {

        res.send(mapper.responseMapping(admConst.CODE.FRBDN, admConst.MESSAGE.TOKEN_NOT_PROVIDED))

        // return new exceptions.unauthorizeAccess(busConst.MESSAGE.TOKEN_NOT_PROVIDED)
    } else {

        return jwtHandler.verifyAdminToken(token).then((result) => {

            if (result && result._id == id) {
                req.tokenPayload = result;
                next()
            } else {

                res.send(mapper.responseMapping(admConst.CODE.FRBDN, admConst.MESSAGE.TOKEN_NOT_PROVIDED))
            }
        })
    }
}

/**
 * Validating forgot password request
 */
function checkForgotPasswordRequest(req, res, next) {

    let error = []
    let { emailId } = req.body

    if (!emailId || (!appUtils.isValidEmail(emailId))) {

        error.push({ responseCode: admConst.CODE.BadRequest, responseMessage: admConst.MESSAGE.InvalidDetails })
    }

    if (error.length > 0) {

        res.json(mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails))
    } else {

        next()
    }

}

/**
 * Validating set new password by recovery link
 */
function checkSetNewPasswordRequest(req, res, next) {

    let error = []
    let { redisId } = req.params
    let { password } = req.body

    if (!redisId || !password) {

        error.push({ responseCode: admConst.CODE.BadRequest, responseMessage: admConst.MESSAGE.InvalidDetails })
    }
    if (error.length > 0) {

        res.json(mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails))
    } else {

        next()
    }
}

/**
 * Validating reset password request
 */
function checkResetPasswordRequest(req, res, next) {

    let error = []
    let { id } = req.params
    let { oldPassword, newPassword } = req.body

    if (!id || !ObjectId.isValid(id) || !oldPassword || !newPassword) {

        error.push({ responseCode: admConst.CODE.BadRequest, responseMessage: admConst.MESSAGE.InvalidDetails })
    }
    if (error.length > 0) {

        res.json(mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails))
    } else {

        next()
    }
}


module.exports = {

    checkLoginRequest,

    checkToken,

    checkForgotPasswordRequest,

    checkSetNewPasswordRequest,

    checkResetPasswordRequest,
}
