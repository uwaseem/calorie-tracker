import { APP } from "./app.js" 


if (process.env.NODE_ENV !== "test") {
    const PORT = Number(process.env.PORT) || 3000

    APP.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}