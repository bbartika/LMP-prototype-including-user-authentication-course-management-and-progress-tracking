const Course=require('../model/course')
const User=require('../model/user')

function isStringNotValid(string){
    if(string===undefined || string.length===0){
        return true
    }
    else{
        return false
    }
}



exports.addCourses=async(req,res)=>{
    const user=req.user
    const userId=req.user._id
    
    try{
        const{name,description,fee}=req.body
        if(isStringNotValid(name) || isStringNotValid(description) || isStringNotValid(fee)){
            return res.status(400).json({error:"something is missing"})

        }
        const currentDate=new Date()
        const day=currentDate.getDate()
        const month=currentDate.getMonth()+1
        const year=currentDate.getFullYear()
     
        const course= new Course({day,month,year,name,description,fee,userId})
        await course.save()
        
        const totalAmount=Number(user.totalFees)+Number(fee)

         
         await User.updateOne({_id:userId},{ 
            
            $set:{ totalFees:totalAmount
           }})


        res.status(200).json(course)
    }catch(err){

        res.status(500).json({error:err})
    }

}

exports.getCourses=async (req,res)=>{
    try {
        const page = Number(req.query.page) || 1;
        const itemsPerPage= Number(req.query.coursePerPage);
        // console.log(itemsPerPage)
    
        const userId = req.user._id;
        
    
        const courses = await Course.find({userId:userId})
          .skip((page - 1) * itemsPerPage)
          .limit(itemsPerPage)
        
    
        
        const totalCount = await Course.countDocuments({userId:userId});
    
        const lastPage = Math.ceil(totalCount / itemsPerPage);
    
        res.status(200).json({
          courses:courses,
          pagination:{
            currentPage: page,
            hasNextPage: page < lastPage-1,     //In a typical pagination system, pages are numbered sequentially starting from 1 for the first page, 2 for the second page, and so on. Therefore, to find the page number of the previous page, we subtract 1 from the current page number.
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,              //However, it's worth noting that if the current page number is already 1 (indicating the first page), subtracting 1 would result in a page number of 0, which doesn't correspond to a valid page number in the pagination sequence. In such cases, the UI may handle this scenario by either disabling the "previous page" button or not displaying it at all, indicating that there is no previous page available.
            lastPage:lastPage

          }
          
        });
      } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve courses' });
      }
    }


exports.deleteCourse=async(req,res)=>{
    try{
        const user=req.user
    const id=req.params.id

    const course=await Course.findOneAndDelete({_id:id})
    console.log(course)
    if(!course){
        return res.status(404).json({ error: 'Expense not found' });
    }
    const totalAmount=Number (user.totalFees) - Number(course.fee)
    await User.updateOne({_id:user.id},{
       $set:{ totalFees:totalAmount
    }})
    
    return res.status(200).json({message:'Successfully deleted the course'})
    }catch(err){
        res.status(500).json({error:err})
    }

}

exports.getDaylyProgress = async (req, res) => {
    try {
        const user = req.user;
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        const dailyCourses = await Course.find({ userId: user._id, day, month, year });
        if (dailyCourses.length > 0) {
            res.status(200).json({ message: `You have ${dailyCourses.length} courses today.` });
        } else {
            res.status(200).json({ message: 'No courses for today.' });
        }
        
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

exports.getMonthlyProgress=async(req,res)=>{
    try{
        const { month, year } = req.query;
        const user = req.user;

        const monthlyCourses = await Course.find({ userId: user._id, month, year });
        if (monthlyCourses.length > 0) {
            res.status(200).json({ message: `You have ${monthlyCourses.length} courses this month.` });
        } else {
            res.status(200).json({ message: 'No courses for this month.' });
        }



    }catch (err) {
        res.status(500).json({ error: err });
    }
}   
