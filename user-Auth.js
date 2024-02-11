  const express=require('express')
  const app=express()
  const mongoose=require('mongoose')
  const bcrypt=require('bcrypt')
  const jwt=require('jsonwebtoken')
  
  app.use(express.json())

  mongoose.connect('mongodb://127.0.0.1:27017/User-Auth')
  .then(()=>console.log('database connected'))
  const Userschema= new mongoose.Schema({
    email:String,
    password:String,
    name:String,
    age:Number,
    gender:String,
    city:String,
    state:String,
    country:String,
    pincode:Number,
});

 const User=mongoose.model('User',Userschema)
app.post('/register',async(req,res)=>{
    try{
        const{email,password}=req.body
        const hashpassword=await bcrypt.hash(password,10)
       const newuser=await User.create({
        email:email,
        password:hashpassword,
       });
       res.status(201).json({
         status:'success',
         data:{
             newuser,
         }     
    })
    }catch(err){
        res.status(400).json({
            status:'fail',
            message:err
        })
    }
    }
)

app.post('/login',async(req,res)=>{
    try{
        const{email,password}=req.body

        const user=await User.findOne({email:email})
        if(!user){
            return res.status(401).json({
                status:'fail',
                message:'user not found'
                
            })
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(401).json({
                status:'fail',
            })

        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'unlimited'})
        res.status(200).json({
            status:'success',
            data:{
                token
            }
        })

           
    }catch(err){
        res.status(200).json({
            status:'success',
            message:err
        })
    }
      
})
app.get('/users/:id',async(req,res)=>{
    try{
         
        const user=await User.findById(req.params.id)
        res.status(200).json({
            status:'success',
            data:{
                user,
            }
        })
    }catch(err){
        res.status(400).json({
            status:'fail',
            message:err
        })
    }
    })
 app.get('/',async(req,res)=>{
     try{
        const user=await User.find()
        res.status(200).json({
            status:'success',
            data:{
                user,
            }
        })
     }
     catch(err){
         res.status(400).json({
             status:'fail',
             message:err
            })
     }
     
 })   
    app.put('/users/:email',async(req,res)=>{
        try{
          
              email=req.params.email  
             
            const user=await User.findByIdAndUpdate(email,{
                


            })
            res.status(200).json({
                status:'success',
                data:{
                    user,
                }
            })
        }
        catch(err){
            res.status(400).json({
                status:'fail',
                message:err
            })
        }
    })

    app.delete('/users/:id',async(req,res)=>{
        try{
            const {id}=req.params.id
            const user=await User.findByIdAndDelete(id)
            if(!user){
                return res.status(404).json({
                    status:'fail',
                    message:'user not found'
                })
            }
            res.status(200).json({
                status:'success',
                data:{
                    user,

                }
            })
        }
        catch(err){
            res.status(400).json({
                status:'fail',
                message:err

            })
        }
    })



   port=5000,
   app.listen(port,()=>{
       console.log('server is running on port')
   })

   
   
