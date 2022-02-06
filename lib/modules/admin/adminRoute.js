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

module.exports = router

