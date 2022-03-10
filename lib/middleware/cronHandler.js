const cron = require('node-cron');
const dao = require('../modules/user/userDao')

const properties = async () => {
    const propertyQuery = {
        status: constants.STATUS.ACTIVE,
        isOpenToSale: "YES"
    }

    const propertyList = await dao.getProperties(propertyQuery)
    propertyList.map(async(propertyData) => {

        var today = new Date(propertyData.propertySaleStartOn);
        today.setHours(today.getHours() + 24);

        if(today.getTime() <= new Date().getTime()){
            if(propertyData.bidPropertyHistory.length > 1){
                let oldPropertyOwner = propertyData.propertyOwner
                propertyData.propertyStatus = "AVAILABLE";
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
        
                oldPropertyOwnerDetails.properties=oldPropertyOwnerDetails.properties.filter((obj) => obj.propertyId != propertyData._id)
        
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
                
            }else{
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
    console.log('running at every 10 mins');
    properties()
});

