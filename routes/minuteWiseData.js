const express=require('express');

const router=express.Router();
const { sequelize,MinuteData}=require('../models');



const StoreData = async(req,res) =>{
    try {
        const { running, cash,vended } = req.body;
        // console.log(req.body);
        // Create a new user in the database
        const record = await MinuteData.create({machines_running:running,cashCollected:cash,items_vend:vended});
        console.log(record);
        res.status(201).json(record);
      } catch (error) {
        console.error(error);
        // res.status(500).json({ message: 'Internal server error' });
      }
       
    
}


const GetData=async(req,res)=>{
  try{
    const data=await MinuteData.findAll();
    res.status(200).json(data);
  }
  catch(err){
    console.log(err);
    res.status(505).json(err)
  }
  

}


router.get('/',GetData);
router.post('/',StoreData);




module.exports=router