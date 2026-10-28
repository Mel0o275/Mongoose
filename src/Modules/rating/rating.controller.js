import { successResponse } from "../../Common/Utils/Response/success.response.js"
import * as ratingService from "./rating.service.js"
import { Router } from "express"
const router = Router()

router.post("/", async (req, res) => {
    const result = await ratingService.makeRating(req.body)
    successResponse({
        res,
        data: result,
        message: "Rate Created Succssfully",
        status: 201
    })
})

router.put("/:bookId/:userId", async (req, res) => {
        const { bookId, userId } = req.params;
        const { rate } = req.query;

        const result = await ratingService.updateRate(userId, bookId, rate);

        return successResponse({
            res,
            data: result,
            message: "Rate Created Successfully",
            status: 201
        });
});

router.get("/", async (req, res) => {
        const result = await ratingService.getAllRates();

        return successResponse({
            res,
            data: result,
            message: "Rate Fetched Successfully",
            status: 200
        });
});

router.get("/:rateId", async (req, res) => {
        const result = await ratingService.getRateById(req.params.rateId);

        return successResponse({
            res,
            data: result,
            message: "Rate Fetched Successfully",
            status: 200
        });
});

router.get("/book/:bookId", async (req, res, next) => {
    try {
        const result = await ratingService.getRatesByBookId(
            req.params.bookId
        );

        return successResponse({
            res,
            data: result,
            message: "Book ratings fetched successfully",
            status: 200
        });
    } catch (error) {
        next(error);
    }
});

router.get("/book/:bookId/average", async (req, res, next) => {
    try {
        const result = await ratingService.getAverageRateByBookId(
            req.params.bookId
        );

        return successResponse({
            res,
            data: result,
            message: "Book average rating fetched successfully",
            status: 200
        });
    } catch (error) {
        next(error);
    }
});

export default router