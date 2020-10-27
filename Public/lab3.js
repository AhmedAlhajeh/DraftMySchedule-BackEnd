


async function getDropDown() {
    const response = await fetch("http://localhost:3000/api/dropdown");
    const data = await response.json();
    createDropDownList(data);
}

function createDropDownList(SubjectList){
    var selectbox = document.getElementById("Subject");

    for (i=0; i <SubjectList.length; i++) {
        var newOption = document.createElement("option");
        var optionText = document.createTextNode(SubjectList[i]);
        newOption.appendChild(optionText);
        selectbox.appendChild(newOption);
    }
}

getDropDown();


