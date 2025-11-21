import { User } from "../models/usermodel.js";
import bcrypt from "bcryptjs";

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
     const user = await User.findOne({email});
     if(user){
         return res.status(400).json({
             message: "User alread exists!!",
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
