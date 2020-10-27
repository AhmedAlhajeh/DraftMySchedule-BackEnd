const express = require('express');
const app = express();
const data = require("./Lab3-timetable-data.json");
const CountData =Object.keys(data).length;
//const low = require('lowdb');
//const filesync = require('lowdb/adapters/filesync');
///const adapter = new filesync('schedule_database.json');
//const db = low(adapter);
app.use(express.static('Public')); 

// Database defaults
/*db.defaults({schedules: []})
.write()

app.post('/api/schedules/createschedule' ,(req,res) => {
    curr_data =req.query;

    if (db.get('schedules').find({schedule_id: curr_data.name}).value){
    return res.status(400).sent({
        message: "Status 400, Something Went Wrong"
       });
    } else {

    db.get('schedules')
    .push({ schedule_id: curr_data.name, schedule_information: []})
    .write()

    return res.status(200).send({
        message: "Status 200 OK, schedule added"
    });
}    
});*/

app.get('/api/courses',(req,res) => {
    res.send(data);
});

var SubjectArray = [];
var InformationArray = [];

function removeDuplicates(Array){
    return Array.filter((a,b) => Array.indexOf(a) === b)
};

app.get('/api/dropdown', (req,res) => {
    for(i=0; i< CountData; i++){
        SubjectArray[i] = data[i].subject;
    }

    SubjectArray = removeDuplicates(SubjectArray);
    res.send(SubjectArray);
});

app.get('/api/courses', (req,res) => {
    CurrentData = req.query;
    InformationArray = [];
    SubjectName = CurrentData.subject;
    number = CurrentData.course_number;
    component = CurrentData.course_cmpnt;
})

/*if(subject_name == "All_Subjects" && number == "") {
    return res.status(400).send({
        message: "Too many results to display. Please Narrow Search fieldds."
    });
} 
else if (subject_name != "All_Subjects" && number == "" && component != "all_components") {
    for (i=0; i<data.length;i++){
        if (subject_name == data[i].subject && component == data[i].course_info[0].ssr_component){
            info_array.push(data[i]);
        }
    }
}*/

app.listen(3000, () => console.log('Listening on port 3000'));