import express from 'express';
import { connectDB } from './DB/connection.db.js';
import { globalErrorHandler } from './Middleware/error.middleware.js';
import { PORT } from './Config/config.js';
import { authController, bookController, ratingController, userController } from './Modules/index.js';

await connectDB()

const app = express();
app.use(express.json());

app.use("/auth", authController)
app.use("/user", userController)
app.use("/book", bookController)
app.use("/rate", ratingController)

app.all('/*dummy', (req, res) => {
    console.log("req not found");
    
})

app.use(globalErrorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port :: ${PORT}`);
})