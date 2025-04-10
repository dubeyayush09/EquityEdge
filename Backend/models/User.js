const mongoose=require('mongoose');


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true
    },
    watchlist:{
       type:[
        {
            symbol:{type:String},
            name:{type:String},
            close:{type:String},
            change:{type:String},
            percent_change:{type:String}
        }
       ],
        default:[]
    },
    portfolio:{
        type:[{
            symbol:String,
            quantity:Number,
            avgBuyPrice:Number
        }],
        default:[]
    }
},{timestamps:true})
module.exports=mongoose.model('User',userSchema);