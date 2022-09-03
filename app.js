//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema= new mongoose.Schema({
  name:String,
});
const Item=mongoose.model("Item",itemsSchema);

const item1 =new Item({
  name:"welcome to  your todo list ",
});
const item2=new Item({
  name:"hit the + button to add a new item."
});
const item3=new Item({
  name:"<-- hit this to dlete an item."
});


const defaultItems=[item1,item2,item3];
const listSchema={
  name:String,
  items:[itemsSchema],
}
const List =mongoose.model("List",listSchema)


app.get("/", function(req, res) {

  Item.find({},(err,docs)=>{
    if ( docs.length === 0 ){
        Item.insertMany(defaultItems,(err)=>{
            if (err){
              comsole.log(err)
            }else{
              console.log("successfully saved default itemsto DB")
            }
            res.redirect("/");
      });       
    }else{
      res.render("list", {listTitle: day, newListItems: docs});
    }
  });

const day = date.getDate();

  

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const addedItem = new Item({
    name:itemName,
  })
  addedItem.save();

  res.redirect('/')
});
app.post('/delete', function (req, res) {
  const checkedItemId=req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, (err)=>{
    if(err){
      console.log(err)
    }else{
      console.log("deleted item in db  successfully")
    }
    res.redirect('/')
  });
})

app.get('/:customList', (req, res) => {
  const customListName=req.params.customList
  List.findOne({name:customListName},(err,foundList)=>{
    if(!err){
      if(!foundList){
        //create a new list
        console.log("not found ")
        const list =new List({
          name:customListName,
          items:defaultItems
        })
        list.save()
        res.redirect('/'+customListName)
        console.log("List Created successfully")
      }else{
        //render the sxisting list
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
        console.log("found")
      };
    }
  })
  // res.render("list", {listTitle: customListName, newListItems: });
})

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
