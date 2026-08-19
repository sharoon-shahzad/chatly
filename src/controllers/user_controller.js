
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
    const { user_name, email, password } = req.body

    if (!user_name || !email || !password) {
        return res.status(400).json({ message: "Username, email and password are required" })
    }
    // check if user already exists
    const existingUser = await User.findOne({ where: { email: email } })

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
        username: user_name,
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

export { registerUser }