/**
 * @author Ashish Bhalodia
 */

/*#################################            Load modules start            ########################################### */
const service = require('./userService')

/*#################################            Load modules end            ########################################### */

/**
 * Login
 * @param {Object} details user details
 */
function login(details) {

    return service.login(details).then(data => data)
}

/**
 * Signup into the portal
 * @param {Object} details Submitted details to be saved
 */
function signup(details) {
    return service.signup(details).then((data) => data);
}

/**
 * Login into the portal by Google
 * @param {Object} details Submitted details to be saved
 */
function googleLogin(details) {

    return service.googleLogin(details).then(data => data)
}

/**
 * contactUs
 * @param {Object} details contact us details 
 */
function contactUs(details) {
    return service.contactUs(details).then((data) => data);
}

/**
 * contactUs
 * @param {Object} details contact us details 
 */
 function contactUsInquiry(details) {
    return service.contactUsInquiry(details).then((data) => data);
}

/**
 * Forgot password
 * @param {String} emailId email id of user to send password recovery link
 */
function forgotPassword(emailId) {
    return service.forgotPassword(emailId).then((data) => data);
}

/**
 * Set new password
 * @param {string} redisId redis id for recovering password
 * @param {string} password new password to set
 */
function setNewPassword(redisId, password) {
    return service.setNewPassword(redisId, password).then((data) => data);
}

/**
 * Get profile details
 * @param {string} id mongo id of user
 */
function getProfileDetails(id) {
    return service.getProfileDetails(id).then((data) => data);
}

/**
 * Update profile details
 * @param {string} id mongo id of user
 * @param {Object} details to be updated
 */
 function updateProfile(id, details) {
    return service.updateProfile(id, details).then((data) => data);
}

/**
 * get explore properties
 * @param {string} id mongo id of user
 */
 function getProperties(id) {
    return service.getProperties(id).then((data) => data);
}


module.exports = {
    login,

    signup,

    googleLogin,

    contactUs,

    forgotPassword,

    setNewPassword,

    getProfileDetails,

    updateProfile,

    contactUsInquiry,

    getProperties
}
