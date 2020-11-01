const express = require('express');
const app = express();
app.use(express.json());
const joi = require('joi');
const data = require("./Lab3-timetable-data.json");
const low = require('lowdb');
const filesync = require('lowdb/adapters/filesync');
const adapter = new filesync('schedule_database.json');
const db = low(adapter);
app.use(express.static('Public')); 


// Database defaults
db.defaults({schedules: []})
.write()



/*app.get('/api/schedules/load/:schedule_id', (res,req) => {
    const data = req.params.schedule_id;
    const sched_array = db.get('schedules').map('schedule_id').value

    for (i=0; i < sched_array.length; i++) {
        if (sched_array[i] == data) {
            var ref_num = i;
        }
    }

    const sched_list = db.get('schedules[' + ref_num + '].schedule_information').map().value();

    if (sched_list.length>0){
        return res.status(200).send(
            sched_list
        );
    }

    else {
        return res.status(200).send({
            message: "No course"
        });
    }

});

app.get('/api/schedules/check', (req,res) => {
    const CurrentData = req.query;
    const sched_name = CurrentData.schedule;
    const crs_code = CurrentData.course_code;
    sched_array= db.get('schedules').map('schedule_id').value();

    for (i=0; i<sched_array.length; i++){
        if (sched_array[i] == sched_name){
            var ref_num = i;
        }
    }
    

    course_array = db.get('schedules[' + ref_num + '].schedule_information').map().value();

    for (i=0; i < course_array.length; i++){
        if (course_array[i].course_code == crs_code){
         return res.status(20).send({
                message: "Exists"
        });
        }
    }

    return res.status(200).send({
        message: "Course does not exists"
    });
});

app.post('/api/schedules/addcourse', (req,res) => {
    const CurrentData = req.query;
    const sched_name = CurrecntData.schedule;
    const course_name = CurrentData.course_name;
    const sbj_code = CurrentData.subject_code;
    const crs_code = CurrentData.course_code;

    sched_array= db.get('schedules').map('schedule_id').value();

    for(i=0; i< sched_array.length; i++){
        if(sched_array[i] == sched_name){
            var ref_num = i;
            db.get('schedules[' + ref_num + ').schedule_information').push({course_name, subject_code: sbj_code, course_code: crs_code})
            return res.status(200).send({
                message: "Course Added"
            });
        }
    }

    return res.status(400).send({
        message: "Error Adding course"
    });

});




app.get('/api/schedules/dropdown', (req,res) => {
    let name_array = [];
    name_array = db.get('schedules').map('schedule_id').value();
    res.send(name_array);
});*/

app.get('/api/courses/submit' , (req,res) => {
    FinalQuery = req.query;
    SubjectQuery = FinalQuery.Subject;
    ComponentQuery = FinalQuery.Component;
    CourseNumberQuery = FinalQuery.CourseNumber;
    ClassNameQuery = FinalQuery.ClassName;
    var allstored = [];

    if (SubjectQuery == "Subject" && CourseNumberQuery == "" && ComponentQuery== "Component" && ClassNameQuery == "ClassName"){
        res.send("Too many results to display. Please Narrow Search fields.")
    }
    else if (SubjectQuery != "Subject" && CourseNumberQuery != "" && ComponentQuery != "Component" &&  ClassNameQuery != "ClassName"){
         allstored = [];
        for(i=0; i<data.length;i++){
    
            if(SubjectQuery == data[i].subject && CourseNumberQuery == data[i].catalog_nbr && ComponentQuery== data[i].course_info[0].ssr_component &&  ClassNameQuery == data[i].className){
             
                allstored.push(data[i]);

            }
        } res.send(allstored);
    } 
    else if (SubjectQuery != "Subject" && CourseNumberQuery != "" && ComponentQuery == "Component" &&  ClassNameQuery == "ClassName"){
         allstored = [];
        for(i=0 ; i<data.length; i++){
            if(SubjectQuery == data[i].subject && CourseNumberQuery == data[i].catalog_nbr){
                allstored.push(data[i]);
            }
        } res.send(allstored);
    }
    else if (SubjectQuery != "Subject" && CourseNumberQuery != "" && ComponentQuery != "Component" &&  ClassNameQuery == "ClassName"){
         allstored = [];
        for(i=0 ; i<data.length; i++){
            if(SubjectQuery == data[i].subject && CourseNumberQuery == data[i].catalog_nbr && ComponentQuery == data[i].course_info[0].ssr_component ){
                allstored.push(data[i]);
            }
        } res.send(allstored);

    }
    else if (SubjectQuery != "Subject" && CourseNumberQuery == "" && ComponentQuery == "Component" &&  ClassNameQuery == "ClassName"){
         allstored = [];
        for(i=0 ; i<data.length; i++){
            if(SubjectQuery == data[i].subject){
                allstored.push(data[i]);
           } 
        }
    }
});








//1
function removeDuplicates(Array){
    return Array.filter((a,b) => Array.indexOf(a) === b)
};

app.get('/api/courses', (req,res) => {
    let SubjectArray = [];
    for(i=0; i< data.length; i++){
        SubjectArray[i] = data[i].subject;
    }
    

    SubjectArray = removeDuplicates(SubjectArray);

    let ClassArray = [];
    for(j=0; j< data.length; j++){
        ClassArray[j] = data[j].className;
    }
    

    ClassArray = removeDuplicates(ClassArray);
    res.send({"SubjectArray": SubjectArray,"ClassArray": ClassArray});

    

   
        
});

//2
app.get('/api/courses/search/:subjectcode', (req,res) => {
    let subjectcode = req.params.subjectcode;
    let NumberArray = [];
    for(k=0; k< data.length; k++){
        if (subjectcode == data[k].subject){
            NumberArray.push(data[k].catalog_nbr);
        }
        
    }
    
    NumberArray = removeDuplicates(NumberArray);
    if(NumberArray.length <= 0){
        res.status(404).send("Subject code does not exist");
    }else {
        res.send(NumberArray);
    }

    
});

//3
app.get('/api/courses/search/:subjectcode/:coursecode', (req,res) => {

    const NoComponent = joi.object({
        component:joi.string().max(5).required()
    })
    const RESULT3 = NoComponent.validate(req.query);
    if (RESULT3.error){
        res.status(400).send("Bad Query");
        return; 

    }

    const WithComponent = joi.object({
        component:joi.string().max(5).required()
    })
    const RESULT4 = WithComponent.validate(req.query);
    if (RESULT4.error){
        res.status(400).send("Bad Query");
        return; 

    }
    let subjectcode = req.params.subjectcode;
    let coursecode = req.params.coursecode;
    let component = req.query.component;
    
    for(o=0; o< data.length; o++){
        if (subjectcode == data[o].subject && coursecode == data[o].catalog_nbr){
            if(!component){
                res.send(data[o]);
                return;

            }
            else if(component == data[o].course_info[0].ssr_component){
                res.send(data[o]);
                return;

            }

        }
        
    }

    res.status(404).send("not found");
    

    
});

//4
app.post('/api/schedules/createschedule' ,(req,res) => {
    const schema = joi.object({
        name:joi.string().max(18).required()
    })
    const RESULT = schema.validate(req.query);
    if (RESULT.error){
        res.status(400).send("Bad Query");
        return; 

    }
    CurrentData =req.query.name;

    if (db.get('schedules').find({scheduleName: CurrentData}).value()){
    return res.status(400).send( "Something Went Wrong");
    } else {

    db.get('schedules')
    .push({ scheduleName: CurrentData, CourseList: []})
    .write()

    return res.status(200).send( "schedule added");
   }    
});
 



//5
app.put('/api/schedules/addCourse', (req, res) => {
    const QuerySchema = joi.object({
        scheduleName:joi.string().max(18).required()
    })
    const RESULT1 = QuerySchema.validate(req.query);
    if (RESULT1.error){
        res.status(400).send("Bad Query");
        return; 

    }

    const BodySchema = joi.object({
        CourseList:joi.array().required()
    })
    const RESULT2 = BodySchema.validate(req.body);
    if (RESULT2.error){
        res.status(400).send("Bad Entry");
        return; 

    }
    
    const name = req.query.scheduleName;
    const scheduleCourses = req.body.CourseList;
    let schedules = db.get('schedules').find({scheduleName: name}).value();
    if(schedules) {
      schedules.CourseList = scheduleCourses;
      db.set({schedules: schedules}).write();
      res.send("The values are saved to the schedule");
    } else {
      res.status(404).send("not saved yet!");
    }
  });

  //6
  app.get('/api/schedules/AddCourses', (req,res) => {

  })
  

//7
app.delete('/api/schedules', (req,res) => {
    CurrentData = req.query.schedule;
    

    db.get('schedules')
    .remove({scheduleName: CurrentData})
    .write()

    if (db.has('scheduleName : CurrentData').value()) {
        return res.status(400).send( "bad request");
    } else {
        return res.status(200).send({
            message: "Schedule is deleted successfully"
        });
    }
})
//8
app.get('/api/schedules/schedulesList', (req,res) => {
           
        let ScheduleArray = [];
        ScheduleArray = db.get('schedules').value();
        
        
       
        res.send(ScheduleArray);
    
});

//9
app.delete('/api/schedules/all' , (req,res) =>{
db.unset("schedules").write(); //it delets all schedules
db.defaults({schedules: []}).write() //restart the system to make sure we can accept new schedule name
res.send("All schedules have been deleted successfully ")

})








app.listen(3000, () => console.log('Listening on port 3000'));