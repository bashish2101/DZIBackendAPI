
/**
 * @author Ashish Bhalodia
 */

function responseMapping(code, msg) {
    return {
        responseCode: code,
        responseMessage: msg
    }
}

function responseMappingWithData(code, msg, data) {
    return {
        responseCode: code,
        responseMessage: msg,
        responseData: data
    }
}


function filterAdminResponse(obj) {

    let { _id, name, emailId, userName, contactNumber, profilePicture, isLoggedOut, loginActivity } = obj
    return { _id, name, emailId, userName, contactNumber, profilePicture, isLoggedOut, loginActivity }
}

function filteredUserFields(obj) {

    let { _id, name, emailId, userName, contactNumber, profilePicture, isLoggedOut, status, loginActivity } = obj
    return { _id, name, emailId, userName, contactNumber, profilePicture, isLoggedOut, status, loginActivity }
}

function filterAllowedTemplateFields(templateDetails) {

    return {
        _id, mailName, mailTitle, mailBody, mailSubject, notificationMessage
    } = templateDetails
}

function filterTemplateUpdateFields(templateDetails) {

    return {
        mailTitle, mailBody, mailSubject, notificationMessage
    } = templateDetails
}


module.exports = {

    responseMapping,

    responseMappingWithData,

    filterAdminResponse,

    filteredUserFields,

    filterAllowedTemplateFields,

    filterTemplateUpdateFields

}