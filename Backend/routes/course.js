const express=require('express')
const router=express.Router()
const courseController=require('../controller/course')
const userAuthentication=require('../middleware/auth')

// EXPENSE ROUTES

router.post('/add-course',userAuthentication.authenticate,courseController.addCourses)
router.get('/get-course',userAuthentication.authenticate,courseController.getCourses)
router.get('/day-progress',userAuthentication.authenticate,courseController.getDaylyProgress)
router.get('/month-progress',userAuthentication.authenticate,courseController.getMonthlyProgress)
router.delete('/delete-course/:id',userAuthentication.authenticate,courseController.deleteCourse)


module.exports=router         
