import express = require("express");
import cors = require("cors");

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json());
app.get("/api/tasks", (_req,res) => {
    res.json([
        {id:1,title: "2", done: false },
        {id:1,title: "2", done: false }
    ])
})


app.listen(PORT, () => {
    console.log(`API server on http://localhost:${PORT}`)
})