import { BadRequestError, ConflictException } from "../../Common/Exceptions/error.exception.js"
import { BookModel } from "../../DB/Models/book.model.js"

export const createBook = async(body) => {
    const {title, copies, author} = body

    let errors = []

    if(!title || !copies || !author) {
        errors.push("All fields are required")
    }


    if(title && (title.length < 3 || title.length > 30)) {
        errors.push("Title must be between 3 and 30")
    }

    if(copies && (isNaN(copies) || copies < 0)) {
        errors.push("Copies cannot be negative")
    }

    if(author && (author.length < 3 || author.length > 30)) {
        errors.push("Author must be between 3 and 30")
    }

    if(errors.length > 0) {
        throw BadRequestError({
            message: "Validation Errors",
            options: {cause: {status: 400, errors}}
        })
    }

    const existBook = await BookModel.findOne({author, title})

    if(existBook) {
        throw ConflictException({
            message: "Book Already Exist"
        })
    }

    const book = await BookModel.create({
        title, 
        copies, 
        author
    })

    console.log(book);
    
    return book
}