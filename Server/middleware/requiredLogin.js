const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../Keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports =(req,res,next)=>{
    // authorization === Bearer hhfjhfhugehrghhefbnbrjhthtjtj
    const{authorization} = req.headers
    if(!authorization){
      return res.status(401).json({error:"You must be logged in1"})
    }
   const token =  authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET,(err,payLoad)=>{
        if(err){
          return res.status(401).json({error:"You must be logged in2"})
        }
        const{_id} = payLoad
        User.findById(_id).then(userData=>{
            req.user = userData
            next();
        })
        
    })
}