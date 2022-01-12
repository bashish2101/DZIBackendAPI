/**
 * @author Ashish Bhalodia
 */
/*#################################            Load modules start            ########################################### */

const router = require("express").Router();
const facade = require('./userFacade');
const validators = require('./userValidators');
const usrConst = require('./userConstants');
const mapper = require('./userMapper');

/*#################################            Load modules end            ########################################### */

router.route("/signup").post([validators.checkSignupRequest], (req, res) => {
    let details = req.body

    facade
        .signup(details)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log({ err });
            res.send(
                mapper.responseMapping(
                    usrConst.CODE.INTRNLSRVR,
                    usrConst.MESSAGE.internalServerError
                )
            );
        });
});

router.route("/login").post([validators.checkLoginRequest], (req, res) => {
    let details = req.body;

    facade
        .login(details)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log({ err });
            res.send(
                mapper.responseMapping(
                    usrConst.CODE.INTRNLSRVR,
                    usrConst.MESSAGE.internalServerError
                )
            );
        });
});

router.route("/googleLogin").post((req, res) => {
    let details = req.body;

    facade
        .googleLogin(details)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log({ err });
            res.send(
                mapper.responseMapping(
                    usrConst.CODE.INTRNLSRVR,
                    usrConst.MESSAGE.internalServerError
                )
            );
        });
});

router.route("/contactUs").post([validators.checkContactUsRequest], (req, res) => {
    let details = req.body;

    facade
        .contactUs(details)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log({ err });
            res.send(
                mapper.responseMapping(
                    usrConst.CODE.INTRNLSRVR,
                    usrConst.MESSAGE.internalServerError
                )
            );
        });
});

router
    .route("/forgotPassword")
    .post([validators.checkForgotPasswordRequest], (req, res) => {
        let { emailId } = req.body;

        facade
            .forgotPassword(emailId)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                console.log({ err });
                res.send(
                    mapper.responseMapping(
                        usrConst.CODE.INTRNLSRVR,
                        usrConst.MESSAGE.internalServerError
                    )
                );
            });
    });

router
    .route("/setNewPassword/:redisId")
    .post([validators.checkSetNewPasswordRequest], (req, res) => {
        let { redisId } = req.params;
        let { password } = req.body;

        facade
            .setNewPassword(redisId, password)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                console.log({ err });
                res.send(
                    mapper.responseMapping(
                        usrConst.CODE.INTRNLSRVR,
                        usrConst.MESSAGE.internalServerError
                    )
                );
            });
    });

router
    .route("/getProfileDetails/:id")
    .get([validators.checkToken], (req, res) => {
        let { id } = req.params;

        facade
            .getProfileDetails(id)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                console.log({ err });
                res.send(
                    mapper.responseMapping(
                        usrConst.CODE.INTRNLSRVR,
                        usrConst.MESSAGE.internalServerError
                    )
                );
            });
    });

router
    .route("/updateProfile/:id")
    .put([validators.checkToken], (req, res) => {
        let { id } = req.params;
        let details = req.body;

        facade
            .updateProfile(id, details)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                res.send(
                    mapper.responseMapping(
                        usrConst.CODE.INTRNLSRVR,
                        usrConst.MESSAGE.internalServerError
                    )
                );
            });
    });

module.exports = router

