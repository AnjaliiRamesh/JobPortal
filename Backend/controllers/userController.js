import { User } from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Resgister
export const register = async (req, res)=>{
   try {
     const {fullname, email, phone, password, role} = req.body;
     if(!fullname || !email || !phone || !password || !role){
         return res.status(400).json({
             message:"Missing Details",
             success:false
         });
     };
     let user = await User.findOne({email});
     if(!user){
         return res.status(400).json({
             message: "User does not exist",
             success:false
         })
     }
     const hashedPassword = await bcrypt.hash(password, 10);
 
     await User.create({
         fullname,
         email,
         phone,
         password: hashedPassword,
         role
     });
     return res.status(201).json({
        message:"Account created successfully.",
        success:true
     })

   } catch (error) {
    console.log(error);
    
   }
}


//login controller
export const login = async (req, res)=>{
    try {
        const {email, password, role} = req.body;
         if(!email ||  !password || !role){
         return res.status(400).json({
             message:"Missing Details",
             success:false
         });
     };
     const user = await User.findOne({email});
     if(!user){
          return res.status(400).json({
             message: "User alread exists!!",
             success:false,
         })
     }
const isPasswordMatch = await bcrypt.compare(password, user.password);
if(!isPasswordMatch){
    return res.status(400).json({
             message: "Incorrect email or password",
             success:false,
         })
};
//chexk role is correct or not

if(role != user.role){
    return res.status(400).json({
       message: "Incorrect Role",
       success: false 
    })
};
const tokenData = {
    userId:user._id 
}
const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {expiresIn: '1d'});
user = {
    _id:user._id,
    fullname:user.fullname,
    email:user.email,
    phone:user.phone,
    role:user.role,
    profile:user.profile
}

return res.status(200).cookie("token", token, {maxAge:1*24*60*60*1000, httpsOnly:true, sameSite:'strict'}).json({
 message: `Welcome back ${user.fullname}`,
 user,
 success:true
})
    } catch (error) {
        console.log(error);
        
    }
}


//logout controller

export const logout = async (req,res)=>{
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            message: "Logged out successfully",
        })
    } catch (error) {
        console.log(error);
        
    }
}


//update profile
export const updateProfile = async (req, res)=>{
    try {
        const {fullname, email, phone, bio, skills} = req.body;
        const file = req.file;

     //cloudinary

        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        }
     
     const userId = req.id; //middleware authentication
     let user = await User.findById(userId);

     if(!user){
        return res.status(400).json({
            message:"User not found.",
            success:false
        })
     }
     //updating data
     if(fullname) user.fullname = fullname
     if(email) user.email = email
     if(phone) user.phone = phone
     if(bio) user.profile.bio = fullname
     if(skills) user.profile.skills = skillsArray
     
    

     // resume comes later here...
     await user.save();

     user = {
    _id:user._id,
    fullname:user.fullname,
    email:user.email,
    phone:user.phone,
    role:user.role,
    profile:user.profile
     }

     return res.status(200).json({
        message: "Profile updated suuccessfullly",
        user,
        success:true
     })

    } catch (error) {
        console.log(error);
        
    }
}
