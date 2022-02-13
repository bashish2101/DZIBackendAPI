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
 * Get user properties
 * @param {string} id mongo id of user
 */
 function getUserProperties(id) {
    return service.getUserProperties(id).then((data) => data);
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

    getUserProperties
}
