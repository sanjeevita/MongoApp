const {userModel,bookModel} = require('../models');

exports.getAllUsers = async(req,res)=>{
    const users = await userModel.find();

    if(users.length===0){
        return res.status(404).json({
            success:false,
            message:"no users found"
        })
    }

    res.status(200).json({
        success:true,
        data: users
    })
}

exports.getSingleUserById = async(req,res)=>{
    const {id}=req.params;
    user = await userModel.findById(id);
    if(!user){
        return res.status(404).json({
            success:false,
            message:"user does not exist"
        })
    }
    res.status(200).json({
        success:true,
        data:user
    })
}

exports.deleteUser = async(req,res)=>{
    const {id}=req.params;
    const user = await userModel.deleteOne({
        _id:id,
    })
    if(!user){
        return res.status(404).json({
            success:false,
            message:"user not found"
        })
    }
    return res.status(200).json({
        success:true,
        message:"user has been deleted"
    })
}

exports.addUser = async(req,res)=>{
    const {name, surname,email,subscriptionType,subscriptionDate} =req.body;
      const user = await userModel.create({
        name,
        surname,
        email,
        subscriptionType,
        subscriptionDate
      })

      return res.status(201).json({
          success:true,
          data: user
      })
}

exports.updateUserById = async(req,res)=>{
    const {id}=req.params;
    const {data}=req.body;

    if(!data){
        return res.status(400).json({
            success:false,
            message: "no data provided for user"
        });
    }

    const updatedUser=await userModel.findOneAndUpdate({_id:id},data,{new:true});
    return res.status(200).json({
        success:true,
        data: updatedUser
    })
}

exports.getSubscriptionDetailsById = async(req,res)=>{
    const {id}=req.params;
    const user = await userModel.findById(id).lean();

    if(!user)
        return res.status(404).json({success: false, message: "User With The Given Id Doesn't Exist"});
  
    const getDateInDays = (data = "")=> {
        let date;
        if(data === ""){
            // current Date
            date = new Date();
        }else{
            // getting date on a basis of data variable
            date = new Date(data);
        }
        let days = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
        return days;
    };
  
    const subscriptionType = (date) => {
        if(user.subscriptionType === "Basic"){
            date = date + 90;
        }else if(user.subscriptionType === "Standard"){
            date = date + 180;
        }else if(user.subscriptionType === "Premium"){
            date = date + 365;
        }
        return date;
    };
  
    // Subscription expiration calcus
    // Jan 1, 1970, UTC // milliseconds
    //there are 2 fines: one is if you have missed your returned date-100 and second is if your subscription has expired & still you've not returned- 200
    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate);
  
    const data = {
        ...user,
        subscriptionExpired: subscriptionExpiration < currentDate,
        daysLeftForExpiration: subscriptionExpiration <= currentDate ? 0 : subscriptionDate - currentDate,
        fine: returnDate < currentDate ? (subscriptionExpiration <= currentDate ? 200 : 100) : 0, 
    }


  
     res.status(200).json({
        success: true,
        data: data,
     })
}