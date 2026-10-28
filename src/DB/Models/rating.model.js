import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
    {
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Books",
            required: [true, "BookID is required"],
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "UserID is required"],
        },

        rate: {
            type: Number,
            required: [true, "Rate is required"],
            min: [0, "Rate must be at least 0"],
            max: [5, "Rate must be at most 5"],
            validate: {
                validator: Number.isInteger,
                message: "Rate must be an integer",
            },
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

ratingSchema.index(
    { bookId: 1, userId: 1 }, // 1 asc, -1 dec
    { unique: true }
);

export const RatingModel = mongoose.model("Rating", ratingSchema)