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
});*/












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
 

//5
app.put('/api/schedules/save', (res,req) => {
    CurrentData = req.query.name;
    let subjectcode = req.params.subjectcode;
    let component = req.query.component;
    scheduleName = db.get('schedules').find({ScheduleName: CurrentData}).value();
    ResultSchedule = db.get('schedules').push({scheduleName: CurrentData, CourseList: []});
    for(i=0; i<data.length; i++){
        if(scheduleName && ResultSchedule){
            if(subjectcode == data[i].subject && coursecode == data[i].catalog_nbr){
                
            }
    
        }

    }
    
});

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

//9
app.delete('/api/schedules/all' , (req,res) =>{
db.unset("schedules").write(); //it delets all schedules
db.defaults({schedules: []}).write() //restart the system to make sure we can accept new schedule name
res.send("All schedules have been deleted successfully ")

})








app.listen(3000, () => console.log('Listening on port 3000'));