
//taking subject name data from Lab3-timetable-data.json file to show here
async function DropDown() {
    const response = await fetch("/api/courses");
    const courses = await response.json();
    DropDownList(courses.SubjectArray);

    
}
//taking courses names data from Lab3-timetable-data.json file to show here
async function DropDown2() {
    const response2 = await fetch("/api/courses");
    const classes = await response2.json();
    ClassNameDropDownList(classes.ClassArray);
    
}




//populating the drop menu for subjects
function DropDownList(SubjectList){
    var Selectbox = document.getElementById("Subject");

    for (i=0; i <SubjectList.length; i++) {
        var SubjectOption = document.createElement("option");
        var SubjectText = document.createTextNode(SubjectList[i]);
        SubjectOption.appendChild(SubjectText);
        Selectbox.appendChild(SubjectOption);
    }
}

DropDown();
//populating the drop menu for classes names
function ClassNameDropDownList(ClassNameList){
    var Selectbox2 = document.getElementById("ClassName");
    
    for (i=0; i <ClassNameList.length; i++) {
        var ClassNameOption = document.createElement("option");
        var ClassNameText = document.createTextNode(ClassNameList[i]);
        ClassNameOption.appendChild(ClassNameText);
        Selectbox2.appendChild(ClassNameOption);
    }
}

DropDown2();





 




//Search functionality
//taking the values for each component course number , class name and subject so we can show the results
async function CourseSearch(){
    var ResultBox = document.getElementById("resultbox");
    var component = document.getElementById("Component").value;
    var  CourseNum = document.getElementById("CourseNumber").value;
    var  subject = document.getElementById("Subject").value;
    var  className = document.getElementById("ClassName").value;
    //how we can show the results from this link
    var url = "http://localhost:3000/api/courses/submit?" + "Subject=" + subject + "&CourseNumber=" + CourseNum + "&Component=" + component + "&ClassName" + className;
    const response = await fetch(url);
    const data = await response.json();
    
    //if we enter all subjects, classes, numbers, and components
    if(data.message == "Too many results to display."){
        alert(data.message);
        var h = document.createElement("h2")
        var text = document.createTextNode("Error 404")
        h.appendChild(text);
        ResultBox.appendChild(h);
        var button = document.getElementById("Submit");
        button.value = "Click here to search again"
    }
    //if we are choosing a specific one course,subject,number, and component
    else if(subject != "Subject" && CourseNum != "" && component != "Component" &&  className != "ClassName"){
        alert(JSON.stringify(data));

    }
    //if we are choosing one from each except class name
    else if (subject != "Subject" && CourseNum != "" && component != "Component" && className == "ClassName"){
        alert(JSON.stringify(data));

    }
    //if we are entering a specific subject and course number
    else if (subject != "Subject" && CourseNum != "" && component == "Component" &&  className == "ClassName") { 
        alert(JSON.stringify(data));
    }
    //if we are entering a specific subject only
    else if (subject != "Subject" && CourseNum == "" && component == "Component" &&  className == "ClassName") { 
        alert(JSON.stringify(data));
        
    }
}
    




    /*function Home(){
    window.location.href = "index.html";
    }*/







