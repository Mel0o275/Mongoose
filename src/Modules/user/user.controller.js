import { successResponse } from "../../Common/Utils/Response/success.response.js"
import * as userService from "./user.service.js"
import {Router} from "express"
const router = Router()

router.delete("/:userId", async(req, res) => {
    const result = await userService.deleteUser(req.params.userId)
    successResponse({
        res,
        message: result,
        status: 200
    })
})

router.get("/", async(req, res) => {
    const result = await userService.getAllUsers()
    successResponse({
        res,
        message: result,
        status: 200
    })
})

router.get("/:userId", async(req, res) => {
    const result = await userService.getUserById(req.params.userId)
    return successResponse({
        res,
        message: "User retrieved successfully",
        status: 200,
        data: result
    })
})


export default router