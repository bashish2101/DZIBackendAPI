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
    ProfileUpdateSuccess: "Profile updated successfully",
    PropertyAlreadyExistsInCart: "Property already exists into the cart",
    BidMustBeGreater: "Bid must be greater than current one",
    BidAddedSuccess: "Bid Added Successfully",
    MustBeActionedProperty: "Property is not Auctioned",
    CartEmpty: "Cart is Empty",
    MarkAsFavouriteSuccess: "Property has been mark as favourite successfully",
    MarkAsFavouriteSuccessRemove: "Property has been mark as unfavourite successfully",
    FavouriteAlreadyExists: "You have already mark as favourite this property",
    PropertyRemoveCart: "Property has been successfully removed from the cart",
    PropertyAddedCart: "Property has been successfully added to the cart",
    PropertyBoughtSuccess: "Properties bought successfully",
    AvatarAddedSuccess: "Avatar added successfully",
    AvatarDeletedSuccess: "Avatar deleted successfully",
    PropertySoldSuccess: "Properties are available for sale successfully"
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