/// <reference path="jquery-3.4.1.js" />

"use strict";

$(function () {


    //טיפול באירועים

    //לחיצה על כפתור ליצירת פתקית
    document.getElementById("submitButton").addEventListener("click", saveTask);

    //לחיצה על כפתור לאיפוס הטופס
    document.getElementById("resetButton").addEventListener("click", resetForm);


    //כאשר העכבר מרחף מעל פתקית
    $("#containerDiv").on("mouseover", "div", function () {
        enableIcon($(this).children()[0].id);
    });


    //כאשר העכבר מפסיק לרחף מעל פתקית
    $("#containerDiv").on("mouseout", "div", function () {
        disableIcon($(this).children()[0].id);
    });


    //בעת לחיצה על מחיקת פתקית
    $("#containerDiv").on("click", "span", function () {
        let index = this.id;
        index = index.slice(4, index.length);
        removeTask(index);
    });





    //יצירת מערך הפתקיות
    let allTasks = [];

    //הצגת כל הפתקיות במידה ויש
    loadAllTasks();





    function loadAllTasks() {
        if (localStorage.getItem("tasks") != null) {

            //Local storage-טעינה אל המערך מה
            allTasks = JSON.parse(localStorage.getItem("tasks"));

            //לפורמט רגיל jason  מחזיר את הפורמט של התאריך מפורמט 
            allTasks.forEach(taskInfo => {
                const date = new Date(taskInfo.date);
                taskInfo.date = date;
            });

            //מוחק מהמערך פתקיות לא תקפות
            const currentDate = new Date();
            allTasks = allTasks.filter(taskInfo => taskInfo.date > currentDate);

            //Local Storage-עדכון ה
            localStorage.setItem("tasks", JSON.stringify(allTasks));

            displayTasks();
        }
    }






    //הצגת הפתקיות
    function displayTasks() {


        const containerDiv = document.getElementById("containerDiv");

        containerDiv.innerHTML = ""; // ניקוי ממידע קודם

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





    //Local storage-הוספת פתקית חדשה אל המערך ושמירה ב
    function saveTask() {

        const taskBox = document.getElementById("missionDetailes");
        const dateBox = document.getElementById("finalDate");
        const timeBox = document.getElementById("finalTime");



        console.log(timeBox.value);

        //הערכים שהמשתמש הכניס
        const stringTask = taskBox.value;
        let stringDate = dateBox.value;
        const stringTime = timeBox.value;

        //ולידציה של מילוי פרטי המשימה ותאריך
        if (stringTask === "") {
            alert("Enter the mission details");
            //event.preventDefault();
            return;
        }

        if (stringDate === "") {
            alert("Enter a valid date");
            //event.preventDefault();
            return;
        }

        //יוצר אובייקט של תאריך
        const date = new Date(`${stringDate} ${stringTime}`);

        //יצירת אובייקט של משימה
        const taskInfo = {
            task: stringTask,
            date: date
        };

        //Local Storage-הכנסת האובייקט אל המערך ושמירה ב
        allTasks.push(taskInfo);
        localStorage.setItem("tasks", JSON.stringify(allTasks));

        //איפוס הטופס
        resetForm();

        //הצגת הפתקיות כולל הפתקית החדשה שנוספה
        displayTasks();
    }







    //מחזיר מחרוזת של תאריך מאובייקט של תאריך
    function getDateToString(date) {

        let stringDate = date.toLocaleDateString();
        const array = stringDate.split(".").map(str => str.length === 1 ? `0${str}` : str);
        stringDate = `${array[0]}/${array[1]}/${array[2]}`;
        return stringDate;
    }



    //מחזיר מחרוזת של שעה מאובייקט של תאריך
    function getTimeToString(date) {

        const str = date.toLocaleTimeString();
        const array = str.split(":").map(str => str.length === 1 ? `0${str}` : str);
        const stringTime = `${array[0]}:${array[1]}`;
        return stringTime;
    }



    //מחיקת פתקית
    //מקבל אינדקס למחיקה מהמערך
    function removeTask(index) {

        const result = confirm("Are you sure?");
        if (result) {
            allTasks.splice(index, 1); // מחיקת פריט הקיים באינדקס הזה
            localStorage.setItem("tasks", JSON.stringify(allTasks));
            displayTasks();
        }

    }


    //איפוס הטופס
    function resetForm() {
        document.getElementById("formID").reset();

    }



    //הצגת אייקון למחיקת פתקית
    function enableIcon(id) {

        const icon = document.getElementById(id);
        icon.style.visibility = "visible";
    }



    //הסתרת האייקון למחיקת פתקית
    function disableIcon(id) {

        const icon = document.getElementById(id);
        icon.style.visibility = "hidden";
    }

}

);



