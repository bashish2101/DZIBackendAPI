/**
 * @author Ashish Bhalodia
 */

/*#################################            Load modules start            ########################################### */
const service = require('./adminService')

/*#################################            Load modules end            ########################################### */

/**
 * Login
 * @param {Object} details admin login details
 */
function login(details) {

    return service.login(details).then(data => data)
}

/**
 * Logout
 * @param {String} id mongo id of admin
 * @param {String} activityId mongo id of login activity to be inactivated
 */
function logout(id, activityId) {

    return service.logout(id, activityId).then(data => data)
}

/**
 * Get profile
 * @param {string} id mongo id of admin to fetch profile details
 */
 function getProfile(id) {

    return service.getProfile(id).then(data => data)
}

/**
 * Update profile
 * @param {string} id mongo id of admin
 * @param {object} details admin profile updating details
 */
function updateProfile(id, details) {

    return service.updateProfile(id, details).then(data => data)
}

/**
 * Recover password by email
 * @param {string} emailId email id of admin for recover password
 */
function forgotPassword(emailId) {

    return service.forgotPassword(emailId).then(data => data)
}

/**
 * Set new password
 * @param {string} redisId redis id for recovering password
 * @param {string} password new password to set
 */
function setNewPassword(redisId, password) {

    return service.setNewPassword(redisId, password).then(data => data)
}

/**
 * Reset password
 * @param {string} id mongo id of admin
 * @param {string} oldPassword old password to verify
 * @param {string} newPassword new password to reset
 */
function resetPassword(id, oldPassword, newPassword) {

    return service.resetPassword(id, oldPassword, newPassword).then(data => data)
}

/**
 * get dashboard count 
 * @param {String} id mongo id of admin
 */
 function countForDashboard(id) {

    return service.countForDashboard(id).then(data => data)
}

/**
 * Get all users
 * @param {String} id mongo id of admin
 * @param {Object} queryParams query params for sorting, paginations
 * @param {Object} filters filters on country, registered dates to be applied
 */
 function getAllUsers(id, queryParams, filters) {

    return service.getAllUsers(id, queryParams, filters).then(data => data)
}

/**
 * Delete or Resurrect user
 * @param {String} id mongo id of admin
 * @param {String} userId mongo id of user to be deleted or resurrected
 */
 function deleteUser(id, userId) {

    return service.deleteUser(id, userId).then(data => data)
}


/**
 * Create a new property
 * @param {String} id mongo id of admin
 * @param {Object} details property details
 */
 function createProperty(id, details) {

    return service.createProperty(id, details).then(data => data)
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


