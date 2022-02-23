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
 * Get all template entities
 * @param {String} id mongo id of admin
 */
 function getAllTemplateEntities(id) {

    if (!id || !ObjectId.isValid(id)) {

        return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails)
    } else {

        let adminQuery = {
            _id: id
        }

        return dao.getAdminDetails(adminQuery).then((adminDetails) => {

            if (adminDetails) {

                let entities = constants.TEMPLATE_ENTITIES
                return mapper.responseMappingWithData(admConst.CODE.Success, admConst.MESSAGE.Success, entities)
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
 * Create Template
 * @param {string} id mongo id of admin who is creating template
 * @param {object} templateDetails email template details to be added
 */
function createTemplate(id, templateDetails) {

    if (!id || !ObjectId.isValid(id) || !templateDetails || (Object.keys(templateDetails).length == 0)) {

        return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails)
    } else {

        let adminQuery = {
            _id: id
        }

        return dao.getAdminDetails(adminQuery).then((adminDetails) => {

            if (adminDetails) {

                let mailQuery = {

                    mailName: templateDetails.mailName
                }

                return dao.getTemplateDetails(mailQuery).then((templateExists) => {

                    if (templateExists) {

                        return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.TemplateAlreadyExists)
                    } else {

                        let filterAllowedTemplateFields = mapper.filterAllowedTemplateFields(templateDetails)
                        filterAllowedTemplateFields.createdBy = id
                        filterAllowedTemplateFields.createdAt = new Date().getTime()

                        return dao.createTemplate(filterAllowedTemplateFields).then((templateCreated) => {

                            if (templateCreated) {

                                let allowedTemplateFields = mapper.filterAllowedTemplateFields(templateCreated)
                                return mapper.responseMappingWithData(admConst.CODE.Success, admConst.MESSAGE.TemplateCreatedSuccess, allowedTemplateFields)

                            } else {

                                console.log('Failed to create template')
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
 * Get all templates
 * @param {string} id mongo id of admin to fetch templates
 * @param {Object} queryParams query params for sorting, paginations
 */
function getAllTemplates(id, queryParams) {

    if (!id || !ObjectId.isValid(id)) {

        return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails)
    } else {

        let adminQuery = {
            _id: id
        }

        return dao.getAdminDetails(adminQuery).then(async (adminDetails) => {

            if (adminDetails) {

                let tmpQuery = {}
                if (queryParams.type) {
                    tmpQuery.type = queryParams.type.toUpperCase()
                }

                if (queryParams.search) {

                    tmpQuery['$or'] = [
                        { 'mailTitle': { '$regex': queryParams.search, '$options': 'i' } },
                        { 'mailName': { '$regex': queryParams.search, '$options': 'i' } },
                        { 'mailSubject': { '$regex': queryParams.search, '$options': 'i' } },
                    ]
                }

                let totalTemplates = await dao.getTemplateCounts(tmpQuery)

                let sortQuery = {}
                if (queryParams.column) {

                    sortQuery[queryParams.column] = ((queryParams.dir == "asc") ? 1 : -1)
                } else {

                    sortQuery['createdAt'] = -1
                }

                let aggregateQuery = [
                    {
                        $match: tmpQuery
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
                            'mailName': 1,
                            'mailTitle': 1,
                            'mailSubject': 1,
                            'mailBody': 1,
                            'status': 1,
                            'createdAt': 1,
                            'createdBy': 1,
                            'type': 1,
                            'notificationMessage': 1
                        }
                    }
                ]
                return dao.getAllTemplates(aggregateQuery).then((templates) => {

                    let respObj = {
                        "recordsTotal": totalTemplates,
                        "recordsFiltered": templates.length,
                        "records": templates
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
 * Get template details
 * @param {string} id mongo id of admin
 * @param {string} templateId mongo id of template to fetch details
 */
function getTemplateDetails(id, templateId) {

    if (!id || !ObjectId.isValid(id) || !templateId || !ObjectId.isValid(templateId)) {

        return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails)
    } else {

        let adminQuery = {
            _id: id
        }

        return dao.getAdminDetails(adminQuery).then((adminDetails) => {

            if (adminDetails) {

                let templateQuery = {
                    _id: templateId
                }

                return dao.getTemplateDetails(templateQuery).then((templateDetails) => {

                    if (templateDetails) {

                        return mapper.responseMappingWithData(admConst.CODE.Success, admConst.MESSAGE.Success, templateDetails)

                    } else {

                        return mapper.responseMapping(admConst.CODE.ReqTimeOut, admConst.MESSAGE.TemplateNotFound)
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
 * Update template
 * @param {String} id mongo id of admin
 * @param {String} templateId mongo id of template to be updated
 * @param {object} templateUpdatingDetails template updating details
 */
function updateTemplate(id, templateId, templateUpdatingDetails) {

    if (!id || !ObjectId.isValid(id) || !templateId || !ObjectId.isValid(templateId) || !templateUpdatingDetails || Object.keys(templateUpdatingDetails).length == 0) {

        return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails)
    } else {

        let adminQuery = {
            _id: id
        }

        return dao.getAdminDetails(adminQuery).then((adminDetails) => {

            if (adminDetails) {

                let templateQuery = {
                    _id: templateId,
                    status: constants.STATUS.ACTIVE
                }

                return dao.getTemplateDetails(templateQuery).then((templateDetails) => {

                    if (templateDetails) {

                        let filterTemplateUpdateFields = mapper.filterTemplateUpdateFields(templateUpdatingDetails)
                        filterTemplateUpdateFields.editedAt = new Date().getTime()
                        filterTemplateUpdateFields.editedBy = id

                        return dao.updateTemplate(templateQuery, filterTemplateUpdateFields).then((templateUpdated) => {

                            if (templateUpdated) {

                                return mapper.responseMappingWithData(admConst.CODE.Success, admConst.MESSAGE.TemplateUpdated, templateUpdated)
                            } else {

                                console.log("Failed to update template")
                                return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)

                            }
                        }).catch((err) => {

                            console.log({ err })
                            return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
                        })

                    } else {

                        return mapper.responseMapping(admConst.CODE.ReqTimeOut, admConst.MESSAGE.TemplateNotFound)
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
 * Delete or Resurrect template
 * @param {String} id mongo id of admin
 * @param {String} templateId mongo id of template to deleted or resurrected
 */
function deleteTemplate(id, templateId) {

    if (!id || !ObjectId.isValid(id) || !templateId || !ObjectId.isValid(templateId)) {

        return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails)
    } else {

        let adminQuery = {
            _id: id
        }

        return dao.getAdminDetails(adminQuery).then((adminDetails) => {

            if (adminDetails) {

                let templateQuery = {
                    _id: templateId
                }

                return dao.getTemplateDetails(templateQuery).then((templateDetails) => {

                    if (templateDetails) {

                        let updateObj = {}
                        if (templateDetails.status == constants.STATUS.ACTIVE) {

                            updateObj = {
                                status: constants.STATUS.INACTIVE
                            }
                        } else {

                            updateObj = {
                                status: constants.STATUS.ACTIVE
                            }
                        }
                        return dao.updateTemplate(templateQuery, updateObj).then((templateUpdated) => {

                            if (templateUpdated) {

                                if (templateUpdated.status == constants.STATUS.ACTIVE) {

                                    return mapper.responseMappingWithData(admConst.CODE.Success, admConst.MESSAGE.TemplateActivated, templateUpdated)
                                } else {

                                    return mapper.responseMappingWithData(admConst.CODE.Success, admConst.MESSAGE.TemplateDeactivated, templateUpdated)
                                }

                            } else {

                                console.log("Failed to update template")
                                return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
                            }
                        }).catch((err) => {

                            console.log({ err })
                            return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
                        })

                    } else {

                        return mapper.responseMapping(admConst.CODE.ReqTimeOut, admConst.MESSAGE.TemplateNotFound)
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
                details.currentBid = details.basePrice
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


/**
 * Get all users
 * @param {String} id mongo id of admin
 * @param {Object} queryParams query params for sorting, paginations
 * @param {Object} filters filters on country, registered dates to be applied
 */
 function getAllProperties(id, queryParams, filters) {

    if (!id || !ObjectId.isValid(id)) {

        return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails)
    } else {

        let adminQuery = {
            _id: id
        }

        return dao.getAdminDetails(adminQuery).then(async (adminDetails) => {

            if (adminDetails) {

                let propertyQuery = {}

                if (queryParams.search) {

                    propertyQuery['$or'] = [
                        { 'properyName': { '$regex': queryParams.search, '$options': 'i' } },
                        { 'propertyType': { '$regex': queryParams.search, '$options': 'i' } },
                        { 'propertyAddress': { '$regex': queryParams.search, '$options': 'i' } },
                        { 'nftCode': { '$regex': queryParams.search, '$options': 'i' } },
                        { 'propertyStatus': { '$regex': queryParams.search, '$options': 'i' } },
                    ]
                }
                if (filters.minDate) {

                    propertyQuery['createdAt'] = {
                        $gte: filters.minDate
                    }
                }
                if (filters.maxDate) {

                    propertyQuery['createdAt'] = {
                        ...propertyQuery['createdAt'],
                        $lte: filters.maxDate
                    }
                }


                let totalProperties = await dao.getPropertyCounts(propertyQuery)

                let sortQuery = {}
                if (queryParams.column) {

                    sortQuery[queryParams.column] = ((queryParams.dir == "asc") ? 1 : -1)
                } else {

                    sortQuery['createdAt'] = -1
                }

                let aggregateQuery = [
                    {
                        $match: propertyQuery
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
                            'properyName': 1,
                            'propertyIcon': 1,
                            'propertyType': 1,
                            'propertyAddress': 1,
                            'nftCode': 1,
                            'propertyStatus': 1,
                            'basePrice': 1
                        }
                    }
                ]

                return dao.getAllProperties(aggregateQuery).then((properties) => {

                    let respObj = {
                        "recordsTotal": totalProperties,
                        "recordsFiltered": properties.length,
                        "records": properties
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
 * Update property
 * @param {String} id mongo id of admin
 * @param {String} propertyId mongo id of property
 * @param {Object} details property details
 */
 function updateProperty(id, propertyId, details) {

    if (!id || !ObjectId.isValid(id) || !propertyId || !ObjectId.isValid(propertyId) || !details) {

        return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails)
    } else {

        let adminQuery = {
            _id: id
        }

        return dao.getAdminDetails(adminQuery).then((adminDetails) => {

            if (adminDetails) {

                let propertyQuery = {
                    _id: propertyId,
                    status: constants.STATUS.ACTIVE
                }

                return dao.getPropertyDetails(propertyQuery).then((propertyDetails) => {

                    if (propertyDetails) {

                        details.editedAt = new Date().getTime()
                        details.editedBy = id
                        console.log({details})
                        return dao.updateProperty(propertyQuery, details).then((propertyUpdated) => {

                            if (propertyUpdated) {

                                return mapper.responseMappingWithData(admConst.CODE.Success, admConst.MESSAGE.PropertyUpdated, propertyUpdated)
                            } else {

                                console.log("Failed to update property")
                                return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)

                            }
                        }).catch((err) => {

                            console.log({ err })
                            return mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError)
                        })

                    } else {

                        return mapper.responseMapping(admConst.CODE.ReqTimeOut, admConst.MESSAGE.PropertyNotFound)
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
 * Delete property
 * @param {String} id mongo id of admin
 * @param {String} propertyId mongo id of property
 */
 function deleteProperty(id, propertyId) {

    if (!id || !ObjectId.isValid(id) || !propertyId || !ObjectId.isValid(propertyId)) {

        return mapper.responseMapping(admConst.CODE.BadRequest, admConst.MESSAGE.InvalidDetails)
    } else {

        let adminQuery = {
            _id: id
        }
        let propertyQuery = {
            _id: propertyId
        }

        return Promise.all([dao.getAdminDetails(adminQuery), dao.getPropertyDetails(propertyQuery, {})]).then((results) => {

            if (!results[0]) {

                return mapper.responseMapping(admConst.CODE.DataNotFound, admConst.MESSAGE.InvalidCredentials)

            } else if (!results[1]) {

                return mapper.responseMapping(admConst.CODE.DataNotFound, admConst.MESSAGE.InvalidCredentials)

            } else {

                let propertyDetails = results[1]

                if (propertyDetails.status == constants.STATUS.ACTIVE) {

                    propertyDetails.status = constants.STATUS.INACTIVE
                } else {

                    propertyDetails.status = constants.STATUS.ACTIVE
                }
                propertyDetails.editedAt = new Date().getTime()
               
                return dao.updateProperty(propertyQuery, propertyDetails).then((propertyUpdated) => {

                    if (propertyUpdated) {

                        if (propertyUpdated.status == constants.STATUS.ACTIVE) {

                            return mapper.responseMappingWithData(admConst.CODE.Success, admConst.MESSAGE.PropertyActivated, propertyUpdated)
                        } else {

                            return mapper.responseMappingWithData(admConst.CODE.Success, admConst.MESSAGE.PropertyDeactivated, propertyUpdated)
                        }
                    } else {

                        console.log("Failed to update property status")
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

    getAllTemplateEntities,

    createTemplate,

    getAllTemplates,

    getTemplateDetails,

    updateTemplate,

    deleteTemplate,

    createProperty,

    getAllProperties,

    updateProperty,

    deleteProperty
}
