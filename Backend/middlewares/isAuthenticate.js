// import jwt from "jsonwebtoken";

// const isAuthenticate = async (req, res, next)=>{
//     try {
//         if(!token){
//             return res.status(401).json({
//                 message:"User not authenticated",
//                 success: false,
//             })
//         }
//         const decode = await jwt.verify(token, process.env.SECRET_KEY);
//         if(!decode){
//             return res.status(401).json({
//                 message:"Invalid token",
//                 success:false
//             })
//         };
//         req.id = decode.userId;
//         next();
//     } catch (error) {
//         console.log(error);
        
//     }
// }
// export default isAuthenticate;


import jwt from "jsonwebtoken";

const isAuthenticate = async (req, res, next) => {
  try {
    // Get token from cookies OR Authorization header
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);

    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    req.id = decode.userId; // pass userId to next middleware
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Token verification failed",
      success: false,
    });
  }
};

export default isAuthenticate;
