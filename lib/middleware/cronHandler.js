const cron = require('node-cron');
const dao = require('../modules/user/userDao')
const ObjectId = require('mongoose').Types.ObjectId
const constants = require('../constants')
const socketHandler = require("./socketHandler")

const properties = async () => {
    const propertyQuery = {
        status: "ACTIVE",
        isOpenToSale: "YES",
        propertyStatus: {$ne: "SOLD"}
    }

    const propertyList = await dao.getProperties(propertyQuery)
    propertyList.map(async(propertyData) => {
        console.log({propertySaleStartOn:propertyData.propertySaleStartOn})
        var today = new Date(propertyData.propertySaleStartOn);
        today.setHours(today.getHours() + 24);

        if(today.getTime() <= new Date().getTime()){ 
            if(propertyData.bidPropertyHistory.length > 0){
                let oldPropertyOwner = propertyData.propertyOwner
                propertyData.propertyStatus = "SOLD";
                propertyData.currentBid = "";
                propertyData.currentBidBy = "";
                let highestBid = Math.max.apply(Math, propertyData.bidPropertyHistory.map(function(o) { return o.amount; }))
                propertyData.propertyOwner = highestBid.userId;
                propertyData.propertyBoughtAmount = highestBid.amount;
                propertyData.isOpenToSale = "NO";
                propertyData.propertySoldOn = new Date().getTime()
        
                let newPropertyOwner = highestBid.userId
        
                let query = {
                    _id: ObjectId(propertyData._id)
                }
                
                await dao.updateProperty(query, propertyData)
        
        
        
                let oldOwnerQuery = {
                    _id: ObjectId(oldPropertyOwner)
                }
        
                let oldPropertyOwnerDetails = await dao.getUserDetails(oldOwnerQuery)
        
                if(oldPropertyOwnerDetails.properties && oldPropertyOwnerDetails.properties.length > 0){
                    oldPropertyOwnerDetails.properties=oldPropertyOwnerDetails.properties.filter((obj) => obj.propertyId != propertyData._id)    
                }
                
                oldPropertyOwnerDetails.soldProperties=oldPropertyOwnerDetails.soldProperties.push({
                    propertyId: propertyData._id,
                    soldAt: new Date().getTime()
                })
                
                dao.updateProfile(oldOwnerQuery, oldPropertyOwnerDetails)
        
        
                let newOwnerQuery = {
                    _id: ObjectId(newPropertyOwner)
                }
        
                let newPropertyOwnerDetails = await dao.getUserDetails(newOwnerQuery)
        
                newPropertyOwnerDetails.properties=newPropertyOwnerDetails.properties.push({
                    propertyId: propertyData._id,
                    boughtAt: new Date().getTime()
                })
                
                dao.updateProfile(newOwnerQuery, newPropertyOwnerDetails)

                  // Create bell notification

               
                  let notificationMessage = `You successfully bought ${propertyData.propertyName}`
  
                  let notificationObject = {
                      message: notificationMessage,
                      isRead: false,
                      receiverId: newPropertyOwner,
                      createdAt: new Date().getTime(),
                      status: constants.STATUS.ACTIVE,
                      categoryType: constants.NOTIFICATION_CATEGORIES.BOUGHT_SUCCESS,
                      refId: propertyData._id,
                  }
                  await dao.createNotification(notificationObject)
                  await socketHandler.emitUserNotification(newPropertyOwnerDetails.socketId)
                
            }else{

                // Create bell notification

                let userDetails = await dao.getUserDetails(propertyData.propertyOwner)
               
                let notificationMessage = constants.NOTIFICATION_MESSAGE.NoBidNotification

                let notificationObject = {
                    message: notificationMessage,
                    isRead: false,
                    receiverId: propertyData.propertyOwner,
                    createdAt: new Date().getTime(),
                    status: constants.STATUS.ACTIVE,
                    categoryType: constants.NOTIFICATION_CATEGORIES.NO_BID,
                    refId: propertyData._id,
                }
                await dao.createNotification(notificationObject)
                await socketHandler.emitUserNotification(userDetails.socketId)
                

                //send notification/email to user if there is no bid
                propertyData.propertySaleStartOn="";
                propertyData.isOpenToSale = "NO";
    
                let query = {
                    _id: ObjectId(propertyData._id)
                }
                
                await dao.updateProperty(query, propertyData)
            }
    
        }        
    })
}

// Schedule tasks to be run on the server.
cron.schedule('*/10 * * * *', function() {
    console.log('Cron running at every 10 mins');
    properties()
});

