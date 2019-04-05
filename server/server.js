const express=require('express');
const mongoose = require('mongoose');
var bodyParser=require('body-parser');
const _=require('lodash');
const {User}=require('./models/user');
const {Expense}=require('./models/spend');
mongoose.Promise=global.Promise;
mongoose.connect("mongodb://localhost:27017/Spending-Tracker",{ useNewUrlParser: true });

var app=express();
app.use(bodyParser.json());


//routes for user database
app.post('/users',(req,res)=>{
var user=new User({
    name:req.body.name,
    email:req.body.email,
    phone:req.body.phone,
    password:req.body.password,
    });
user.save().then((user)=>{
var expense=new Expense({
    _id:user._id
});
expense.save().then((expense)=>{
    res.send(user);
})
}).catch((e)=>{
    console.log(e);
});
});

app.get('/user/:id',(req,res)=>{
    var id=req.params.id;
    if(mongoose.Types.ObjectId(id)){
        User.findOne({_id:id}).then((user)=>{
            if(!user)
            return res.status(404).send();
            res.send({user});
        }).catch((e)=>{
            res.send("Error 400");
        });
    }
});

//routes for expenses
//route to post an expense detail
app.post('/expenses/:id',(req,res)=>{
    var id=req.params.id;
    if(mongoose.Types.ObjectId(id)){
        Expense.findOne({_id:id}).then((user)=>{
            var expense={
                description:req.body.description,
                money_spent:req.body.money_spent,
                date:new Date()
                };
        user.spend_detail=user.spend_detail.concat(expense);
        user.save().then((expense)=>{
            res.send(expense);
        });
    }).catch((e)=>{
        console.log("Invalid user");
    });
    }
    });

    //route to get an expense detail of a user
    app.get('/expense/:id1/:id2',(req,res)=>{
        var userid=req.params.id1;
        var expenseid=req.params.id2;
        if(!mongoose.Types.ObjectId.isValid(userid) || !mongoose.Types.ObjectId.isValid(expenseid)){
            return  res.status(404).send();
        }
        Expense.findOne({_id:userid},
            {spend_detail:{$elemMatch:{_id:expenseid}}
         }).then((expense)=>{
           res.send(expense);
        }).catch((e)=>{
            console.log(e);
        });
        });

//route to delete an expense of a user
app.delete('/expense/:id1/:id2',(req,res)=>{
var userid=req.params.id1;
var expenseid=req.params.id2;
if(!mongoose.Types.ObjectId.isValid(userid) || !mongoose.Types.ObjectId.isValid(expenseid)){
    return  res.status(404).send();
}
Expense.findById(userid).then((expense)=>{
   expense.removeSpent_Detail(expenseid).then(()=>{
    res.status(200).send();
},()=>{
res.status(400).send();
   });
}).catch((e)=>{
    console.log(e);
});
});

//route to get all the expenses of a user
app.get('/expense/:id',(req,res)=>{
    var id=req.params.id;
    Expense.findOne({_id:id}).then((user)=>{
        res.send(user);
    }).catch((e)=>{
        console.log("No user found");
    });
});

//route to update an expense detail
app.patch('/expense/:id1/:id2',(req,res)=>{
    var userid=req.params.id1;
    var body=_.pick(req.body,['description','money_spent']);
    var expenseid=req.params.id2;
    if(!mongoose.Types.ObjectId.isValid(userid) || !mongoose.Types.ObjectId.isValid(expenseid)){
        return  res.status(404).send();
    } 
    Expense.updateOne({_id:userid,
        'spend_detail._id':expenseid
     },{$set:{'spend_detail.$.description':body.description,
              'spend_detail.$.money_spent':body.money_spent}}).then((exp)=>{
        res.status(200).send(exp);
    }).catch((e)=>{
        console.log('Unable to Update');
    });
});

app.listen(3000,()=>{
    console.log("started at port 3000");
});