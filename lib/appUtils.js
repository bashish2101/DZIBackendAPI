'use strict';

//========================== Load Modules Start ===========================

var promise = require('bluebird');
var bcrypt = require('bcryptjs');

//========================== Load Modules End =============================

/**
 * returns if email is valid or not
 * @returns {boolean}
 */
function isValidEmail(email) {
    var pattern = /(([a-zA-Z0-9\-?\.?]+)@(([a-zA-Z0-9\-_]+\.)+)([a-z]{2,3}))+$/;
    return new RegExp(pattern).test(email);
}


async function convertPass(password) {
    let pass = await bcrypt.hash(password, 10)
    // req.body.password = pass;
    return pass
}

function verifyPassword(user, isExist) {
    return bcrypt.compare(user.password, isExist.password);
}

const getBeforeOneMonthTimestamp = () => {
    var d = new Date();

    // Set it to one month ago
    d.setMonth(d.getMonth() - 1);
    
    // Zero the time component
    d.setHours(0, 0, 0, 0);
    
    // Get the time value in milliseconds and convert to seconds
    return d.getTime()
}

module.exports = {

    verifyPassword,

    isValidEmail,

    convertPass,

    getBeforeOneMonthTimestamp

}
