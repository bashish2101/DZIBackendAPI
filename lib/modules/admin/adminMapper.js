
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

    let { _id, name, emailId, userName, profilePicture, isLoggedOut, loginActivity } = obj
    return { _id, name, emailId, userName, profilePicture, isLoggedOut, loginActivity }
}



module.exports = {

    responseMapping,

    responseMappingWithData,

    filterAdminResponse

}