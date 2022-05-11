const express = require('express');
const res = require('express/lib/response');
const { json } = require('express/lib/response');
const dataService = require('./services/data.services')
const cors=require('cors')
const app = express()
const jwt = require('jsonwebtoken')

app.use(cors({
    origin:'http://localhost:4200'
}))


app.listen(3000, () => {
    console.log("Server started at 3000")
})

// to parse json data
app.use(express.json())


// Resolving API calls
// GET to read data
app.get('/', (req, res) => {
    res.send("GET REQUEST")
})
// POST to create data 
app.post('/', (req, res) => {
    res.send("POST REQUEST")
})
// PATCH to partially update 
app.patch('/', (req, res) => {
    res.send("PATCH REQUEST")
})
// DELETE to delete data
app.delete('/', (req, res) => {
    res.send("DELETE REQUEST")
})
// PUT to update or modify instruction
app.put('/', (req, res) => {
    res.send("PUT REQUEST")
})

// jwt middleware
const jwtMiddleware = (req, res, next) => {
    try {
        const token = req.headers["x-access-token"]
        const data = jwt.verify(token, 'supersecret123456789')
        req.currentAcno = data.currentAcno
        next()
    }
    catch {
        res.status(401).json({
            status: false,
            message: "Pls Login...."
        })
    }
}

// Register API

app.post('/register', (req, res) => {
    // asynchronous
    dataService.register(req.body.uname, req.body.acno, req.body.password)
        .then(result => {
            res.status(result.statusCode).json(result)
        })

})
// Login API
app.post('/login', (req, res) => {
    // asynchronous
    dataService.login(req.body.acno, req.body.pswd)
        .then(result => {
            res.status(result.statusCode).json(result)
        })

})

// Deposit API
app.post('/deposit', jwtMiddleware, (req, res) => {

    dataService.deposit(req.body.acno, req.body.pswd, req.body.amount)
        .then(result => {
            res.status(result.statusCode).json(result)
        })

})

// Withdraw API
app.post('/withdraw', jwtMiddleware, (req, res) => {
 dataService.withdraw(req, req.body.acno, req.body.pswd, req.body.amount)
 .then(result=>{
    res.status(result.statusCode).json(result)
})
 })
    

// Transaction API
app.post('/transaction', jwtMiddleware, (req, res) => {
    dataService.transaction(req.body.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
    
})

// 
app.delete('/onDelete/:acno',jwtMiddleware,(req,res)=>{

    dataService.deleteAcc(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})