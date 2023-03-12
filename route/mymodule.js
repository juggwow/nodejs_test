const express = require('express')
const Product = require('../models/products')
const router = express.Router()
//เรียกใช้งาน โมเดล

//อัปโหลดไฟล์
const multer = require('multer')

const storage = multer.diskStorage({
    destination:function(req,file,cb)
    {
        cb(null,'./public/images/products') //เลือกตำแหน่งเก็บไฟล์
    },
    filename:function(req,file,cb)
    {
        cb(null,Date.now()+file.originalname) //เปลี่ยนชื่อไฟล์
    }
})

//เริ่มต้น อัปโหลด
const upload = multer({
    storage:storage
})

router.get('/',(req,res)=>{    
    Product.find({}).then((docs)=>{res.render('index.ejs',{products:docs})})
})

//แสดงรายละเอียด
router.get('/product/:id',(req,res)=>{    
    const product_id = req.params.id
    Product.findOne({_id:product_id}).then((doc)=>{
        console.log(doc)
        res.render('productpage.ejs',{product:doc})})
})

//แสดงแบบฟอร์มเพิ่มข้อมูล
router.get('/form',(req,res)=>{
    if(req.session.login) res.render('form.ejs')
    else res.render('404.ejs',{textres: "กรุณาเข้าสู่ระบบ"})
})

//แสดงหน้าล็อกอิน
router.get('/log-in',(req,res)=>{
    res.render('admin.ejs')
})

//แสดงตารางเพื่อลบ แก้ไขรายละเอียด
router.get('/manage',(req,res)=>{
    if(req.session.login) Product.find({}).then((docs)=>{res.render('manage.ejs',{products:docs})})
    else res.render('404.ejs',{textres: "กรุณาเข้าสู่ระบบ"})
})

//ส่งแบบฟอร์มเพื่อทำการเพิ่มข้อมูล
router.post('/insertForm',upload.single("images"),(req,res)=>{
    if(req.session.login) 
    {
        let doc = new Product({
            name:req.body.name,
            price:req.body.price,
            image:req.file.filename,
            description:req.body.description
        }).save()
        res.render('form.ejs')
    }
    else res.render('404.ejs',{textres: "กรุณาเข้าสู่ระบบ"})
    
})

//ลบข้อมูล
router.get('/delete/:id',(req,res)=>{
    if(req.session.login) 
    {
        Product.findByIdAndDelete(req.params.id,{useFindAndModicy:false}).exec().then(()=>{
            res.redirect('/manage')})
    }
    else res.render('404.ejs',{textres: "กรุณาเข้าสู่ระบบ"})
})

//แสดงแบบฟอร์มแก้ไขข้อมูล
router.post('/update',(req,res)=>{
    if(req.session.login) 
    {
        const product_id = req.body.edit_id
        Product.findOne({_id:product_id}).then((doc)=>{
        res.render('update.ejs',{product:doc})})
    }
    else res.render('404.ejs',{textres: "กรุณาเข้าสู่ระบบ"})
})

//รับข้อมูลเข้าสู่ระบบ
router.post('/log-in-submit',(req,res)=>{
    console.log(req.body)
    const username = req.body.username
    const password = req.body.password
    const timeExpire = 10000

    if(username === 'admin' && password === 'admin')
    {
        req.session.username = username
        req.session.password = password
        req.session.login = true
        req.session.cookie.maxAge = timeExpire
        res.redirect('/')
    }
    else res.render('404',{textres:" เข้าสู่ระบบไม่สำเร็จ"})
})

//ส่งแบบฟอร์มเพื่อทำการอัปเดทข้อมูล
router.post('/updateForm',(req,res)=>{
    if(req.session.login) 
    {
        const update_id = req.body._id
        let doc = {
            name:req.body.name,
            price:req.body.price,
            description:req.body.description
        }
        Product.findByIdAndUpdate(update_id,doc,{useFindAndModicy:false}).exec().then(()=>{
            res.redirect('/manage')
    })
    }
    else res.render('404.ejs',{textres: "กรุณาเข้าสู่ระบบ"})
})

// router.get('/product/:id',(req,res)=>{

// })
module.exports = router