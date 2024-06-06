import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		
		jwt.verify(token,process.env.JWT_SECRET, async (err, decodedToken) => {
            if(err){
            console.log(err.message);
            res.redirect('/login');
            }
            else{
                console.log(decodedToken);
                const user = await User.findById(decodedToken.userId).select("-password");

				if (!user) {
					return res.status(404).json({ error: "User not found" });
				}

				req.user = user;

				next();
            }
        })
		
	} catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export default protectRoute;