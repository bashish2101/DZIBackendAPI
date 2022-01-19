/**
 * @author Kavya Patel
 */

/*#################################            Load modules start            ########################################### */

const dao = require('./adminDao')
const admConst = require('./adminConstants')
const mapper = require('./adminMapper')
const constants = require('../../constants')
const appUtils = require('../../appUtils')
const jwtHandler = require('../../middleware/jwtHandler')
var ObjectId = require('mongoose').Types.ObjectId
const mailHandler = require('../../middleware/email')
const redisServer = require('../../redis')
//const socketHandler = require('../../middleware/socketHandler')

/*#################################            Load modules end            ########################################### */


/**
 * Login
 * @param {Object} details admin login details
 */
 function login(details) {
    if (!details || (Object.keys(details).length == 0)) {

        return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails)
    } else {

        let query = {}
        if (details.emailId) {
            query.emailId = details.emailId.toLowerCase()

        } else {
            query.userName = details.userName
        }

        return dao.getAdminDetails(query).then(async (adminDetails) => {

            if (adminDetails) {

                let isValidPassword = await appUtils.verifyPassword(details, adminDetails)

                if (isValidPassword) {
                    let prevLoginActivities = adminDetails.loginActivity

                    prevLoginActivities.push({
                        device: details.device,
                        date: details.date,
                        browser: details.browser,
                        ipaddress: details.ipaddress,
                        country: details.country,
                        state: details.state,
                        status: constants.STATUS.ACTIVE
                    })
                    let updateObj = {
                        isLoggedOut: false,
                        loginActivity: prevLoginActivities
                    }

                    return dao.updateProfile(query, updateObj).then((adminUpdated) => {

                        if (adminUpdated) {

                            if (adminUpdated.twoFactorAuthentication) {

                                let filteredAdminResponseFields = mapper.filterAdminResponse(adminUpdated)
                                if (details.emailId) {

                                    return mapper.responseMappingWithData(admConst.CODE.Success, admConst.MESSAGE.EmailChangeVerificationSent, filteredAdminResponseFields)
                                } else {

                                    return mapper.responseMappingWithData(admConst.CODE.Success, admConst.MESSAGE.ContactChangeVerificationSent, filteredAdminResponseFields)
                                }

                            } else {

                                let adminObj = {
                                    _id: adminDetails._id,
                                    emailId: adminDetails.emailId.toLowerCase(),
                                    contactNumber: adminDetails.contactNumber
                                }
                                return jwtHandler.genAdminToken(adminObj).then((token) => {

                                    let filteredAdminResponseFields = mapper.filterAdminResponse(adminUpdated)
                                    filteredAdminResponseFields.token = token

                                    return mapper.responseMappingWithData(admConst.CODE.Success, admConst.MESSAGE.LoginSuccess, filteredAdminResponseFields)
                                }).catch((err) => {

                                    console.log({ err })
                                    return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
                                })

                            }

                        } else {

                            console.log("Failed to update admin login status")
                            return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
                        }
                    }).catch((err) => {

                        console.log({ err })
                        return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
                    })
                } else {

                    return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidPassword)

                }
            } else {

                return mapper.responseMapping(admConst.CODE.DataNotFound, admConst.MESSAGE.InvalidCredentials)

            }
        }).catch((err) => {

            console.log({ err })
            return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
        })
    }
}

/**
 * Logout
 * @param {String} id mongo id of admin
 * @param {String} activityId mongo id of login activity to be inactivated
 */
 function logout(id, activityId) {

    if (!id || !ObjectId.isValid(id) || !activityId || !ObjectId.isValid(activityId)) {

        return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails)
    } else {

        let query = {
            _id: id
        }

        return dao.getAdminDetails(query).then((adminDetails) => {

            if (adminDetails) {

                let activities = adminDetails.loginActivity
                let index = activities.findIndex(obj => obj._id == activityId)

                console.log({ index })
                if (index > -1) {

                    activities.splice(index, 1)

                    let updateObj = {
                        loginActivity: activities,
                        isLoggedOut: true
                    }

                    return dao.updateProfile(query, updateObj).then((adminUpdated) => {

                        if (adminUpdated) {

                            return mapper.responseMapping(admConst.CODE.Success, admConst.MESSAGE.LogoutSuccess)

                        } else {

                            console.log("Failed to update admin login status")
                            return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
                        }
                    }).catch((err) => {

                        console.log({ err })
                        return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
                    })

                } else {

                    return mapper.responseMapping(admConst.CODE.Success, admConst.MESSAGE.Success)
                }
            } else {

                return mapper.responseMapping(admConst.CODE.DataNotFound, admConst.MESSAGE.InvalidCredentials)
            }
        }).catch((err) => {

            console.log({ err })
            return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
        })
    }
}

module.exports = {

    login
    
}
