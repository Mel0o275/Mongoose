import { successResponse } from "../../Common/Utils/Response/success.response.js"
import * as authService from "./auth.service.js"
import {Router} from "express"
const router = Router()

router.post("/signup", async(req, res) => {
    const result = await authService.signUp(req.body)
    successResponse({
        res,
        data: result,
        message: "User Created Succssfully",
        status: 201
    })
})

router.post("/login", async(req, res) => {
    const result = await authService.login(req.body)
    successResponse({
        res,
        data: result,
        message: "User Logged in Succssfully",
        status: 200
    })
})


export default router