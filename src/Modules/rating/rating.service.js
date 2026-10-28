import mongoose, { isValidObjectId } from "mongoose";
import { RatingModel } from "../../DB/Models/rating.model.js";
import { UserModel } from "../../DB/Models/user.model.js";
import { BookModel } from "../../DB/Models/book.model.js";
import { BadRequestError, ConflictException, NotFoundException } from "../../Common/Exceptions/error.exception.js";

export const makeRating = async (body) => {
    const { userId, bookId, rate } = body;

    const errors = [];

    if (!userId || !bookId || rate === undefined || rate === null) {
        errors.push("All fields are required");
    }

    if (userId && !mongoose.isValidObjectId(userId)) {
        errors.push("Invalid User ID");
    }

    if (bookId && !mongoose.isValidObjectId(bookId)) {
        errors.push("Invalid Book ID");
    }

    if (
        rate !== undefined &&
        rate !== null &&
        (!Number.isInteger(Number(rate)) ||
            Number(rate) < 0 ||
            Number(rate) > 5)
    ) {
        errors.push("Rate must be an integer between 0 and 5");
    }

    if (errors.length > 0) {
        throw BadRequestError({
            message: "Validation Errors",
            options: { cause: { status: 400, errors } }
        });
    }

    const user = await UserModel.findById(userId)
    const book = await BookModel.findById(bookId)

    if (!user) {
        throw BadRequestError({
            message: "User not found"
        });
    }

    if (!book) {
        throw BadRequestError({
            message: "Book not found"
        });
    }

    const existRating = await RatingModel.findOne({ userId, bookId });

    if (existRating) {
        throw ConflictException({
            message: "You have already submitted a rate"
        });
    }

    const rating = await RatingModel.create({
        userId,
        bookId,
        rate: Number(rate)
    });

    console.log(rating);

    return rating

};

export const updateRate = async (userId, bookId, rate) => {
    if (userId && !mongoose.isValidObjectId(userId)) {
        throw NotFoundException({ message: "UserID must be a valid ID" });
    }

    if (bookId && !mongoose.isValidObjectId(bookId)) {
        throw NotFoundException({ message: "BookID must be a valid ID" });
    }

    if (
        rate !== undefined &&
        rate !== null &&
        (!Number.isInteger(Number(rate)) ||
            Number(rate) < 0 ||
            Number(rate) > 5)
    ) {
        throw BadRequestError({ message: "Rate must be between 0 and 5" });
    }

    const user = await UserModel.findById(userId)
    const book = await BookModel.findById(bookId)

    if (!user) {
        throw BadRequestError({
            message: "User not found"
        });
    }

    if (!book) {
        throw BadRequestError({
            message: "Book not found"
        });
    }

    const existRating = await RatingModel.findOne({ userId, bookId });

    if (!existRating) {
        throw ConflictException({
            message: "You have not submitted a rate"
        });
    }

    const rating = await RatingModel.updateOne(
        { userId, bookId },
        { $set: { rate: Number(rate) } }
    );

    console.log(rating);

    return rating
}

export const getAllRates = async () => {
    const ratings = await RatingModel.find()
        .select("-__v -createdAt -updatedAt")
        .populate("userId", "firstName lastName email -_id")
        .populate("bookId", "title author copies -_id");

    return ratings;
};

export const getRateById = async (rateId) => {
    const rating = await RatingModel.findById(rateId)
        .populate("userId", "firstName lastName email")
        .populate("bookId", "title author copies");

    return rating;
};

export const getRatesByBookId = async (bookId) => {
    if (!mongoose.isValidObjectId(bookId)) {
        throw BadRequestError({ message: "Invalid Book ID" });
    }

    const book = await BookModel.findById(bookId);

    if (!book) {
        throw NotFoundException({ message: "Book not found" });
    }

    const ratings = await RatingModel.find({ bookId })
        .select("-__v -createdAt -updatedAt")
        .populate("userId", "firstName lastName email");

    return ratings;
};

// export const getAverageRateByBookId = async(bookId) => {
//     if(!isValidObjectId(bookId)) {
//         throw BadRequestError({
//             message: "Invalid BookID"
//         })
//     }

//     const book = await BookModel.findById(bookId)

//     if(!book) {
//         throw NotFoundException({
//             message: "Book Does not exist"
//         })
//     }

//     const ratingsForBook = await RatingModel.find({bookId})

//     const rating = {
//         5: 0,
//         4: 0,
//         3: 0,
//         2: 0,
//         1: 0
//     }

//     let totalRating = 0
//     ratingsForBook.forEach(rate => {
//         totalRating += rate.rate
//         rating[rate.rate]++
//     });
//     const rateCounter = ratingsForBook.length

//     console.log(totalRating, rateCounter);

//     const avgRating = totalRating > 0 ? Number((totalRating/rateCounter).toFixed(2)) : 0 // returns string
    
//     console.log(avgRating, rating);

//     return {
//         rateCounter,
//         avgRating,
//         rating
//     }
// }

const countRate = (rate) => ({
    $size: {
        $filter: {
            input: "$rating",
            as: "rating",
            cond: { $eq: ["$$rating", rate] }
        }
    }
});

export const getAverageRateByBookId = async(bookId) => {
    if(!isValidObjectId(bookId)) {
        throw BadRequestError({
            message: "Invalid BookID"
        })
    }

    const book = await BookModel.findById(bookId)

    if(!book) {
        throw NotFoundException({
            message: "Book Does not exist"
        })
    }

    const result = await RatingModel.aggregate([
        {
            $match: {
                bookId: new mongoose.Types.ObjectId(bookId) // return matching rating with this BookID
            }
        },
        {
            $group: {
                _id: "$bookId",
                avgRating: { $avg: "$rate" },
                rateCounter: { $sum: 1 },

                rating: {
                    $push: "$rate" // returns array that contains this field
                }
            }
        },
        {
            $project: {
                _id: 0,
                avgRating: {$round: ["$avgRating", 2]},
                rateCounter: 1,

                ratingCounts:
                {
                5: countRate(5),
                4: countRate(4),
                3: countRate(3),
                2: countRate(2),
                1: countRate(1)
            }
            }
        }
    ]);

    return result[0] || {
        avgRating: 0,
        rateCounter: 0,
        rating: {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        }
    };
}

