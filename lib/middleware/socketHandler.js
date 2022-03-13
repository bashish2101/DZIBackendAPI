/**
 * @author Mukesh Ratnu
 */
/*#################################            Load modules start            ########################################### */

const ObjectId = require('mongoose').Types.ObjectId
const userDao = require('../modules/user/userDao')
const constants = require('../constants')
const mailHandler = require('./email')

/*#################################            Load modules end            ########################################### */

// Connect Socket Server
function connect(server) {
    const Server = require("socket.io")

    io = Server(server);

    io.sockets.on('connection', (socket) => {
        console.log("Socket Connected", socket.id)
        // socket = soc
        socket.on('setSocketId', (userData) => {

            console.log("Socket connected user data => ", userData)
            let query = {
                _id: userData.id
            }
            let updateObj = {
                socketId: userData.socketId
            }
            userDao.updateProfile(query, updateObj)
        })

        
    })
}

/**
 *  Socket method for new user notification
 * @param {String} socketId socket id of user to send notification 
 */
function emitUserNotification(socketId) {

    io.to(socketId).emit('newUserNotification')

    console.log("User Notification method emitted")
}

/**
 *  Socket method for new admin notification
 * @param {String} socketId socket id of admin to send notification 
 */
function emitAdminNotification() {

    io.emit('newAdminNotification')
    console.log("Admin Notification method emitted")
}

module.exports = {
    connect,

    emitUserNotification,

    emitAdminNotification
}