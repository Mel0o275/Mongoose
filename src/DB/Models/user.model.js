import mongoose from "mongoose";
import { genderEnum } from "../../Common/Enums/gender.enum.js";

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "FirstName is required"],
        minLength: [3, "FirstName must be greater than 3 chars"],
        maxLength: [1000, "FirstName must be less than 30 chars"],
    },

    lastName: {
        type: String,
        required: [true, "LastName is required"],
        minLength: [3, "LastName must be greater than 3 chars"],
        maxLength: [30, "LastName must be less than 30 chars"],
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [3, "Password must be greater than 3 chars"],
        maxLength: [30, "Password must be less than 30 chars"],
    },

    gender: {
        type: String,
        enum: Object.values(genderEnum),
        default: genderEnum.Male
    }
},
{
    timestamps: true,
    toJSON: {virtuals: true}, // to see it in response
    toObject:{virtuals: true} // to see it in code
})

userSchema.virtual("fullName").set(function (value) {
    const [firstName, lastName] = value.split(" ") || []
    this.set({firstName, lastName})
}).get(function () {
    return this.firstName + " " + this.lastName
})

export const UserModel = mongoose.model("User", userSchema)