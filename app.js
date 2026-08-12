const express = require('express')
const socket = require("socket.io")
const http = require("http")
const { Chess } = require("chess.js")

const app = express()
const server = http.createServer(app)

const io = socket(server)

const chess = new Chess()
const path = require("path")
let players = {}
let currentPlayer = "W"
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname,"public")))

app.get("/",(req,res)=>{
    res.render("index.ejs", {
        title: "Chess App",
        appName: "Chess",
        items: ["New game", "Join game", "Leaderboard"]
    })
})
io.on("connection",(uniqueSocket)=>{
    console.log("New user connected")    
    if(!players.white){
        players.white = uniqueSocket.id
        uniqueSocket.emit("playerRole","W")
    } else if(!players.black){
        players.black = uniqueSocket.id
        uniqueSocket.emit("playerRole","B")
    }else {
        uniqueSocket.emit("spectatorRole")
    }

    uniqueSocket.on("disconnect",()=>{
        if(players.white === uniqueSocket.id){
            delete players.white
        } else if(players.black === uniqueSocket.id){
            delete players.black
        }
    })

    uniqueSocket.on("move",(move)=>{
         try{
            if(currentPlayer === "W" && uniqueSocket.id !== players.white){
                uniqueSocket.emit("invalidMove","It's not your turn")
                return
            }
            if(currentPlayer === "B" && uniqueSocket.id !== players.black){
                uniqueSocket.emit("invalidMove","It's not your turn")
                return
            }
            const result = chess.move(move)
            if(result){
                currentPlayer = chess.turn()
                io.emit("move",move)
                io.emit("boardState",chess.fen())
            }
            else {
                uniqueSocket.emit("invalidMove",move)
            }

         }  catch(err){
            console.log(err.message)
            uniqueSocket.emit("invalidMove",err.message)
         }              
    })
    uniqueSocket.on('requestBoard', () => {
        uniqueSocket.emit('boardState', chess.fen())
    })
})
server.listen(3000,()=>{
    console.log("Server is running on port 3000")
})