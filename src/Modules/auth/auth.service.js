import { BadRequestError, ConflictException, NotFoundException } from "../../Common/Exceptions/error.exception.js"
import { UserModel } from "../../DB/Models/user.model.js"

export const signUp = async(body) => {
    const {firstName, lastName, email, password, gender} = body

    let errors = []

    if(!firstName || !lastName || !email || !password) {
        errors.push("All fields are required")
    }


    if(firstName && (firstName.length < 3 || firstName.length > 30)) {
        errors.push("FirstName must be between 3 and 30")
    }

    if(lastName && (lastName.length < 3 || lastName.length > 30)) {
        errors.push("LastName must be between 3 and 30")
    }

    if(password && (password.length < 3 || password.length > 30)) {
        errors.push("Password must be between 3 and 30")
    }

    if(email && !email.includes("@")) {
        errors.push("Email must be a valid email")
    }

    if(errors.length > 0) {
        throw BadRequestError({
            message: "Validation Errors",
            options: {cause: {status: 400, errors}}
        })
    }

    const existUser = await UserModel.findOne({email})

    if(existUser) {
        throw ConflictException({
            message: "Email Already Exist"
        })
    }

    const user = await UserModel.create({
        firstName,
        lastName,
        email,
        password,
        gender
    })

    console.log(user);
    
    return user
}

export const login = async(body) => {
    const {email, password} = body

    const exist = await UserModel.findOne({email, password})

    if(!exist) {
        throw NotFoundException({
            message: "User Not Found"
        })
    }

    return exist
}

