const express = require('express');
const app = express();
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
});

app.delete('/api/shcedule/delete', (req,res) => {
    CurrentData = req.query;
    
    if (CurrentData.schedule == "all_schedules") {
        return res.status(404).send({
            message: "Status 404"
        });
    }

    db.get('schedules')
    .remove({schedule_id: CurrentData.schedule})
    .write()

    if (db.has('schedule_id : CurrentData.schedule').value()) {
        return res.status(400).send({
            message: "status 404"
        });
    } else {
        return res.status(200).send({
            message: "Status 200 OK"
        });
    }
})*/






var InformationArray = [];



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
app.get('/api/courses/:subjectcode', (req,res) => {
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
app.get('/api/courses/:subjectcode/:coursecode', (req,res) => {
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




/*app.get('/api/subjects', (req,res) => {
    CurrentData = req.query;
    InformationArray = [];
    SubjectName = CurrentData.Subject;
    number = CurrentData.CourseNumber;
    component = CurrentData.Component;


    if(SubjectName == "Subject" && number == "") {
      return res.status(400).send({
        message: "Too many results to display. Please Narrow Search fields."
      });
    } 
    /*else if (SubjectName != "Subject" && number == "" && component != "Component") {

        for (i=0; i<data.length;i++){
            if (SubjectName == data[i].subject && component == data[i].course_info[0].ssr_component){
            InformationArray.push(data[i]);
            }
        }


        if (InformationArray.length == 0){
           return res.status(404).send({
               message: "not Found"
            });
    
        }  else {
             res.send(InformationArray);
             return true;
        }
    }

    else if (SubjectName != "Subject" && number == "" && component == "Component"){

      for (i=0; i<data.length; i++){
          if (SubjectName == data[i].subject){
            InformationArray.push(data[i]);
           }
        }
        if (InformationArray.length == 0){
            return res.status(404).send({
                message: "not found"

            });
        } else {

            res.send(InformationArray);
            return true;

        } 
    }

    else if ((SubjectName != "Subject" && number != "" && component == "Component")){
        for (i=0; i<data.length; i++) {
            if (SubjectName == data[i].subject && number == data[i].catalog_nbr){
                InformationArray.push(data[i]);
            }
        }
        if (InformationArray.length == 0){
            return res.status(404).send({
                message = "Not found"
            });
        }   else {
            res.send(InformationArray);
            return true;
        }
    }

    else if ((SubjectName == "Subject" && number != "" && component == "Component")) {
        for (i=0; i<data.length; i++) {
            if(number == data[i].catalog_nbr){
                InformationArray.push(data[i]);
            }
        }
       if (InformationArray.length == 0){
        return res.status(404).send({
            message: "Not Found"
        });
    } else {
        res.send(InformationArray);
        return true;
    }
  }
});*/

app.listen(3000, () => console.log('Listening on port 3000'));