const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcyrpt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const{JWT_SECRET} = require('../Keys')
const requiredLogin = require('../middleware/requiredLogin')

// router.get('/protected',requiredLogin,(req,res)=>{
//     res.send("Hello User")
// })

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body
    if (!email || !password || !name) {
        res.status(422).json({ error: "Please add all the fields." })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                res.status(422).json({ error: "User already exists with that email.." })
            }
            bcyrpt.hash(password, 12)
                .then((hashedPassword) => {
                    const user = new User({
                        email,
                        password:hashedPassword,
                        name
                    })
                    user.save()
                        .then(user => {
                            res.json({ message: "Saved Successfully" })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })

        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/signin',(req,res)=>{
    const{email,password} = req.body
    if(!email || !password){
      return res.status(422).json({error:"Please provide email & password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
       return res.status(422).json({error:"Invalid User"}) 
        }
        bcyrpt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email} = savedUser
                res.json({token,user:{_id,name,email}})
                // res.send({message:"Successfully Sign in"})
            }
            else{
                return res.status(422).json({error:"Invalid Email or Password"}) 
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})
module.exports = router