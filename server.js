
const express=require("express");
const bodyParser=require("body-parser");
const sqlite3=require("sqlite3").verbose();
const path=require("path");

const app=express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"../frontend")));

const db=new sqlite3.Database("./database.db");
db.run("CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,name TEXT,email TEXT,password TEXT)");
db.run("CREATE TABLE IF NOT EXISTS bookings(id INTEGER PRIMARY KEY,email TEXT,destination TEXT,date TEXT)");

app.post("/api/signup",(req,res)=>{
 const {name,email,password}=req.body;
 db.run("INSERT INTO users VALUES(null,?,?,?)",[name,email,password],
  err=>res.json({success:!err})
 );
});

app.post("/api/login",(req,res)=>{
 const {email,password}=req.body;
 db.get("SELECT * FROM users WHERE email=? AND password=?",[email,password],
  (e,row)=>res.json({success:!!row})
 );
});

app.post("/api/book",(req,res)=>{
 const {email,destination,date}=req.body;
 db.run("INSERT INTO bookings VALUES(null,?,?,?)",[email,destination,date],
  ()=>res.json({success:true})
 );
});

app.get("/",(req,res)=>{
 res.sendFile(path.join(__dirname,"../frontend/TravelX.html"));
});

app.listen(5000,()=>console.log("TravelX running at http://localhost:5000"));
