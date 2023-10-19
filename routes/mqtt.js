const express=require('express');

const router=express.Router();
const connect=require("../mqtt");

router.get('/',connect);

module.exports=router