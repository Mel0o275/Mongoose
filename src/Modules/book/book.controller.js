import { successResponse } from "../../Common/Utils/Response/success.response.js"
import * as bookService from "./book.service.js"
import {Router} from "express"
const router = Router()

router.post("/", async(req, res) => {
    const result = await bookService.createBook(req.body)
    successResponse({
        res,
        data: result,
        message: "Book Created Succssfully",
        status: 201
    })
})

export default router