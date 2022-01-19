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


module.exports = {

    login,

    logout
}


