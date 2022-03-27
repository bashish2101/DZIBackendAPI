/**
 * @author Ashish Bhalodia
 */

/*#################################            Load modules start            ########################################### */

const mongoose = require('mongoose')
let BaseDao = require('../../dao/BaseDao')
const constants = require('../../constants')
const User = require('../../generic/models/userModel')
const usrDao = new BaseDao(User)
const Admin = require('../../generic/models/adminModel')
const adminDao = new BaseDao(Admin)
const Property = require('../../generic/models/propertyModel')
const propertyDao = new BaseDao(Property)
const ThirdPartyService = require('../../generic/models/thirdPartyServiceModel')
const thirdPartyDao = new BaseDao(ThirdPartyService)
const Template = require('../../generic/models/templateModel')
const templateDao = new BaseDao(Template)
const ContactUs = require('../../generic/models/contactUsModal')
const contractUsDao = new BaseDao(ContactUs)
const Notification = require('../../generic/models/notificationModel')
const notificationDao = new BaseDao(Notification)


/*#################################            Load modules end            ########################################### */

/**
 * Get user details
 * @param {Object} query query to find user details
 */
function getUserDetails(query) {

    return usrDao.findOne(query)
}

/**
 * Get users
 * @param {Object} query query to find user details
 */
 function getAllUsers(query) {

    return usrDao.find(query)
}

/**
 * Create user
 * @param {Object} obj user details to be registered
 */
function createUser(obj) {

    let userObj = new User(obj)
    return usrDao.save(userObj)
}

/**
 * Update user profile
 * @param {Object} query mongo query to find user to update
 * @param {Object} updateDetails details to be updated
 */
function updateProfile(query, updateDetails) {

    let update = {}
    update['$set'] = updateDetails

    let options = {
        new: true,
        // upsert: true
    }
    return usrDao.findOneAndUpdate(query, update, options)
}

/**
 * Get admin details
 */
 function getAdminDetails() {

    return adminDao.findOne()
}

/**
 * Create contact us
 * @param {Object} obj contact us details to be added
 */
 function createContactUs(obj) {

    let contactUsObj = new User(obj)
    return contractUsDao.save(contactUsObj)
}

/**
 * Get third party service details
 * @param {Object} query mongo query to find third party service details
 */
 function getServiceDetails(query) {

    return thirdPartyDao.findOne(query)
}

/**
 * Get template details
 * @param {Object} query query elements to find template
 */
 function getTemplateDetails(query) {

    return templateDao.findOne(query)
}

/**
 * get explore properties
 * @param {Object} query query elements to find property
 */
 function getProperties(query, params) {
    
    if(params){
        return propertyDao.customFindProperty(query, params)
    }else{
        return propertyDao.find(query)
    }
}

/**
 * get property details
 * @param {Object} query query elements to find property details
 */
 function getPropertyDetails(query) {

    return propertyDao.findOne(query)
}

/**
 * get property details
 * @param {Object} query query elements to find property details
 * @param {Object} updateDetails details to be updated
 */
 function updateProperty(query, updateDetails) {

    let update = {}
    update['$set'] = updateDetails

    let options = {
        new: true,
        // upsert: true
    }
    return propertyDao.findOneAndUpdate(query, update, options)
}

/**
 * Create new notification
 * @param {Object} obj notification object to be created
 */
 function createNotification(obj) {

    return notificationDao.save(obj)
}

/**
 * Get admin notifications
 * @param {Object} query query to fetch notifications received
 */
 function getAllNotifications(query, skip, limit) {

    return notificationDao.findWithPagination(query, parseInt(skip), parseInt(limit))
}

/**
 * Update notification
 * @param {Object} query query to fetch notifications
 * @param {Object} updateObj update notifications details
 */
 function updateNotifications(query, updateObj) {

    let update = {}
    update['$set'] = updateObj
    let options = {
        new: true,
        multi: true
    }
    return notificationDao.update(query, update, options)
}

/**
 * Get unread notification counts
 * @param {Object} query query to find unread notification counts
 */
 function getNotificationCount(query) {

    return notificationDao.count(query)
}



module.exports = {

    getAllUsers,

    getUserDetails,

    createUser,

    updateProfile,

    getAdminDetails,

    createContactUs,

    getServiceDetails,

    getTemplateDetails,

    getProperties,

    getPropertyDetails,

    updateProperty,

    getAllNotifications,

    updateNotifications,

    createNotification,

    getNotificationCount
}
