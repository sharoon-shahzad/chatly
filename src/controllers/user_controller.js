
import { Op } from "sequelize";
import User from "../models/user_model.js";
import bcrypt from "bcrypt";



const registerUser = (async (req, res) => {
    // algo for registering user
    // user enter email , password and hit URL
    // api/v1/user/register - > backend server
    //  take the user data from req.body
    // check user data against edge cases (validation)
    // not empty 
    //if user already exits : username  , email

    // hash user plain password 
    // create user in db 
    // remove password and refresh token fields

    console.log(req.body)
    const { username, email, password } = req.body
    const normalizedUsername = username?.trim().toLowerCase()

    if (!normalizedUsername || !email || !password) {
        return res.status(400).json({ message: "Username, email and password are required" })
    }
    // check if user already exists
    const existingUser = await User.findOne({
        where: {
            [Op.or]: [
                { username: normalizedUsername },
                { email: email }
            ]
        }
    })

    if (existingUser) {
        return res.status(409).json({
            message: "User already exist"
        })
    }

    //!  at this point sequelize trigger the beforeSave() hook and password will be hash

    //? custom implementation of hashing  just incase
    const salts = 10
    const hashedPassword = await bcrypt.hash(password, salts)

    console.log("hashedPassword", hashedPassword)

    const newUser = await User.create({
        username: normalizedUsername,
        email: email,
        password: hashedPassword

    })

    console.log("newUser created", newUser)

    const userResponse = {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at
    }
    return res.status(201).json({ user: userResponse })



})


const loginUser = (async (req, res) => {
    //!algo for logging in user
    //* user enter email and password and hit URL 
    //* extract the data from body
    //*validate user email and pass(empty)
    //* check the user exist in db ( pass or email)
    //* now from db compare the hashed password with password user entered during login 
    //* if password is correct then 
    //* generate JWT token 
    //* store refresh token
    //* send access token to client - store in cookie 


    try {

        const { email, password,username } = req.body
        const normalizedUsername = username

        if ((!email && !normalizedUsername) || !password) {
            return res.status(400).json({
                message: "Username or email and password are required"
            })
        }
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email },
                    { username: normalizedUsername }
                ]
            }
        })

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "user dont exist/wrong password"
            })
        }

        const accessToken = await user.generateAccessToken()

        const refreshToken = await user.generateRefreshToken()

        user.refresh_token = refreshToken
        await user.save();


        const loggedInUser = user.toJSON()
        delete loggedInUser.password
        delete loggedInUser.refresh_token

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                message: "user logged in successfully",
                user: loggedInUser,
                accessToken
            })
    } catch (error) {
        console.log("error logging in user", error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }

})

const logoutUser = (async (req, res, next) => {

    //! problem is  just like for for other request (api end point) we get the data send from user and we can get the data from that , but incase of logout but we dont have any data except the cookies that are been sent with each HTTP REQUEST(httponly-cookie)

    //!algo for logging out user
    //! this process is done in verifyJWT midddleware
    //* user hit logout button
    //* extract info from user request through cookies for browers and http-headers ( bearer) for mobile and other clients
    //* invalidate jwt token 
    //* remove data from cookies
    //* return response

    //! Middle now can intercept the req and extract the info from decoded token and send req.user = user in active db instance and next() is called which contain particular user

    //! my plan
    //! extract user from req.user and set refresh token to null and save the user instance in db
    //! remove cookies from client browser and send response
    const user = req.user


    
    user.refresh_token = null

    await user.save()

    // 4. Wipe cookies from the client browser and send the response

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 0, // Set the cookie to expire immediately
    }


    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json({ message: "User logged out successfully" });




})

export { registerUser, loginUser, logoutUser }