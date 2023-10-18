const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5016;


// middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send("Assignment server is running");
})


app.listen(port, () => {
    console.log(`Assignment server running on port: ${port}`)
})

