
import jwt from 'jsonwebtoken'
import User from '../models/user_model.js'


const verifyJWT = (async (req, res, next) => {
    console.log("verifyJWT middleware called")
    console.log("req.cookies", req.headers)


    //! grab access token from cookie 
    const token = req.cookies?.accessToken || req.headers?.authorization?.replace("Bearer ", "")

    if (!token) {
        return res.status(401).json({
            message: "Access token not found"
        })
    }
    //! verify access token
    try {
        const decodeToken = await jwt.verify(token, process.env.JWT_SECRET)

        // find the user by extracting the info from decoded token
        //based on PK

        const user = await User.findByPk(decodeToken.user_id)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        req.user = user

        next();
    } catch (error) {
        console.log("error verifying access token", error)
        return res.status(401).json({
            message: "Invalid access token"
        })
    }
})

export {
    verifyJWT
}