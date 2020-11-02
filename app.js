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


// Database 
db.defaults({schedules: []})
.write()

// to show the results to the frontend when I press search
app.get('/api/courses/submit' , (req,res) => {
    FQuery = req.query;
    SubjectQuery = FQuery.Subject;
    ComponentQuery = FQuery.Component;
    CourseNumberQuery = FQuery.CourseNumber;
    ClassNameQuery = FQuery.ClassName;
    var allstored = [];
    //if we are showing the results for all subjects, components, course number, and class name
    if (SubjectQuery == "Subject" && CourseNumberQuery == "" && ComponentQuery== "Component" && ClassNameQuery == "ClassName"){
        res.send("Too many results to display.")
    }
    //if we choose a specific subject, course number, component and class name
    else if (SubjectQuery != "Subject" && CourseNumberQuery != "" && ComponentQuery != "Component" &&  ClassNameQuery != "ClassName"){
         allstored = [];
        for(i=0; i<data.length;i++){
    
            if(SubjectQuery == data[i].subject && CourseNumberQuery == data[i].catalog_nbr && ComponentQuery== data[i].course_info[0].ssr_component &&  ClassNameQuery == data[i].className){
             
                allstored.push(data[i]);

            }
        } res.send(allstored);
    } 
    //if we wanna display the results by selecting subject and course number only
    else if (SubjectQuery != "Subject" && CourseNumberQuery != "" && ComponentQuery == "Component" &&  ClassNameQuery == "ClassName"){
         allstored = [];
        for(i=0 ; i<data.length; i++){
            if(SubjectQuery == data[i].subject && CourseNumberQuery == data[i].catalog_nbr){
                allstored.push(data[i]);
            }
        } res.send(allstored);
    }
    //if we wanna display the results using everything except the class name
    else if (SubjectQuery != "Subject" && CourseNumberQuery != "" && ComponentQuery != "Component" &&  ClassNameQuery == "ClassName"){
         allstored = [];
        for(i=0 ; i<data.length; i++){
            if(SubjectQuery == data[i].subject && CourseNumberQuery == data[i].catalog_nbr && ComponentQuery == data[i].course_info[0].ssr_component ){
                allstored.push(data[i]);
            }
        } res.send(allstored);

    }
    //if we want to to display results using subject
    else if (SubjectQuery != "Subject" && CourseNumberQuery == "" && ComponentQuery == "Component" &&  ClassNameQuery == "ClassName"){
         allstored = [];
        for(i=0 ; i<data.length; i++){
            if(SubjectQuery == data[i].subject){
                allstored.push(data[i]);
           } 
        }
    }
});



//Get all available subject codes (property name: subject) and descriptions (property name: className)
function removeDuplicates(Array){
    return Array.filter((a,b) => Array.indexOf(a) === b) //no duplicates for the drop menu in front end
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

//Get all course codes (property name: catalog_nbr) for a given subject code. Return an error if the subject code doesn’t exist
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

//Get the Timetable entry for a given subject code and course code and optional component
app.get('/api/courses/search/:subjectcode/:coursecode', (req,res) => {

   
    const WithComponent = joi.object({
        component:joi.string().max(3).min(3)
    })
    const RESULT4 = WithComponent.validate(req.query);
    if (RESULT4.error ){
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

//Create a new schedule (to save a list of courses) with a given schedule name. Return an error if name exists
app.post('/api/schedules/createschedule' ,(req,res) => {
    const schema = joi.object({
        name:joi.string().max(18).min(1).required()
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
 



//Save a list of subject code, course code pairs under a given schedule name
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

  //Get the list of subject code, course code pairs for a given schedule
  app.get('/api/schedules/ShowCourses', (req,res) => {

    const showschema = joi.object({
        name:joi.string().max(18).min(1).required()
    })
    const RESULT69 = showschema.validate(req.query);
    if (RESULT69.error){
        res.status(400).send("Bad input");
        return; 

    }

    const ShowList = req.query.name;

    if (db.get('schedules').find({scheduleName: ShowList}).value()){
        res.send (db.get('schedules').find({scheduleName: ShowList}).value().CourseList); 
    }
    else{
        res.send("not found")
    }
  })
  

//Delete a schedule with a given name. Return an error if the given schedule doesn’t exist
app.delete('/api/schedules', (req,res) => {
    
    const QuerySchema55 = joi.object({
        name:joi.string().max(18).min(1).required()
    })
    const RESULT55 = QuerySchema55.validate(req.query);
    if (RESULT55.error){
        res.status(400).send("Bad Query");
        return; 

    }
     CurrentData = req.query.name;
    

      if(db.get('schedules').find({scheduleName: CurrentData}).value()) {
        db.get('schedules').remove({scheduleName: CurrentData}).write()
        res.status(200).send("The selected schedule has been deleted");
         
        }
    
    else {
        return res.status(404).send("The schedule name is not found ");
    }
});
//Get a list of schedule names and the number of courses that are saved in each schedule.
app.get('/api/schedules/schedulesList', (req,res) => {
           
        let ScheduleArray = [];
        ScheduleArray = db.get('schedules').value();
        
        
       
        res.send(ScheduleArray);
    
});

//Delete all schedules
app.delete('/api/schedules/all' , (req,res) =>{
db.unset("schedules").write(); //it delets all schedules
db.defaults({schedules: []}).write() //restart the system to make sure we can accept new schedule name
res.send("All schedules have been deleted successfully ")

})








app.listen(3000, () => console.log('Listening on port 3000'));