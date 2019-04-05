const mongoose=require('mongoose');
var spendSchema=mongoose.Schema({
    _id:{
        type:mongoose.Schema.Types.ObjectId
    },
    spend_detail:[{
        description:{
            type:String,
            required:true,
            minlength:1,
            trim:true
        },
        money_spent:{
            type:Number,
            required:true
        },
        date:{
            type:Date,
            default:null
        }
}]
});
spendSchema.methods.removeSpent_Detail=function(id){
    var expense=this;
    return expense.updateOne({
      $pull:{
        spend_detail:{_id:id}
      }
    });
  };
//   spendSchema.methods.updateSpent_Detail=function(id,body){
//     var expense=this;
//     return expense.update({_id:id},{$set:{
//         description:body.description,
//         money_spent:body.money_spent,
//         }});
//   };
var Expense=mongoose.model("Expense",spendSchema);
module.exports={Expense};

//add owe and lend feature later
//add this to schema
// ,owe_detail:[{
//   description:{
//       type:String,
//       required:true,
//       minlength:1,
//       trim:true
//   },
//   money:{
//       type:Number,
//       required:true
//   },
//   date:{
//       type:Date,
//       default:null
//   },
//   lenderid:{
//     type:mongoose.Schema.Types.ObjectId
//   }
// }],lend_detail:[{
//   description:{
//       type:String,
//       required:true,
//       minlength:1,
//       trim:true
//   },
//   money:{
//       type:Number,
//       required:true
//   },
//   date:{
//       type:Date,
//       default:null
//   },
//   borrowerid:{
//     type:mongoose.Schema.Types.ObjectId
//   }
// }]