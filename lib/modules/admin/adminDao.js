/**
 * @author Ashish Bhalodia
 */

/*#################################            Load modules start            ########################################### */

let BaseDao = require('../../dao/BaseDao')
const constants = require('../../constants')
const Admin = require('../../generic/models/adminModel')
const adminDao = new BaseDao(Admin)
const User = require('../../generic/models/userModel')
const usrDao = new BaseDao(User)
const Template = require('../../generic/models/templateModel')
const templateDao = new BaseDao(Template)
const CMS = require('../../generic/models/cmsModel')
const cmsDao = new BaseDao(CMS)
const ThirdPartyService = require('../../generic/models/thirdPartyServiceModel')
const thirdPartyDao = new BaseDao(ThirdPartyService)


/*#################################            Load modules end            ########################################### */

/**
 * Get admin details
 * @param {object} query  query elements to find admin record
 */
function getAdminDetails(query) {
    return adminDao.findOne(query)
}

/**
 * Update profile
 * @param {object} query query elements to find admin record
 * @param {object} updateObj profile updating details
 */
function updateProfile(query, updateObj) {

    let update = {}
    update['$set'] = updateObj

    let options = {
        new: true
    }

    return adminDao.findOneAndUpdate(query, update, options)
}

/**
 * Get third party service details
 * @param {Object} query mongo query to find third party service
 */
function getServiceDetails(query) {

    return thirdPartyDao.findOne(query)
}

/**
 * Create third party services
 * @param {Object} details service details to be added
 */
function createService(details) {

    let serviceObj = new ThirdPartyService(details)
    return thirdPartyDao.save(serviceObj)
}

/**
 * Get all third party services
 */
function getAllServices() {

    return thirdPartyDao.find()
}

/**
 * Update third party service
 * @param {Object} query mongo query to find third party service
 * @param {Object} updateObj details to be updated
 */
function updateService(query, updateObj) {

    let update = {}
    update['$set'] = updateObj

    let options = {
        new: true
    }

    return thirdPartyDao.findOneAndUpdate(query, update, options)
}

/**
 * Get all users
 * @param {Object} query mongo query to find all users
 */
function getAllUsers(query) {

    return usrDao.aggregate(query)
}

/**
 * Add user
 * @param {Object} obj user details to be added
 */
function createUser(obj) {

    let userObj = new User(obj)
    return usrDao.save(userObj)
}

/**
 * Get counts of users
 * @param {Object} query query to count records
 */
function getUserCounts(query) {

    return usrDao.count(query)
}

/**
 * Get user details
 * @param {Object} query query to find user
 */
function getUserDetails(query, projectQuery) {

    return usrDao.findOne(query, projectQuery)
}

/**
 * Update user
 * @param {Object} query mongo query to find user
 * @param {Object} updateObj details of user to be updated
 */
function updateUser(query, updateObj) {

    let update = {}
    update['$set'] = updateObj

    let options = {
        new: true
    }

    return usrDao.findOneAndUpdate(query, update, options)
}

/**
 * Get template details
 * @param {Object} query query elements to find template
 */
function getTemplateDetails(query) {

    return templateDao.findOne(query)
}

/**
 * Get email template counts
 * @param {Object} query query params for counting records
 */
function getTemplateCounts(query) {

    return templateDao.count(query)
}

/**
 * Create template
 * @param {object} obj template creating details
 */
function createTemplate(obj) {

    let tempObj = new Template(obj)
    return templateDao.save(tempObj)
}

/**
 * Get all templates
 * @param {Object} query aggregation pipeline query
 */
function getAllTemplates(query) {

    return templateDao.aggregate(query)
}

/**
 * Update template
 * @param {Object} query template finding query elements
 * @param {Object} updateObj template updating details
 */
function updateTemplate(query, updateObj) {

    let update = {}
    update['$set'] = updateObj
    let options = {
        new: true
    }

    return templateDao.findOneAndUpdate(query, update, options)
}

/**
 * Create CMS page
 * @param {Object} details CMS page details to be added
 */
function createCMS(details) {

    let cmsObj = new CMS(details)
    return cmsDao.save(cmsObj)
}

/**
 * Find CMS page details
 * @param {Object} query query to find CMS details
 * @returns 
 */
function getCMSDetails(query) {

    return cmsDao.findOne(query)
}

/**
 * Update CMS Page
 * @param {Object} query query to find CMS details
 * @param {Object} updateObj details to be updated
 */
function updateCMS(query, updateObj) {

    let update = {}
    update['$set'] = updateObj

    let options = {
        new: true
    }
    return cmsDao.findOneAndUpdate(query, update, options)
}

/**
 * Get all CMS pages
 */
function getAllCMSPages() {

    return cmsDao.find()

}

/* * Add project roles
 * @param {Object} query query to find admin record
 * @param {Array} roles list if project roles to be added
 */
function addRoles(query, roles) {

    let update = {}
    update['$addToSet'] = { projectRoles: roles }
    let options = {
        new: true
    }

    return adminDao.findOneAndUpdate(query, update, options)
}

/**
 * Update details in multiple users at a time
 * @param {Object} updateObj details to be updated
 */
function updateMultipleUsers(userId, updateObj) {

    let query = { _id: userId }
    let update = {}
    update['$set'] = updateObj

    let options = {
        new: true,
    }

    return usrDao.findOneAndUpdate(query, updateObj, options)
}


function createAdmin(obj) {

    let adminObj = new Admin(obj)
    return adminDao.save(adminObj)
}

/**
 * Get unique skills list which are used by users
 * @param {String} query key for fetching distinct values
 */
function getAllUsedDistinctSkills(query) {

    return usrDao.distinct(query)
}

/**
 * Get all user count
 * @param {Object} query all user get query 
 */
function countUsers(query) {

    return usrDao.count(query)
}


function getAllUserActivities(query, projection) {

    return usrDao.find(query, projection)
}

module.exports = {

    getAdminDetails,

    updateProfile,

    getServiceDetails,

    createService,

    getAllServices,

    updateService,

    getAllUsers,

    getUserCounts,

    getUserDetails,

    createUser,

    updateUser,

    getTemplateDetails,

    createTemplate,

    getTemplateCounts,

    getAllTemplates,

    updateTemplate,

    addRoles,

    updateMultipleUsers,

    createCMS,

    getCMSDetails,

    updateCMS,

    getAllCMSPages,

    createAdmin,

    getAllUsedDistinctSkills,

    countUsers,

    getAllUserActivities,

}
