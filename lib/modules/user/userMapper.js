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

function filteredUserResponseFields(obj) {

    let { _id, name, emailId, userName, contactNumber, profilePicture, createdAt, isLoggedOut, loginActivity, isPasswordReset } = obj
    return { _id, name, emailId, userName, contactNumber, profilePicture, createdAt, isLoggedOut, loginActivity, isPasswordReset }
}


module.exports = {

    responseMapping,

    responseMappingWithData,

    filteredUserResponseFields
}