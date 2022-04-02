/**
 * @author Ashish Bhalodia
 */
/*#################################            Load modules start            ########################################### */

const router = require("express").Router();
const facade = require('./adminFacade')
const mapper = require('./adminMapper')
const admConst = require('./adminConstants')
const validators = require('./adminValidators')

/*#################################            Load modules end            ########################################### */

// ADMIN PROFILE APIs

router.route('/login').post([validators.checkLoginRequest], (req, res) => {

    let details = req.body
    facade.login(details).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError))
    })
})

router.route('/logout/:id/:activityId').get([validators.checkToken], (req, res) => {

    let { id, activityId } = req.params

    facade.logout(id, activityId).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError))
    })
})

router.route('/getProfile/:id').get([validators.checkToken], (req, res) => {

    let { id } = req.params

    facade.getProfile(id).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError))
    })
})

router.route('/updateProfile/:id').put([validators.checkToken, validators.checkUpdateProfileRequest], (req, res) => {

    let { id } = req.params
    let details = req.body

    facade.updateProfile(id, details).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError))
    })
})

router.route('/forgotPassword').post([validators.checkForgotPasswordRequest], (req, res) => {

    let { emailId } = req.body

    facade.forgotPassword(emailId).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError))
    })
})

router.route('/setNewPassword/:redisId').post([validators.checkSetNewPasswordRequest], (req, res) => {

    let { redisId } = req.params
    let { password } = req.body

    facade.setNewPassword(redisId, password).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError))
    })
})

router.route('/resetPassword/:id').post([validators.checkToken, validators.checkResetPasswordRequest], (req, res) => {

    let { id } = req.params
    let { oldPassword, newPassword } = req.body

    facade.resetPassword(id, oldPassword, newPassword).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError))
    })
})

router.route('/countForDashboard/:id').get([validators.checkToken], (req, res) => {

    let { id } = req.params
    
    facade.countForDashboard(id).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError))
    })
})

router.route('/getAllUsers/:id').post([validators.checkToken], (req, res) => {

    let { id } = req.params
    let queryParams = req.query
    let filters = req.body

    facade.getAllUsers(id, queryParams, filters).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError))
    })
})

router.route('/deleteUser/:id/:userId').delete([validators.checkToken], (req, res) => {

    let { id, userId } = req.params

    facade.deleteUser(id, userId).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError))
    })
})

// EMAIL TEMPLATE APIs

router.route('/getAllTemplateEntities/:id').get([validators.checkToken], (req, res) => {

    let { id } = req.params

    facade.getAllTemplateEntities(id).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError))
    })
})

router.route('/createTemplate/:id').post([validators.checkToken, validators.checkCreateTemplateRequest], (req, res) => {

    let { id } = req.params
    let templateDetails = req.body

    facade.createTemplate(id, templateDetails).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError))
    })
})

router.route('/getAllTemplates/:id').get([validators.checkToken], (req, res) => {

    let { id } = req.params
    let queryParams = req.query

    facade.getAllTemplates(id, queryParams).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError))
    })
})

router.route('/getTemplateDetails/:id/:templateId').get([validators.checkToken], (req, res) => {

    let { id, templateId } = req.params

    facade.getTemplateDetails(id, templateId).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError))
    })
})

router.route('/updateTemplate/:id/:templateId').put([validators.checkToken, validators.checkUpdateTemplateRequest], (req, res) => {

    let { id, templateId } = req.params
    let templateDetails = req.body

    facade.updateTemplate(id, templateId, templateDetails).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError))
    })
})

router.route('/deleteTemplate/:id/:templateId').delete([validators.checkToken], (req, res) => {

    let { id, templateId } = req.params
    facade.deleteTemplate(id, templateId).then((result) => {

        res.send(result)
    }).catch((err) => {
        r
        console.log({ err })
        res.send(mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError))
    })
})

router.route('/createProperty/:id').post([validators.checkToken], (req, res) => {

    let { id } = req.params
    let details = req.body

    facade.createProperty(id, details).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError))
    })
})

router.route('/getAllProperties/:id').post([validators.checkToken], (req, res) => {

    let { id } = req.params
    let queryParams = req.query
    let filters = req.body

    facade.getAllProperties(id, queryParams, filters, filters.userId).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError))
    })
})

router.route('/updateProperty/:id/:propertyId').put([validators.checkToken], (req, res) => {

    let { id, propertyId } = req.params
    let details = req.body

    facade.updateProperty(id, propertyId, details).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError))
    })
})

router.route('/deleteProperty/:id/:propertyId').delete([validators.checkToken], (req, res) => {

    let { id, propertyId } = req.params
    
    facade.deleteProperty(id, propertyId).then((result) => {

        res.send(result)
    }).catch((err) => {

        console.log({ err })
        res.send(mapper.responseMapping(admConst.CODE.INTRNLSRVR, admConst.MESSAGE.internalServerError))
    })
})


module.exports = router

