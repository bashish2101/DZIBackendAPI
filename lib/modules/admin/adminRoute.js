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

