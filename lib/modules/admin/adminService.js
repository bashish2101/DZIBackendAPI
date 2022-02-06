/**
 * @author Ashish Bhalodia
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

/**
 * Get profile
 * @param {string} id mongo id of admin to fetch profile details
 */
function getProfile(id) {

    if (!id || !ObjectId.isValid(id)) {

        return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails)

    } else {

        let query = {
            _id: id
        }

        return dao.getAdminDetails(query).then((adminDetails) => {

            if (adminDetails) {

                let filteredAdminResponseFields = mapper.filterAdminResponse(adminDetails)

                return mapper.responseMappingWithData(admConst.CODE.Success, admConst.MESSAGE.Success, filteredAdminResponseFields)
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
 * Update profile
 * @param {string} id mongo id of admin
 * @param {object} details admin profile updating details
 */
function updateProfile(id, details) {

    if (!id || !ObjectId.isValid(id) || !details || Object.keys(details).length == 0) {

        return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails)

    } else {

        let query = {
            _id: id
        }

        return dao.getAdminDetails(query).then((adminDetails) => {

            if (adminDetails) {

                if (details.emailId) {
                    delete details.emailId
                }
                if (details.userName) {
                    delete details.userName
                }

                details.editedAt = new Date().getTime()

                return dao.updateProfile(query, details).then(async (adminUpdated) => {

                    if (adminUpdated) {

                        let filteredAdminResponseFields = mapper.filterAdminResponse(adminUpdated)

                        return mapper.responseMappingWithData(admConst.CODE.Success, admConst.MESSAGE.ProfileUpdated, filteredAdminResponseFields)

                    } else {

                        console.log("Failed to update profile")
                        return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
                    }

                }).catch((err) => {

                    console.log({ err })
                    return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
                })

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
 * Recover password by email
 * @param {string} emailId email id of admin for recover password
 */
function forgotPassword(emailId) {

    if (!emailId || (!appUtils.isValidEmail(emailId))) {

        return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails)
    } else {

        let query = {
            emailId: emailId.toLowerCase()
        }
        return dao.getAdminDetails(query).then(async (isExist) => {

            if (isExist) {

                let obj = {
                    type: 'FORGOT',
                    userId: isExist._id,
                    emailId: isExist.emailId.toLowerCase(),
                    isActive: true,
                    expiryTime: (new Date().getTime() + (30 * 60 * 1000))
                }

                let redisId = await redisServer.setRedisDetails(obj);

                console.log({ redisId })

                let thirdPartyServiceQuery = {
                    type: constants.THIRD_PARTY_SERVICES.MAIL_GATEWAY,
                    status: constants.STATUS.ACTIVE
                }

                let serviceDetails = await dao.getServiceDetails(thirdPartyServiceQuery)
                if (serviceDetails) {

                    let mailQuery = {
                        type: constants.TEMPLATE_TYPES.EMAIL,
                        mailName: constants.EMAIL_TEMPLATES.ADMIN_FORGOT_PASSWORD,
                        status: constants.STATUS.ACTIVE
                    }
                    let templateDetails = await dao.getTemplateDetails(mailQuery);

                    if (templateDetails) {
                        let adminObj = {
                            fullName: isExist.name,
                            emailId: isExist.emailId.toLowerCase(),
                            redisId: redisId
                        }
                        let mailSent = mailHandler.SEND_MAIL(adminObj, templateDetails, serviceDetails)
                        console.log({ mailSent })
                    }
                }

                return mapper.responseMapping(admConst.CODE.Success, admConst.MESSAGE.ResetPasswordMailSent)

            } else {

                return mapper.responseMapping(admConst.CODE.DataNotFound, admConst.MESSAGE.InvalidCredentials)
            }
        }).catch((e) => {

            console.log({ e })
            return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
        })

    }
}

/**
 * Set new password
 * @param {string} redisId redis id for recovering password
 * @param {string} password new password to set
 */
async function setNewPassword(redisId, password) {

    if (!redisId || !password) {

        return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails)

    } else {

        let isUserExists = await redisServer.getRedisDetails(redisId)

        if (isUserExists) {

            let newPass = await appUtils.convertPass(password);

            let query = {
                _id: isUserExists.userId
            }
            let updateObj = {
                password: newPass
            }
            return dao.updateProfile(query, updateObj).then(async (updateDone) => {

                if (updateDone) {

                    let thirdPartyServiceQuery = {
                        type: constants.THIRD_PARTY_SERVICES.MAIL_GATEWAY,
                        status: constants.STATUS.ACTIVE
                    }

                    let serviceDetails = await dao.getServiceDetails(thirdPartyServiceQuery)
                    if (serviceDetails) {

                        let query = {
                            type: constants.TEMPLATE_TYPES.EMAIL,
                            mailName: constants.EMAIL_TEMPLATES.ADMIN_RESET_PASSWORD,
                            status: constants.STATUS.ACTIVE
                        }
                        let templateDetails = await dao.getTemplateDetails(query)

                        let mailBodyDetails = updateDone

                        let mailConfig = mailHandler.SEND_MAIL(mailBodyDetails, templateDetails, serviceDetails)
                    }

                    return mapper.responseMapping(admConst.CODE.Success, admConst.MESSAGE.PasswordUpdateSuccess)

                } else {
                    console.log("Failed to reset password");
                    return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
                }

            }).catch((e) => {

                console.log({ e })
                return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
            })

        } else {

            return mapper.responseMapping(admConst.CODE.ReqTimeOut, admConst.MESSAGE.ResetPasswordLinkExpired)
        }
    }
}

/**
 * Reset password
 * @param {string} id mongo id of admin
 * @param {string} oldPassword old password to verify
 * @param {string} newPassword new password to reset
 */
function resetPassword(id, oldPassword, newPassword) {

    if (!id || !ObjectId.isValid(id) || !oldPassword || !newPassword) {

        return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails)

    } else {

        let query = {
            _id: id
        }

        return dao.getAdminDetails(query).then((adminDetails) => {

            if (adminDetails) {

                let passObj = {
                    password: oldPassword
                }
                return appUtils.verifyPassword(passObj, adminDetails).then(async (isPasswordMatch) => {

                    if (isPasswordMatch) {

                        let password = newPassword;
                        let newPass = await appUtils.convertPass(password);

                        let updateObj = {
                            password: newPass
                        }
                        return dao.updateProfile(query, updateObj).then(async (updateDone) => {

                            if (updateDone) {

                                let thirdPartyServiceQuery = {
                                    type: constants.THIRD_PARTY_SERVICES.MAIL_GATEWAY,
                                    status: constants.STATUS.ACTIVE
                                }

                                let serviceDetails = await dao.getServiceDetails(thirdPartyServiceQuery)
                                if (serviceDetails) {
                                    let query = {
                                        type: constants.TEMPLATE_TYPES.EMAIL,
                                        mailName: constants.EMAIL_TEMPLATES.ADMIN_RESET_PASSWORD,
                                        status: constants.STATUS.ACTIVE
                                    }
                                    let templateDetails = await dao.getTemplateDetails(query);

                                    let mailBodyDetails = updateDone

                                    let mailConfig = mailHandler.SEND_MAIL(mailBodyDetails, templateDetails, serviceDetails)
                                }

                                return mapper.responseMapping(admConst.CODE.Success, admConst.MESSAGE.PasswordUpdateSuccess)

                            } else {
                                console.log("Failed to reset password");
                                return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
                            }
                        }).catch((e) => {

                            console.log({ e });
                            return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
                        })
                    } else {

                        return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.OldPasswordNotMatch)
                    }
                }).catch((e) => {

                    console.log({ e });
                    return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
                })
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
 * Get all users count
 * @param {String} id mongo id of admin
 */
function countForDashboard(id) {

    if (!id) {

        return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails)
    } else {

        let adminQuery = {
            _id: id
        }

        return dao.getAdminDetails(adminQuery).then((adminDetails) => {

            if (!adminDetails) {

                return mapper.responseMapping(admConst.CODE.DataNotFound, admConst.MESSAGE.InvalidCredentials)
            } else {

                let userQuery = {
                    status: constants.STATUS.ACTIVE
                }

                return Promise.all([dao.countUsers(userQuery)]).then((result) => {

                    let details = {
                        totalUsers: result[0]
                    }

                    return mapper.responseMappingWithData(admConst.CODE.Success, admConst.MESSAGE.Success, details)
                })
            }
        })
    }
}

/**
 * Get all users
 * @param {String} id mongo id of admin
 * @param {Object} queryParams query params for sorting, paginations
 * @param {Object} filters filters on country, registered dates to be applied
 */
function getAllUsers(id, queryParams, filters) {

    if (!id || !ObjectId.isValid(id)) {

        return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails)
    } else {

        let adminQuery = {
            _id: id
        }

        return dao.getAdminDetails(adminQuery).then(async (adminDetails) => {

            if (adminDetails) {

                let userQuery = {}

                if (queryParams.search) {

                    userQuery['$or'] = [
                        { 'emailId': { '$regex': queryParams.search, '$options': 'i' } },
                        { 'name': { '$regex': queryParams.search, '$options': 'i' } },
                        { 'userName': { '$regex': queryParams.search, '$options': 'i' } },
                        { 'contactNumber': { '$regex': queryParams.search, '$options': 'i' } },
                        { 'registeredVia': { '$regex': queryParams.search, '$options': 'i' } },
                    ]
                }
                if (filters.minDate) {

                    userQuery['createdAt'] = {
                        $gte: filters.minDate
                    }
                }
                if (filters.maxDate) {

                    userQuery['createdAt'] = {
                        ...userQuery['createdAt'],
                        $lte: filters.maxDate
                    }
                }


                let totalUsers = await dao.getUserCounts(userQuery)

                let sortQuery = {}
                if (queryParams.column) {

                    sortQuery[queryParams.column] = ((queryParams.dir == "asc") ? 1 : -1)
                } else {

                    sortQuery['createdAt'] = -1
                }

                let aggregateQuery = [
                    {
                        $match: userQuery
                    },
                    {
                        $sort: sortQuery
                    },
                    {
                        $skip: parseInt(queryParams.skip) * parseInt(queryParams.limit)
                    },
                    {
                        $limit: parseInt(queryParams.limit)
                    }, {
                        $project: {
                            '_id': 1,
                            'profilePicture': 1,
                            'status': 1,
                            'name': 1,
                            'emailId': 1,
                            'userName': 1,
                            'contactNumber': 1,
                            'createdAt': 1,
                            'loginActivity': 1,
                            'registeredVia': 1
                        }
                    }
                ]

                return dao.getAllUsers(aggregateQuery).then((users) => {

                    let respObj = {
                        "recordsTotal": totalUsers,
                        "recordsFiltered": users.length,
                        "records": users
                    }

                    return mapper.responseMappingWithData(admConst.CODE.Success, admConst.MESSAGE.Success, respObj)
                }).catch((err) => {

                    console.log({ err })
                    return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
                })
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
 * Delete or Resurrect user
 * @param {String} id mongo id of admin
 * @param {String} userId mongo id of user to be deleted or resurrected
 */
function deleteUser(id, userId) {

    if (!id || !ObjectId.isValid(id) || !userId || !ObjectId.isValid(userId)) {

        return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails)
    } else {

        let adminQuery = {
            _id: id
        }
        let userQuery = {
            _id: userId
        }

        return Promise.all([dao.getAdminDetails(adminQuery), dao.getUserDetails(userQuery, {})]).then((results) => {

            if (!results[0]) {

                return mapper.responseMapping(admConst.CODE.DataNotFound, admConst.MESSAGE.InvalidCredentials)

            } else if (!results[1]) {

                return mapper.responseMapping(admConst.CODE.DataNotFound, admConst.MESSAGE.InvalidCredentials)

            } else {

                let userDetails = results[1]

                if (userDetails.status == constants.STATUS.ACTIVE) {

                    userDetails.status = constants.STATUS.INACTIVE
                } else {

                    userDetails.status = constants.STATUS.ACTIVE
                }
                userDetails.editedAt = new Date().getTime()
                userDetails.editedBy = id

                return dao.updateUser(userQuery, userDetails).then((userUpdated) => {

                    if (userUpdated) {

                        let filteredUserDetails = mapper.filteredUserFields(userUpdated)
                        if (filteredUserDetails.status == constants.STATUS.ACTIVE) {

                            return mapper.responseMappingWithData(admConst.CODE.Success, admConst.MESSAGE.UserActivated, filteredUserDetails)
                        } else {

                            return mapper.responseMappingWithData(admConst.CODE.Success, admConst.MESSAGE.UserDeactivated, filteredUserDetails)
                        }
                    } else {

                        console.log("Failed to update user status")
                        return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
                    }

                }).catch((err) => {

                    console.log({ err })
                    return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
                })
            }
        }).catch((err) => {

            console.log({ err })
            return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
        })
    }
}

/**
 * Create a new property
 * @param {String} id mongo id of admin
 * @param {Object} details property details
 */
function createProperty(id, details) {
    if (!id || !ObjectId.isValid(id) || !details) {

        return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails)
    } else {

        let adminQuery = {
            _id: id
        }

        let nftQuery = {
            nftCode: details.nftCode
        }

        return Promise.all([
            dao.getAdminDetails(adminQuery),
            dao.getPropertyDetails(nftQuery),
        ]).then((results) => {
            console.log({results})
            if (!results[0]) {

                return mapper.responseMapping(admConst.CODE.DataNotFound, admConst.MESSAGE.InvalidCredentials)

            } else if (results[1]) {

                return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.nftAlreadyExist)

            } else {
                details.currentBid = details.baseBid
                details.createdAt = new Date().getTime()
                return dao.createProperty(details).then((created) => {

                    if (created) {

                        return mapper.responseMapping(admConst.CODE.Success, admConst.MESSAGE.PropertyCreated)

                    } else {

                        console.log("Failed to update user status")
                        return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
                    }

                }).catch((err) => {

                    console.log({ err })
                    return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
                })
            }
        }).catch((err) => {

            console.log({ err })
            return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
        })
    }
}


module.exports = {

    login,

    logout,

    getProfile,

    updateProfile,

    forgotPassword,

    setNewPassword,

    resetPassword,

    countForDashboard,

    getAllUsers,

    deleteUser,

    createProperty
}
