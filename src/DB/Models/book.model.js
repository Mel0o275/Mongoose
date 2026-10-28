import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            minLength: [3, "Title must be at least 3 chars"],
            maxLength: [30, "Title must be at most 30 chars"],
            trim: true,
        },

        copies: {
            type: Number,
            required: [true, "Copies is required"],
            min: [0, "Copies cannot be negative"],
            validate: {
                validator: Number.isInteger,
                message: "Copies must be an integer",
            },
        },

        author: {
            type: String,
            required: [true, "Author is required"],
            minLength: [3, "Author must be at least 3 chars"],
            maxLength: [30, "Author must be at most 30 chars"],
            trim: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export const BookModel = mongoose.model("Books", bookSchema);