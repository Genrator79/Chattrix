import User from "../models/Users.js"
import jwt from "jsonwebtoken"
import { upsertStreamUser } from "../database/stream.js"
import bcrypt from "bcryptjs";

export async function signup(req, res){
    const {email, password, fullName} =req.body;
    try{
    if(!email || !password || !fullName){
        return res.status(400).json({
            message: "All fields are required"
        });
    };

    if(password.length < 8){
        return res.status(400).json({
            message: "Password must be at least 8 characters"
        });
    };

    // need to understand

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid email format"
        });
    };

    const existingUser = await User.findOne({email});

    if(existingUser){
        return res.status(400).json({
            message: "Email already exists, please use a diffrent one"
        });
    };

    // const idx = Math.floor(Math.random() * 50) + 1;
    // const randomAvatar = `https://Avatars-Placeholder/`; //link not working
    const randomAvatar = "https://imgv3.fotor.com/images/blog-cover-image/10-profile-picture-ideas-to-make-you-stand-out.jpg"

    const newUser = await User.create({
        fullName,
        email,
        password,
        profilePic : randomAvatar,
    });
    try{
        await upsertStreamUser ({
            id: newUser._id.toString(),
            name: newUser.fullName,
            image: newUser.profilePic || "",
        });
        console. log (`Stream user created for ${newUser.fullName}`);
    }
    catch(error){
        console. log("Error creating Stream user:", error);
    }

    const token = jwt.sign(
        {userId : newUser._id},
        process.env.JWT_SECRET_KEY, 
        {expiresIn : "1d"}
    );

    res.cookie("token",token,{
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // prevent XSS attacks,
        sameSite: "strict", // prevent CSRF attacks
        secure: process.env.NODE_ENV === "production"
    });

    res.status(201).json({success: true, user: newUser});

    }
    catch(error){
    console. log("Error in signup controller", error);
    res.status(500).json({ message:"Internal Server Error" });
    }
};


export async function login(req, res){
    try{
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({message: "All fields are required" });
        };

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        };

        const isPasswordCorrect = await user.matchPassword(password);

        if(!isPasswordCorrect){
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
    

        const token = jwt.sign(
        {userId : user._id},
        process.env.JWT_SECRET_KEY, 
        {expiresIn : "1d"}
        );

        res.cookie("token",token,{
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevent XSS attacks,
            sameSite: "strict", // prevent CSRF attacks
            secure: process.env.NODE_ENV === "production"
        });

        res.status(200).json({success: true, user});
    }
    catch(error){
        console.log("Error in login controller", error); 
        res.status(500).json({ message: "Internal Server Error"});
    }
};


export function logout(req, res){
    res.clearCookie("token");
    res.status(200).json({success: true, message: "Logout successful"});
};


export async function onboard(req,res){
    try{
        const userId = req.user._id;
        const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body;

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean),
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded : true,
        },{new :true})

        if(!updatedUser) return res.status(404).json({message: "User not found" });

        try{
            await upsertStreamUser ({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || "",
            });
            console.log(`Stream userdata updated for ${updatedUser.fullName}`);
        }
        catch(error){
            console.log("Error updating Stream user during onboarding:",error);
        }

        res.status(200).json({ success: true, user: updatedUser});

    }
    
    catch(error){
        console.error("Onboarding error:", error);
        res.status(500).json({message: "Error in onBoarding"})
    }
}