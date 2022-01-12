/**
 * @author Ashish Bhalodia
 */

let messages = {
    InvalidRegisterDetails: "Please provide the same email address and contact number",
    VerificationCodeSentToBoth: "Your account has been created. Please provide security code sent to your email address and contact number",
    InvalidCredentials: 'Account does not exists',
    internalServerError: 'Internal server error. Please try after some time',
    InvalidDetails: 'Please provide valid details',
    Success: 'Success',
    TOKEN_NOT_PROVIDED: 'Your login session seems to be expired. Please login again',
    InvalidPassword: 'Please provide valid password',
    LoginSuccess: 'Logged in successfully',
    LogoutSuccess: 'Logged out successfully',
    ProfileUpdated: 'Profile updated successfully',
    ResetPasswordMailSent: 'Please check your registered email for further',
    PasswordUpdateSuccess: "Password updated successfully",
    ResetPasswordLinkExpired: "Your reset password link seems to be expired",
    EmailAlreadyExists: 'Email id already exists',
    UserNameAlreadyExists: 'Username already exists',
    EmailResetSuccessful: 'Email address updated successfully',
    RegisteredSuccessfully: 'Registered successfully',
    ContactUsQuerySent: "Your query has been sent successfully",
    ProfileUpdateSuccess: "Profile updated successfully"
}

let codes = {
    FRBDN: 403,
    INTRNLSRVR: 500,
    Success: 200,
    DataNotFound: 404,
    BadRequest: 400,
    ReqTimeOut: 408
}

module.exports = {
    CODE: codes,
    MESSAGE: messages
}