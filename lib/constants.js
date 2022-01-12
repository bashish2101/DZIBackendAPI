const STATUS = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE"
}

const USER_ACCOUNT_TYPE = {
    NORMAL: "NORMAL",
    GOOGLE: "GOOGLE"
}

const THIRD_PARTY_SERVICES = {
    MAIL_GATEWAY: 'MAIL_GATEWAY'
}

const DB_MODEL_REF = {
    USERS: 'users',
    ADMINS: 'admins',
    CONTACT_US: 'contactus',
    THIRD_PARTY_SERVICE: 'thirdpartyservices',
    EMAILTEMPLATES: 'emailtemplates',
}

const TEMPLATE_TYPES = {
    'EMAIL': 'EMAIL',
    'NOTIFICATION': 'NOTIFICATION',
}

const CODE = {
    Success: 200,
    FRBDN: 403,
    INTRNLSRVR: 500,
    DataNotFound: 404,
    BadRequest: 400,
}

const EMAIL_TEMPLATES = {
    'CONTACT_US_QUERY': 'New contact-us query',
    'USER_FORGOT_PASSWORD': 'User: Forgot password',
    'USER_RESET_PASSWORD': 'User: Reset password',
}

module.exports = Object.freeze({

    DB_MODEL_REF,

    STATUS,

    CODE,

    USER_ACCOUNT_TYPE,

    THIRD_PARTY_SERVICES,

    TEMPLATE_TYPES,

    EMAIL_TEMPLATES

});