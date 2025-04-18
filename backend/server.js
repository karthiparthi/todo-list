const express = require("express");
const mongoose = require("mongoose");
const {modelNames} = require("mongoose");
const app = express();
// connecting mongo

mongoose.connect("mongodb://localhost:27017/my-todo").then((con)=> {
    console.log("the connection connected",con.connection.host);
}).catch((con)=>{
    console.log("the connection not established",con);
}).finally(()=>{
    console.log("this the prompt with mongo end");
});

// creating schema:
const todoSchema = new mongoose.Schema({
   title: String,
   description: String,
   priority: Number,
   status: Boolean
});

// creating model
const todoModel = mongoose.model("Todo", todoSchema)

// update a to-do item
app.put("/todos/:id",async (req, res)=>{
   try {
       const {title, description, priority, isActive} = req.body;
       const id = req.params.id;
       const updatedTodo = await todoModel.findByIdAndUpdate(id,{
           title, description, priority, isActive
       });
       if(!updatedTodo){
           return res.status(404).json({message: "Todo not found"});
       }
       res.json(updatedTodo);
   }catch (e) {
       console.log("error on update",e);
   }
});


app.get("/",(req,res)=>{
    res.send("hello world");
});




app.post("/todos",async (req,res)=>{
   const {title, description, priority} = req.body;
   const newTodo = new todoModel({title, description, priority,isActive:true})
   try {
       await newTodo.save().then(()=> console.log("data saved"));
       res.status(201);

   }catch (e) {
       console.log("error while save",e);
       res.status(500);
   }
   
   
});

const port  = 3000;
app.listen(port, ()=>{
    console.log("server is listening to port: "+ port);
})
