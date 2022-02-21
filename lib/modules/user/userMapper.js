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

    let { _id, name, emailId, userName, contactNumber, profilePicture, createdAt, isLoggedOut, loginActivity, isPasswordReset, avatar } = obj
    return { _id, name, emailId, userName, contactNumber, profilePicture, createdAt, isLoggedOut, loginActivity, isPasswordReset, avatar }
}


module.exports = {

    responseMapping,

    responseMappingWithData,

    filteredUserResponseFields
}