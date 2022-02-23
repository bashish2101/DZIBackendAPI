const STATUS = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE"
}

const USER_ACCOUNT_TYPE = {
    NORMAL: "NORMAL",
    GOOGLE: "GOOGLE"
}

const PROPERTY_TYPE = {
    RESIDENTIAL: "RESIDENTIAL",
    OFFICE: "OFFICE",
    HOTEL: "HOTEL",
    MUSEUM: "MUSEUM",
    SHOP: "SHOP",
}

const PROPERTY_STATUS = {
    AVAILABLE: "AVAILABLE",
    AUCTIONED: "AUCTIONED",
    KILLED: "KILLED",
    MONUMENT: "MONUMENT",
    HOT_PROPERTY: "HOT_PROPERTY",
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
    PROPERTY: 'properties'
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
    'ADMIN_FORGOT_PASSWORD': 'Admin: Forgot password',
    'USER_RESET_PASSWORD': 'User: Reset password',
    'ADMIN_RESET_PASSWORD': 'Admin: Reset password',
}

const TEMPLATE_ENTITIES = [
     {
        'templateName': 'User: Forgot password',
        'templateEntities': ['fullName', 'redisId']
    }, {
        'templateName': 'Admin: Forgot password',
        'templateEntities': ['fullName', 'redisId']
    }, {
        'templateName': 'User: Reset password',
        'templateEntities': ['fullName', 'date', 'device', 'browser', 'ipaddress', 'country', 'state']
    }, {
        'templateName': 'Admin: Reset password',
        'templateEntities': ['fullName', 'date', 'device', 'browser', 'ipaddress', 'country', 'state']
    }, {
        'templateName': 'New contact-us query',
        'templateEntities': ['name', 'userEmailId', 'contactNumber', 'message']
    }]

module.exports = Object.freeze({

    DB_MODEL_REF,

    STATUS,

    CODE,

    USER_ACCOUNT_TYPE,

    THIRD_PARTY_SERVICES,

    TEMPLATE_TYPES,

    EMAIL_TEMPLATES,

    TEMPLATE_ENTITIES,

    PROPERTY_TYPE,

    PROPERTY_STATUS

});