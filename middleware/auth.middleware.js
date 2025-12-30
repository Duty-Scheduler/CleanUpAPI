import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

export const protectedRoute = async (req,res,next) => {
    let accessToken = req.accessToken;
    if(!accessToken){
        return res.status(400).json({
            message: "Missing AccessToken"
        });
    }
    try {
        decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        const user = User.findByPk(decoded.userId);
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in auth.middleware.js");
        return res.status(401).json({
            message: "Invalid AccessToken"
        })
    }
}