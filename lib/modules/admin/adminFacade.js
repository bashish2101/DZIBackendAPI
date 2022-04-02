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
 * Create template
 * @param {string} id mongo id of admin who is creating template
 * @param {object} templateDetails email template details to be added
 */
 function createTemplate(id, templateDetails) {

    return service.createTemplate(id, templateDetails).then(data => data)
}

/**
 * Get all templates
 * @param {string} id mongo id of admin to fetch templates
 * @param {Object} queryParams query params for sorting, paginations
 */
function getAllTemplates(id, queryParams) {

    return service.getAllTemplates(id, queryParams).then(data => data)
}

/**
 * Get template details
 * @param {string} id mongo id of admin
 * @param {string} templateId mongo id of template to fetch details
 */
function getTemplateDetails(id, templateId) {

    return service.getTemplateDetails(id, templateId).then(data => data)
}

/**
 * Update template
 * @param {String} id mongo id of admin
 * @param {String} templateId mongo id of template to be updated
 * @param {object} templateDetails template updating details
 */
function updateTemplate(id, templateId, templateDetails) {

    return service.updateTemplate(id, templateId, templateDetails).then(data => data)
}

/**
 * Delete or Resurrect template
 * @param {String} id mongo id of admin
 * @param {String} templateId mongo id of template to deleted or resurrected
 */
function deleteTemplate(id, templateId) {

    return service.deleteTemplate(id, templateId).then(data => data)
}

/**
 * Get all template entities
 * @param {String} id mongo id of admin
 */
function getAllTemplateEntities(id) {

    return service.getAllTemplateEntities(id).then(data => data)
}

/**
 * Create a new property
 * @param {String} id mongo id of admin
 * @param {Object} details property details
 */
 function createProperty(id, details) {

    return service.createProperty(id, details).then(data => data)
}

/**
 * Get all properties
 * @param {String} id mongo id of admin
 * @param {Object} queryParams query params for sorting, paginations
 * @param {Object} filters filters on country, registered dates to be applied
 */
 function getAllProperties(id, queryParams, filters, userId) {

    return service.getAllProperties(id, queryParams, filters, userId).then(data => data)
}

/**
 * Update property
 * @param {String} id mongo id of admin
 * @param {String} propertyId mongo id of property
 * @param {Object} details property details
 */
 function updateProperty(id, propertyId, details) {

    return service.updateProperty(id, propertyId, details).then(data => data)
}

/**
 * Delete property
 * @param {String} id mongo id of admin
 * @param {String} propertyId mongo id of property
 */
 function deleteProperty(id, propertyId) {

    return service.deleteProperty(id, propertyId).then(data => data)
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

    createTemplate,

    getAllTemplates,

    getTemplateDetails,

    updateTemplate,

    deleteTemplate,

    getAllTemplateEntities,

    createProperty,

    getAllProperties,

    updateProperty,

    deleteProperty
}


