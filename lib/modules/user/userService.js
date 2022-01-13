/**
 * @author Ashish Bhalodia
 */

/*#################################            Load modules start            ########################################### */

const dao = require('./userDao')
const usrConst = require('./userConstants')
const mapper = require('./userMapper')
const constants = require('../../constants')
const appUtils = require('../../appUtils')
const jwtHandler = require('../../middleware/jwtHandler')
const ObjectId = require('mongoose').Types.ObjectId
const mailHandler = require('../../middleware/email')
const redisServer = require('../../redis')
var fuzzySearch = require('fuzzy-search');
let { OAuth2Client } = require('google-auth-library')
const { db } = require('../../generic/models/userModel')


/*#################################            Load modules end            ########################################### */

/**
 * Signup into the portal
 * @param {Object} details Submitted details to be saved
 */
function signup(details) {
    if (!details || Object.keys(details).length == 0) {
        return mapper.responseMapping(
            usrConst.CODE.BadRequest,
            usrConst.MESSAGE.InvalidDetails
        );
    } else {
        let emailQuery = {
            emailId: details.emailId ? details.emailId.toLowerCase() : ""
        };

        let usernameQuery = {
            userName: details.userName ? details.userName.toLowerCase() : ""
        };

        return Promise.all([
            dao.getUserDetails(emailQuery),
            dao.getUserDetails(usernameQuery),

        ])
            .then(async (results) => {
                if (results[0]) {
                    return mapper.responseMapping(
                        usrConst.CODE.BadRequest,
                        usrConst.MESSAGE.EmailAlreadyExists
                    );
                } else if (results[1]) {
                    return mapper.responseMapping(
                        usrConst.CODE.BadRequest,
                        usrConst.MESSAGE.UserNameAlreadyExists
                    );
                } else {

                    let convertedPass = await appUtils.convertPass(details.password);

                    details.password = convertedPass;

                    details.createdAt = new Date().getTime();

                    let loginActivity = [];
                    loginActivity.push({
                        device: details.device,
                        date: details.date,
                        browser: details.browser,
                        ipaddress: details.ipaddress,
                        country: details.country,
                        state: details.state,
                        status: constants.STATUS.ACTIVE,
                    });

                    details.loginActivity = loginActivity;

                    return dao
                        .createUser(details)
                        .then((userCreated) => {
                            if (userCreated) {
                                let filteredUserResponseFields =
                                    mapper.filteredUserResponseFields(userCreated);

                                let usrObj = {
                                    _id: userCreated._id,
                                    emailId: userCreated.emailId ? userCreated.emailId.toLowerCase() : "",
                                    userName: userCreated.userName ? userCreated.userName.toLowerCase() : ""
                                };

                                return Promise.all([
                                    jwtHandler.genUsrToken(usrObj)
                                ])
                                    .then((result) => {
                                        let token = result[0];

                                        filteredUserResponseFields.token = token;

                                        return mapper.responseMappingWithData(
                                            usrConst.CODE.Success,
                                            usrConst.MESSAGE.RegisteredSuccessfully,
                                            filteredUserResponseFields
                                        );
                                    })
                                    .catch((err) => {
                                        console.log({ err });
                                        return mapper.responseMapping(
                                            usrConst.CODE.INTRNLSRVR,
                                            usrConst.MESSAGE.internalServerError
                                        );
                                    });

                            } else {
                                console.log("Failed to save user");
                                return mapper.responseMapping(
                                    usrConst.CODE.INTRNLSRVR,
                                    usrConst.MESSAGE.internalServerError
                                );
                            }
                        })
                        .catch((err) => {
                            console.log({ err });
                            return mapper.responseMapping(
                                usrConst.CODE.INTRNLSRVR,
                                usrConst.MESSAGE.internalServerError
                            );
                        });
                }
            })
            .catch((err) => {
                console.log({ err });
                return mapper.responseMapping(
                    usrConst.CODE.INTRNLSRVR,
                    usrConst.MESSAGE.internalServerError
                );
            });
    }
}

/**
 * Login
 * @param {Object} details user details
 */
function login(details) {
    if (!details || Object.keys(details).length == 0) {
        return mapper.responseMapping(
            usrConst.CODE.BadRequest,
            usrConst.MESSAGE.InvalidDetails
        );
    } else {
        let query = {
            status: constants.STATUS.ACTIVE,
        };
        if (details.emailId) {
            query.emailId = details.emailId.toLowerCase();
        }
        if (details.userName) {
            query.userName = details.userName.toLowerCase();
        }

        return dao
            .getUserDetails(query)
            .then(async (userDetails) => {
                if (userDetails) {
                    let isValidPassword = await appUtils.verifyPassword(
                        details,
                        userDetails
                    );
                    console.log({ isValidPassword });

                    if (isValidPassword) {
                        let prevLoginActivities = userDetails.loginActivity;

                        prevLoginActivities.push({
                            device: details.device,
                            date: details.date,
                            browser: details.browser,
                            ipaddress: details.ipaddress,
                            country: details.country,
                            state: details.state,
                        });
                        let updateObj = {
                            loginActivity: prevLoginActivities,
                            isLoggedOut: false,
                        };

                        return dao
                            .updateProfile(query, updateObj)
                            .then((userUpdated) => {
                                if (userUpdated) {
                                    let filteredUserResponseFields =
                                        mapper.filteredUserResponseFields(userUpdated);

                                    let usrObj = {
                                        _id: userUpdated._id,
                                        emailId: userUpdated.emailId.toLowerCase(),
                                        userName: userUpdated.userName
                                    };

                                    return Promise.all([
                                        jwtHandler.genUsrToken(usrObj)
                                    ])
                                        .then((results) => {
                                            let token = results[0];

                                            filteredUserResponseFields.token = token;

                                            return mapper.responseMappingWithData(
                                                usrConst.CODE.Success,
                                                usrConst.MESSAGE.LoginSuccess,
                                                filteredUserResponseFields
                                            );
                                        })
                                        .catch((err) => {
                                            console.log({ err });
                                            return mapper.responseMapping(
                                                usrConst.CODE.INTRNLSRVR,
                                                usrConst.MESSAGE.internalServerError
                                            );
                                        });

                                } else {
                                    console.log("Failed to update login details");
                                    return mapper.responseMapping(
                                        usrConst.CODE.INTRNLSRVR,
                                        usrConst.MESSAGE.internalServerError
                                    );
                                }
                            })
                            .catch((err) => {
                                console.log({ err });
                                return mapper.responseMapping(
                                    usrConst.CODE.INTRNLSRVR,
                                    usrConst.MESSAGE.internalServerError
                                );
                            });
                    } else {
                        return mapper.responseMapping(
                            usrConst.CODE.BadRequest,
                            usrConst.MESSAGE.InvalidPassword
                        );
                    }
                } else {
                    return mapper.responseMapping(
                        usrConst.CODE.DataNotFound,
                        usrConst.MESSAGE.InvalidCredentials
                    );
                }
            })
            .catch((err) => {
                console.log({ err });
                return mapper.responseMapping(
                    usrConst.CODE.INTRNLSRVR,
                    usrConst.MESSAGE.internalServerError
                );
            });
    }
}

/**
 * Login into the portal by Google
 * @param {Object} details Submitted details to be saved
 */
async function googleLogin(details) {

    let client = new OAuth2Client(process.env.CLIENT_ID)

    if (!details || Object.keys(details).length == 0 || !details.tokenId || !details.googleId) {
        return mapper.responseMapping(
            usrConst.CODE.BadRequest,
            usrConst.MESSAGE.InvalidDetails
        );
    } else {

        details.registeredVia = "GOOGLE"

        const ticket = await client.verifyIdToken({
            idToken: details.tokenId,
            audience: process.env.CLIENT_ID
        });

        const { email_verified, name, email, picture } = ticket.getPayload();

        if (!email_verified) {
            return mapper.responseMapping(
                usrConst.CODE.BadRequest,
                "Something went wrong!"
            );
        } else {

            let userQuery = {
                emailId: email.toLowerCase()
            }
            let userDetails = await dao.getUserDetails(userQuery)
            if (userDetails) {
                console.log({userDetails})
                //login
                let prevLoginActivities = userDetails.loginActivity;

                prevLoginActivities.push({
                    device: details.device,
                    date: details.date,
                    browser: details.browser,
                    ipaddress: details.ipaddress,
                    country: details.country,
                    state: details.state,
                });
                let updateObj = {
                    loginActivity: prevLoginActivities,
                    isLoggedOut: false,
                };

                return dao
                    .updateProfile(userQuery, updateObj)
                    .then((userUpdated) => {
                        if (userUpdated) {
                            let filteredUserResponseFields =
                                mapper.filteredUserResponseFields(userUpdated);

                            let usrObj = {
                                _id: userUpdated._id,
                                emailId: userUpdated.emailId.toLowerCase(),
                                userName: userUpdated.userName
                            };

                            return Promise.all([
                                jwtHandler.genUsrToken(usrObj)
                            ])
                                .then((results) => {
                                    let token = results[0];

                                    filteredUserResponseFields.token = token;

                                    return mapper.responseMappingWithData(
                                        usrConst.CODE.Success,
                                        usrConst.MESSAGE.VerificationSuccess,
                                        filteredUserResponseFields
                                    );
                                })
                                .catch((err) => {
                                    console.log({ err });
                                    return mapper.responseMapping(
                                        usrConst.CODE.INTRNLSRVR,
                                        usrConst.MESSAGE.internalServerError
                                    );
                                });

                        } else {
                            console.log("Failed to update login details");
                            return mapper.responseMapping(
                                usrConst.CODE.INTRNLSRVR,
                                usrConst.MESSAGE.internalServerError
                            );
                        }
                    })
                    .catch((err) => {
                        console.log({ err });
                        return mapper.responseMapping(
                            usrConst.CODE.INTRNLSRVR,
                            usrConst.MESSAGE.internalServerError
                        );
                    });
            } else {
                //signup
                details.name = name
                details.emailId = email.toLowerCase()
                details.profilePicture = picture
                details.createdAt = new Date().getTime();

                let loginActivity = [];
                loginActivity.push({
                    device: details.device,
                    date: details.date,
                    browser: details.browser,
                    ipaddress: details.ipaddress,
                    country: details.country,
                    state: details.state,
                    status: constants.STATUS.ACTIVE,
                });

                details.loginActivity = loginActivity;
                
                return dao
                    .createUser(details)
                    .then((userCreated) => {
                        if (userCreated) {
                            let filteredUserResponseFields =
                                mapper.filteredUserResponseFields(userCreated);

                            let usrObj = {
                                _id: userCreated._id,
                                emailId: userCreated.emailId.toLowerCase(),
                                userName: userCreated.userName
                            };

                            return Promise.all([
                                jwtHandler.genUsrToken(usrObj)
                            ])
                                .then((result) => {
                                    let token = result[0];

                                    filteredUserResponseFields.token = token;

                                    return mapper.responseMappingWithData(
                                        usrConst.CODE.Success,
                                        usrConst.MESSAGE.VerificationSuccess,
                                        filteredUserResponseFields
                                    );
                                })
                                .catch((err) => {
                                    console.log({ err });
                                    return mapper.responseMapping(
                                        usrConst.CODE.INTRNLSRVR,
                                        usrConst.MESSAGE.internalServerError
                                    );
                                });

                            return mapper.responseMappingWithData(
                                usrConst.CODE.Success,
                                usrConst.MESSAGE.RegisteredSuccessfully,
                                filteredUserResponseFields
                            );
                        } else {
                            console.log("Failed to save user");
                            return mapper.responseMapping(
                                usrConst.CODE.INTRNLSRVR,
                                usrConst.MESSAGE.internalServerError
                            );
                        }
                    })
                    .catch((err) => {
                        console.log({ err });
                        return mapper.responseMapping(
                            usrConst.CODE.INTRNLSRVR,
                            usrConst.MESSAGE.internalServerError
                        );
                    });
            }

        }

    }
}

/**
 * contactUs
 * @param {Object} details contactUs Info
 */
function contactUs(details) {
    if (!details) {
        return mapper.responseMapping(
            usrConst.CODE.BadRequest,
            usrConst.MESSAGE.InvalidDetails
        );
    } else {
        return dao
            .getAdminDetails()
            .then(async (adminDetails) => {


                if (adminDetails) {
                    let adminEmailId = adminDetails.emailId;

                    let emailThirdPartyServiceQuery = {
                        type: constants.THIRD_PARTY_SERVICES.MAIL_GATEWAY,
                        status: constants.STATUS.ACTIVE,
                    };

                    let emailServiceDetails = await dao.getServiceDetails(
                        emailThirdPartyServiceQuery
                    );
                    if (emailServiceDetails) {
                        let mailQuery = {
                            type: constants.TEMPLATE_TYPES.EMAIL,
                            mailName: constants.EMAIL_TEMPLATES.CONTACT_US_QUERY,
                            status: constants.STATUS.ACTIVE,
                        };

                        let templateDetails = await dao.getTemplateDetails(mailQuery);
                        if (templateDetails) {
                            let mailBodyDetails = {
                                adminEmailId: adminEmailId.toLowerCase(),
                                userEmailId: details.emailId.toLowerCase(),
                                comment: details.comment,
                                name: details.name,
                                contactNumber: details.contactNumber
                            };
                            let mailSent = mailHandler.SEND_CONTACT_US_QUERY_MAIL(
                                mailBodyDetails,
                                templateDetails,
                                emailServiceDetails
                            );
                            console.log({ mailSent });
                        }
                    }
                }

                return dao
                    .createContactUs(details)
                    .then((contactUsCreated) => {
                        if (contactUsCreated) {

                            return mapper.responseMapping(
                                usrConst.CODE.Success,
                                usrConst.MESSAGE.ContactUsQuerySent
                            );
                        } else {
                            console.log("Failed to save contact us");
                            return mapper.responseMapping(
                                usrConst.CODE.INTRNLSRVR,
                                usrConst.MESSAGE.internalServerError
                            );
                        }
                    })
                    .catch((err) => {
                        console.log({ err });
                        return mapper.responseMapping(
                            usrConst.CODE.INTRNLSRVR,
                            usrConst.MESSAGE.internalServerError
                        );
                    });

            })
            .catch((err) => {
                console.log({ err });
                return mapper.responseMapping(
                    usrConst.CODE.INTRNLSRVR,
                    usrConst.MESSAGE.internalServerError
                );
            });
    }
}

/**
 * Forgot password
 * @param {String} emailId email id of user to send password recovery link
 */
function forgotPassword(emailId) {
    if (!emailId) {
        return mapper.responseMapping(
            usrConst.CODE.BadRequest,
            usrConst.MESSAGE.InvalidDetails
        );
    } else {
        let query = {
            emailId: emailId.toLowerCase(),
        };
        return dao
            .getUserDetails(query)
            .then(async (isExist) => {
                if (isExist) {
                    let obj = {
                        type: "FORGOT",
                        userId: isExist._id,
                        emailId: isExist.emailId.toLowerCase(),
                        isActive: true,
                        expiryTime: new Date().getTime() + 30 * 60 * 1000,
                    };

                    let redisId = await redisServer.setRedisDetails(obj);

                    console.log({ redisId });

                    let thirdPartyServiceQuery = {
                        type: constants.THIRD_PARTY_SERVICES.MAIL_GATEWAY,
                        status: constants.STATUS.ACTIVE,
                    };

                    let serviceDetails = await dao.getServiceDetails(
                        thirdPartyServiceQuery
                    );
                    if (serviceDetails) {
                        let mailQuery = {
                            type: constants.TEMPLATE_TYPES.EMAIL,
                            mailName: constants.EMAIL_TEMPLATES.USER_FORGOT_PASSWORD,
                            status: constants.STATUS.ACTIVE,
                        };
                        let templateDetails = await dao.getTemplateDetails(mailQuery);

                        if (templateDetails) {
                            let usrObj = {
                                fullName: isExist.name || "User",
                                emailId: isExist.emailId.toLowerCase(),
                                redisId: redisId,
                            };
                            let mailSent = mailHandler.SEND_MAIL(
                                usrObj,
                                templateDetails,
                                serviceDetails
                            );
                        }
                    }

                    return mapper.responseMapping(
                        usrConst.CODE.Success,
                        usrConst.MESSAGE.ResetPasswordMailSent
                    );
                } else {
                    return mapper.responseMapping(
                        usrConst.CODE.DataNotFound,
                        usrConst.MESSAGE.InvalidCredentials
                    );
                }
            })
            .catch((e) => {
                console.log({ e });
                return mapper.responseMapping(
                    usrConst.CODE.INTRNLSRVR,
                    usrConst.MESSAGE.internalServerError
                );
            });
    }
}

/**
 * Set new password
 * @param {string} redisId redis id for recovering password
 * @param {string} password new password to set
 */
async function setNewPassword(redisId, password) {
    if (!redisId || !password) {
        return mapper.responseMapping(
            usrConst.CODE.BadRequest,
            usrConst.MESSAGE.InvalidDetails
        );
    } else {
        let isUserExists = await redisServer.getRedisDetails(redisId);

        if (isUserExists) {
            let newPass = await appUtils.convertPass(password);

            let query = {
                _id: isUserExists.userId,
            };
            let updateObj = {
                password: newPass,
            };
            return dao
                .updateProfile(query, updateObj)
                .then(async (updateDone) => {
                    if (updateDone) {
                        let thirdPartyServiceQuery = {
                            type: constants.THIRD_PARTY_SERVICES.MAIL_GATEWAY,
                            status: constants.STATUS.ACTIVE,
                        };

                        let serviceDetails = await dao.getServiceDetails(
                            thirdPartyServiceQuery
                        );
                        if (serviceDetails) {
                            let query = {
                                mailName: constants.EMAIL_TEMPLATES.USER_RESET_PASSWORD,
                                status: constants.STATUS.ACTIVE,
                            };
                            let templateDetails = await dao.getTemplateDetails(query);

                            if (!updateDone.name) {
                                updateDone.name = "User";
                            }
                            let mailBodyDetails = updateDone;

                            let mailConfig = mailHandler.SEND_MAIL(
                                mailBodyDetails,
                                templateDetails,
                                serviceDetails
                            );
                        }

                        return mapper.responseMapping(
                            usrConst.CODE.Success,
                            usrConst.MESSAGE.PasswordUpdateSuccess
                        );
                    } else {
                        console.log("Failed to reset password");
                        return mapper.responseMapping(
                            usrConst.CODE.INTRNLSRVR,
                            usrConst.MESSAGE.internalServerError
                        );
                    }
                })
                .catch((e) => {
                    console.log({ e });
                    return mapper.responseMapping(
                        usrConst.CODE.INTRNLSRVR,
                        usrConst.MESSAGE.internalServerError
                    );
                });
        } else {
            return mapper.responseMapping(
                usrConst.CODE.ReqTimeOut,
                usrConst.MESSAGE.ResetPasswordLinkExpired
            );
        }
    }
}

/**
 * Get profile details
 * @param {string} id mongo id of user
 */
function getProfileDetails(id) {
    if (!id || !ObjectId(id)) {
        return mapper.responseMapping(
            usrConst.CODE.BadRequest,
            usrConst.MESSAGE.InvalidDetails
        );
    } else {

        let query = {
            _id: ObjectId(id)
        }
        return dao
            .getUserDetails(query)
            .then((userDetails) => {
                if (userDetails) {
                    return mapper.responseMappingWithData(
                        usrConst.CODE.Success,
                        usrConst.MESSAGE.Success,
                        userDetails
                    );
                } else {
                    return mapper.responseMapping(
                        usrConst.CODE.DataNotFound,
                        usrConst.MESSAGE.InvalidCredentials
                    );
                }
            })
            .catch((err) => {
                console.log({ err });
                return mapper.responseMapping(
                    usrConst.CODE.INTRNLSRVR,
                    usrConst.MESSAGE.internalServerError
                );
            });
    }
}

/**
 * Update profile details
 * @param {string} id mongo id of user
 * @param {Object} details to be updated
 */
function updateProfile(id, details) {
    if (!id || !ObjectId(id) || !details) {
        return mapper.responseMapping(
            usrConst.CODE.BadRequest,
            usrConst.MESSAGE.InvalidDetails
        );
    } else {

        let query = {
            _id: ObjectId(id)
        }

        return dao
            .getUserDetails(query)
            .then(async (userDetails) => {
                if (userDetails) {

                    let updateObj = userDetails
                    if (details.emailId) {
                        let userQuery = {
                            emailId: details.emailId.toLowerCase(),
                            _id: { $ne: id }
                        }
                        let userData = await dao.getUserDetails(userQuery)

                        if (userData) {
                            return mapper.responseMapping(
                                usrConst.CODE.BadRequest,
                                usrConst.MESSAGE.EmailAlreadyExists
                            );
                        } else {
                            updateObj.emailId = details.emailId
                        }
                    }
                    if (details.name) {
                        updateObj.name = details.name
                    }
                    if (details.contactNumber) {
                        updateObj.contactNumber = details.contactNumber
                    }

                    return dao
                        .updateProfile(query, updateObj)
                        .then((updateDone) => {
                            if (updateDone) {

                                return mapper.responseMappingWithData(
                                    usrConst.CODE.Success,
                                    usrConst.MESSAGE.ProfileUpdateSuccess,
                                    updateDone
                                );
                            } else {
                                console.log("Failed to update profile");
                                return mapper.responseMapping(
                                    usrConst.CODE.INTRNLSRVR,
                                    usrConst.MESSAGE.internalServerError
                                );
                            }
                        })
                        .catch((e) => {
                            console.log({ e });
                            return mapper.responseMapping(
                                usrConst.CODE.INTRNLSRVR,
                                usrConst.MESSAGE.internalServerError
                            );
                        });
                } else {
                    return mapper.responseMapping(
                        usrConst.CODE.INTRNLSRVR,
                        usrConst.MESSAGE.internalServerError
                    );
                }
            })
            .catch((e) => {
                console.log({ e });
                return mapper.responseMapping(
                    usrConst.CODE.DataNotFound,
                    usrConst.MESSAGE.InvalidCredentials
                );
            });
    }
}

module.exports = {

    signup,

    login,

    googleLogin,

    contactUs,

    forgotPassword,

    setNewPassword,

    getProfileDetails,

    updateProfile
}