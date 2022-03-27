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
function getProperties(id, details) {
    return service.getProperties(id, details).then((data) => data);
}

/**
 * add property to cart
 * @param {string} id mongo id of user
 * @param {string} propertyId mongo id of property
 */
function addToCart(id, propertyId) {
    return service.addToCart(id, propertyId).then((data) => data);
}

/**
 * Get cart properties
 * @param {string} id mongo id of user
 * queryParams
 */
function getCartProperties(id, queryParams) {
    return service.getCartProperties(id, queryParams).then((data) => data);
}

/**
 * make bid
 * @param {string} id mongo id of user
 * @param {string} propertyId mongo id of property
 * @param {number} amount bid amount
 */
function makeBid(id, propertyId, amount) {
    return service.makeBid(id, propertyId, amount).then((data) => data);
}

/**
 * mark as favourite property
 * @param {string} id mongo id of user
 * @param {string} propertyId mongo id of property
 */
function markAsFavouriteProperty(id, propertyId) {
    return service.markAsFavouriteProperty(id, propertyId).then((data) => data);
}

/**
 *delete property from cart
 * @param {string} id mongo id of user
 * @param {Array} properties mongo id of property
 */
function deletePropertyCart(id, properties) {
    return service.deletePropertyCart(id, properties).then((data) => data);
}

/**
 * buy properties
 * @param {string} id mongo id of user
 * @param {Array} properties mongo id of property
 */
function buyProperties(id, properties) {
    return service.buyProperties(id, properties).then((data) => data);
}

/**
 * sell properties
 * @param {string} id mongo id of user
 * @param {Array} properties mongo id of property
 */
 function sellProperties(id, properties) {
    return service.sellProperties(id, properties).then((data) => data);
}

/**
 * Get user properties
 * @param {string} id mongo id of user
 */
function getUserProperties(id, details) {
    return service.getUserProperties(id, details).then((data) => data);
}

/**
 * Get user's favourite properties
 * @param {string} id mongo id of user
 */
 function getFavouriteProperties(id) {
    return service.getFavouriteProperties(id).then((data) => data);
}

/**
 * Get properties count
 * @param {string} id mongo id of user
 */
 function getPropertiesCount(id, details) {
    return service.getPropertiesCount(id, details).then((data) => data);
}


/**
 * Get properties info
 * @param {string} id mongo id of user
 * @param {string} hexID hexID of property
 */
 function getPropertiesInfo(id, hexID) {
    return service.getPropertiesInfo(id, hexID).then((data) => data);
}

/**
* Add avatar
* @param {string} id mongo id of user
* @param {Object} details to be updated
*/
function addAvatar(id, details) {
    return service.addAvatar(id, details).then((data) => data);
}

/**
* Delete avatar
* @param {string} id mongo id of user
* @param {string} avatarID mongo id of user's avatar
*/
function deleteAvatar(id, avatarID) {
    return service.deleteAvatar(id, avatarID).then((data) => data);
}

/**
* Update property
* @param {string} id mongo id of user
* @param {string} propertyId mongo id of property
*/
function updateProperty(id, propertyId, details) {
    return service.updateProperty(id, propertyId, details).then((data) => data);
}

/**
* Property stats
* @param {string} id mongo id of user
*/
function getUserPropertiesStats(id) {
    return service.getUserPropertiesStats(id).then((data) => data);
}

/**
* Dashboard details
* @param {string} id mongo id of user
*/
function getDashboardDetails(id) {
    return service.getDashboardDetails(id).then((data) => data);
}

/**
 * Get admin notifications
 * @param {String} id mongo id of admin
 * @param {Object} queryParams pagination params
 */
 function getAllNotifications(id, queryParams) {

    return service.getAllNotifications(id, queryParams).then(data => data)
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

    getProperties,

    addToCart,

    getCartProperties,

    makeBid,

    markAsFavouriteProperty,

    deletePropertyCart,

    buyProperties,

    sellProperties,

    getUserProperties,

    getFavouriteProperties,

    getPropertiesCount,

    getPropertiesInfo,

    addAvatar,

    deleteAvatar,

    updateProperty,

    getUserPropertiesStats,

    getDashboardDetails,

    getAllNotifications
}
