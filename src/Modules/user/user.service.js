import { ObjectId } from "mongodb"
import { UserModel } from "../../DB/Models/user.model.js"

export const deleteUser = async (userId) => {
    const user = await UserModel.findById(userId)

    if (!user) {
        throw NotFoundException({
            message: "User Not Found"
        })
    }

    await UserModel.deleteOne({ _id: userId })

    return "User Deleted Successfully"
}

export const getAllUsers = async () => {
    const users = await UserModel.find()
    return users
}

export const getUserById = async (userId) => {
    if (!ObjectId.isValid(userId)) {
        throw BadRequestError({ message: "Invalid user ID" });
    }

    const user = await UserModel.findOne({
        _id: new ObjectId(userId)
    });

    if (!user) {
        throw NotFoundException({ message: "User not found" });
    }

    return user ;
}
