/// <reference path="jquery-3.4.1.js" />

"use strict";

$(function () {


    //events

    //Clicking a button for creating a note
    document.getElementById("submitButton").addEventListener("click", addTask);

    // Click on a button for resetting the form
    document.getElementById("resetButton").addEventListener("click", resetForm);


    // When the mouse hovers over a note
    $("#containerDiv").on("mouseover", "div", function () {
        enableIcon($(this).children()[0].id);
    });


    // When the mouse stops hover over a note
    $("#containerDiv").on("mouseout", "div", function () {
        disableIcon($(this).children()[0].id);
    });


    // When the mouse click on a note
    $("#containerDiv").on("click", "span", function () {
        let index = this.id;
        index = index.slice(4, index.length);
        removeTask(index);
    });


    //Tasks array
    let allTasks = [];

    //View all notes
    loadAllTasks();


    function loadAllTasks() {
        if (localStorage.getItem("tasks") != null) {

            //Get tasks from the Local storage
            allTasks = JSON.parse(localStorage.getItem("tasks"));

            //Convert json to date format
            allTasks.forEach(taskInfo => {
                const date = new Date(taskInfo.date);
                taskInfo.date = date;
            });

            //Deletes invalid notes from the array
            const currentDate = new Date();
            allTasks = allTasks.filter(taskInfo => taskInfo.date > currentDate);

            //save the updated array to Local Storage
            localStorage.setItem("tasks", JSON.stringify(allTasks));

            //View all notes
            displayTasks();
        }
    }


    //View all notes
    function displayTasks() {


        const containerDiv = document.getElementById("containerDiv");

        containerDiv.innerHTML = "";

        let index = 0;
        for (var taskInfo of allTasks) {


            const date = getDateToString(taskInfo.date);
            const time = getTimeToString(taskInfo.date);


            var div =
                `<div id="t${index}">
                <span class="glyphicon glyphicon-remove-sign icon" aria-hidden="true" id="icon${index}"></span>
                <p>${taskInfo.task}</p>
                <p>${date}<br>${time}</p>
               `;

            containerDiv.innerHTML += div;
            index++;

        }
    }


    //add a new note and save the array to Local storage
    function addTask() {

        const taskBox = document.getElementById("missionDetailes");
        const dateBox = document.getElementById("finalDate");
        const timeBox = document.getElementById("finalTime");


        //get details on task from user
        const stringTask = taskBox.value;
        let stringDate = dateBox.value;
        const stringTime = timeBox.value;

        //Error checking
        if (stringTask === "") {
            alert("Enter the mission details");
            return;
        }

        if (stringDate === "") {
            alert("Enter a valid date");
            return;
        }

        //create date format
        let date = new Date(`${stringDate} ${stringTime}`);
        const dateNow = new Date();

        //create object for note
        const taskInfo = {
            task: stringTask,
            date: date
        };




        // const containerDiv = document.getElementById("containerDiv");

        date = getDateToString(taskInfo.date);
        const time = getTimeToString(taskInfo.date);

        // const newTask = document.createTextNode();


        var temp = document.createElement('div'); // create a temporary dom element
        temp.innerHTML = `<div id="t${allTasks.length - 1}">
        <span class="glyphicon glyphicon-remove-sign icon" aria-hidden="true" id="icon${allTasks.length - 1}"></span>
        <p>${taskInfo.task}</p>
        <p>${date}<br>${time}</p>
       `;

        const childArray = temp.childNodes; // grab the resulting child elements

        //Add note to array and Local Storage
        if (taskInfo.date < dateNow) {
            alert("date and time are not valid");
        }

        else {
            allTasks.push(taskInfo);
            localStorage.setItem("tasks", JSON.stringify(allTasks));
            document.getElementById('containerDiv').appendChild(childArray[0]);
        }

        resetForm();

    }



    //Return string of date from date format
    function getDateToString(date) {

        let stringDate = date.toLocaleDateString();
        const array = stringDate.split(".").map(str => str.length === 1 ? `0${str}` : str);
        stringDate = `${array[0]}/${array[1]}/${array[2]}`;
        return stringDate;
    }


    //Return string of time from date format
    function getTimeToString(date) {
        const str = date.toLocaleTimeString();
        const array = str.split(":").map(str => str.length === 1 ? `0${str}` : str);
        const stringTime = `${array[0]}:${array[1]}`;
        return stringTime;
    }


    //Delete a note
    //get index of note for deleting
    function removeTask(index) {

        const result = confirm("Are you sure?");
        if (result) {
            allTasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(allTasks));
            // displayTasks();
            const taskToRemove = document.getElementById('t' + index);
            // taskToRemove.remove();

            document.getElementById('t' + index).style.opacity = '0';
            setTimeout(function () { taskToRemove.remove(); }, 500);

            // document.getElementById('t' + index).style.display = "none";
            // const containerDiv = document.getElementById("containerDiv");
            // console.log(containerDiv.innerHTML);
        }
    }


    //resetting the form
    function resetForm() {
        document.getElementById("formID").reset();
    }



    //enable delete icon
    function enableIcon(id) {
        const icon = document.getElementById(id);
        icon.style.visibility = "visible";
    }



    //disable delete icon
    function disableIcon(id) {
        const icon = document.getElementById(id);
        icon.style.visibility = "hidden";
    }
});



