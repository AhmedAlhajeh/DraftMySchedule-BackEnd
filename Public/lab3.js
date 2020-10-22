const { json } = require("express");

const data 
function start(){

    data = JSON.parse("./Lab3-timetable-data.json"); 
    createSubjectList(data.message)
} 


start()

function createSubjectList(SubjectList){
    document.getElementById("subject").innerHTML = `
    <select>
     <option>Subject </option>
     ${Object.keys(SubjectList).map(function (subject) {
         return `<option>${subject}</option>`
     }).join('')}
     </select>
    `
}
