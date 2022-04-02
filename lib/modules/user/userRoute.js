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

router.route("/contactUsInquiry").post([validators.checkContactUsRequest], (req, res) => {
    let details = req.body;

    facade
        .contactUsInquiry(details)
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

router
    .route("/getProperties/:id")
    .get([validators.checkToken], (req, res) => {
        let { id } = req.params;
        
        facade
            .getProperties(id)
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

router
    .route("/addToCart/:id/:propertyId")
    .get([validators.checkToken], (req, res) => {
        let { id, propertyId } = req.params;

        facade
            .addToCart(id, propertyId)
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

router
    .route("/getCartProperties/:id")
    .get([validators.checkToken], (req, res) => {
        let { id } = req.params;
        let queryParams = req.query;

        facade
            .getCartProperties(id, queryParams)
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

router
    .route("/markAsFavouriteProperty/:id/:propertyId")
    .get([validators.checkToken], (req, res) => {
        let { id, propertyId } = req.params;

        facade
            .markAsFavouriteProperty(id, propertyId)
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

router
    .route("/deletePropertyCart/:id")
    .post([validators.checkToken], (req, res) => {
        let { id, propertyId } = req.params;
        let { properties } = req.body;

        facade
            .deletePropertyCart(id, properties)
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

router
    .route("/getUserProperties/:id")
    .post([validators.checkToken], (req, res) => {
        let { id } = req.params;
        let details = req.body;

        facade
            .getUserProperties(id, details)
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


router
    .route("/buyProperties/:id")
    .post([validators.checkToken], (req, res) => {
        let { id } = req.params;
        let { properties } = req.body;

        facade
            .buyProperties(id, properties)
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

router
    .route("/sellProperties/:id")
    .post([validators.checkToken], (req, res) => {
        let { id } = req.params;
        let  properties  = req.body;

        facade
            .sellProperties(id, properties)
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

    router
    .route("/getFavouriteProperties/:id")
    .get([validators.checkToken], (req, res) => {
        let { id } = req.params;
       
        facade
            .getFavouriteProperties(id)
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


router
    .route("/makeBid/:id/:propertyId/:amount")
    .get([validators.checkToken], (req, res) => {
        let { id, propertyId, amount } = req.params;

        facade
            .makeBid(id, propertyId, amount)
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

router
    .route("/getPropertiesCount/:id")
    .post([validators.checkToken], (req, res) => {
        let { id } = req.params;
        let details = req.body;

        facade
            .getPropertiesCount(id, details)
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

    router
    .route("/getPropertiesInfo/:id/:hexID")
    .get([validators.checkToken], (req, res) => {
        let { id, hexID } = req.params;

        facade
            .getPropertiesInfo(id, hexID)
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

router
    .route("/addAvatar/:id")
    .post([validators.checkToken], (req, res) => {
        let { id } = req.params;
        let details = req.body;

        facade
            .addAvatar(id, details)
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

router
    .route("/deleteAvatar/:id/:avatarID")
    .delete([validators.checkToken], (req, res) => {
        let { id, avatarID } = req.params;
        
        facade
            .deleteAvatar(id, avatarID)
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

router
    .route("/updateProperty/:id/:propertyId")
    .put([validators.checkToken], (req, res) => {
        let { id, propertyId } = req.params;
        let details = req.body;

        facade
            .updateProperty(id,propertyId, details)
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

router
    .route("/getUserPropertiesStats/:id")
    .get([validators.checkToken], (req, res) => {
        let { id } = req.params;

        facade
            .getUserPropertiesStats(id)
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

router
    .route("/getDashboardDetails/:id")
    .post([validators.checkToken], (req, res) => {
        let { id } = req.params;

        facade
            .getDashboardDetails(id)
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

router.route('/getAllNotifications/:id').get([validators.checkToken], (req, res) => {

        let { id } = req.params
        let queryParams = req.query
    
        facade.getAllNotifications(id, queryParams).then((result) => {
    
            res.send(result)
        }).catch((err) => {
    
            console.log({ err })
            res.send(mapper.responseMapping(usrConst.CODE.INTRNLSRVR, usrConst.MESSAGE.internalServerError))
        })
})



module.exports = router

