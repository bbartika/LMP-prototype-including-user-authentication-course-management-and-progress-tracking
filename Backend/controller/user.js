const User=require('../model/user')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
require('dotenv').config();



function generateAccessToken(id,name){
    return jwt.sign({userid:id,username:name},'secretkey')
}


function isStringInvalid(string){
    if(string===undefined || string.length===0){
        return true
    }
    else{
        return false
    }
}


exports.signUp=async(req,res,next)=>{
    try{
        const {name,email,password}=req.body
        
        if(isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)){
            return res.status(400).json({error:"something is missing"})
        }

        const saltRounds=10
        const hash = await bcrypt.hash(password, saltRounds);

        const user= new User({name:name,email:email,password:hash})
        await user.save()

        res.status(200).json("record inserted correctly")


    }catch(err){
        res.status(404).json({error:err })

    }
   
}

exports.logIn = async (req, res, next) => {
    try {
        const{useremail,userpassword}  = req.body

        if(isStringInvalid(useremail) || isStringInvalid(userpassword) ){
            return res.status(400).json({error:"something is missing"})
        }

        const user = await User.findOne({email: useremail } );
        // console.log("user",user)

        if (user) {
            const passwordMatch = await bcrypt.compare(userpassword, user.password);
            if (passwordMatch) {
                res.status(200).json({ message: "User logged in successfully",token:generateAccessToken(user.id,user.name)});
            } else {
                res.status(400).json({ error: 'Invalid password' });
            }
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}      
