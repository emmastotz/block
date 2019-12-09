$(document).ready(function() {
  // The state of the page. 
  // Used as input for the time table and fed by adding classes or specific class instances (all data)
  let state = {
    indexOfSchedule: 0,
    allCombinations: [],
    classes: [],
    alldata: []   
  }
  // Array of chars representings days of the week
  var dayCode = ['M','T','W','R','F','S'];
  // Function where most of the magic happends
  $(function() {
    var timetable = new Timetable();
    var renderer = new Timetable.Renderer(timetable);
    $(".classes-display").hide();
    renderTimetable();
    renderer.draw('.timetable');
    // Saves the window location from when you remove a single class
    var url = window.location.href;
    console.log(url);
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
    if(queryString){
      let scheduleId = queryString.split('=')[1];
      console.log('schedule id: ' + scheduleId);
      displayTable(scheduleId);
      window.history.pushState(null,null,'/index');
    };

//================================================================
// Helper functions to create all possible combinations between two arrays
    const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
    const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);
//================================================================
// Day Code Function
    function dayEquivalence(param){
      var day;
      switch(param){
        case 'M':
          day = "Monday";
          break;
        case 'T':
          day = "Tuesday";
          break;
        case 'W':
          day = "Wednesday";
          break;
        case 'R':
          day = "Thursday";
          break;
        case 'F':
          day = "Friday";
          break;
        case 'S':
          day = "Saturday";
          break;
        default:
          day = "";
      }
    return day;
    };
//================================================================
// Add a class
    function appendToTimetable (name, day, startTimeHour, startTimeMin, endTimeHour, endTimeMin) {
      timetable.addEvent(name, day, new Date(2015,7,17, startTimeHour, startTimeMin), new Date(2015,7,17,endTimeHour,endTimeMin)); 
      renderer.draw('.timetable');
    };
//================================================================
// Displays all classes in the database with a value of true
    function displayTable(id){
      $.ajax("/schedule/" + id, function() {
        type: "GET"
      }).then(function(res){
      
        for(var i = 0; i<res.length; i++) {
          if(res[i].inSchedule === true){
            var startTimeArray = res[i].start_time.split(":");
            var endTimeArray = res[i].end_time.split(":");

            var name = res[i].subject_code + " " + res[i].number_title;
            // Loops through the day codes. If an entry in day code is included in the res[i].day_code string 
            // then add that day to the schedule.
            for(var j in dayCode){
              // If the class day code includes the current day of the week then add it to the time table
              if(res[i].day_code.includes(dayCode[j])) {
                appendToTimetable(name, dayEquivalence(dayCode[j]), startTimeArray[0], startTimeArray[1], endTimeArray[0], endTimeArray[1]);
              };
            }            
          }
        }
        renderer.draw('.timetable');
      });
    }
//================================================================================== 
// Display Classes
    $(".subject-btn").on("click", function(event) {
      $("#classes-list").empty();
      let id = $(this).data("id");
  
      $.ajax("/classes/" + id, {
        type: "GET"
      }).then(function(result) {
        $(".classes-display").show();
        console.log(result);
          for(var i in result){
            let className = result[i].class_name;
            let classId = result[i].id;
            let classDiv = $("<li>");
            classDiv.addClass("list-group-item");
            classDiv.attr("class-id", classId);
            classDiv.append("<strong>" + className + "</strong>");

            let addBtn = $("<button>");
            addBtn.addClass("btn btn-secondary btn-sm add-classes");
            addBtn.attr("type","submit");
            addBtn.text("Add to Schedule");
            addBtn.attr("data-id",classId);

            let deleteBtn = $("<button>");
            deleteBtn.addClass("btn btn-secondary btn-sm remove-classes");
            deleteBtn.attr("type","button");
            deleteBtn.text("Remove from Schedule");
            deleteBtn.attr("data-id",classId);

            let openBtn = $("<button>");
            openBtn.addClass("btn btn-secondary btn-sm open");
            openBtn.attr("type","button");
            openBtn.text("Open");
            openBtn.attr("data-id",classId);
            
            classDiv.append(addBtn);
            classDiv.append(deleteBtn);
            classDiv.append(openBtn);
            $("#classes-list").append(classDiv);

            let subclassDiv = $("<li>");
            subclassDiv.addClass("list-group-item");
            subclassDiv.attr("id","subclass-" + classId);
            $("#classes-list").append(subclassDiv);
          }

      }).fail(function(err){
        console.log(err);
      });
    });
//==================================================================================
// Appends the classes corresponding to a specific subject
// $(".class-close-btn").on("click", function(event) {
// });
//==================================================================================
// Updates the schedule state
    function updateTable (scheduleObj, id) {
      $.ajax("/classes/update/" + id, {
        type: "PUT",
        data: scheduleObj
      }).done(function(res){
        renderTimetable();
        displayTable();
      });
    };
//==================================================================================
// Appends the classes corresponding to a specific subject
    $(document).on("click",'.add-classes',function() {
      let id = $(this).data("id");
      // If the classes id is not in the class array add it
      if(state.classes.indexOf(id)> -1){
        state.classes.push(id);
      }
      console.log(state.classes);
    });
//==================================================================================
// Appends the classes corresponding to a specific subject
    $(document).on("click", '.open' ,function() {
      let id = $(this).data("id");
      // This subclass div is where we append the class instances (coming from alldata)
      var classDiv = $("#subclass-" + id);
      $.ajax("/class/" + id, {
        type: "GET"
      }).then(function(result) {
        $(".classes-display").show();
          for(var i in result){
            let startTime = result[i].start_time;
            let endTime = result[i].end_time;
            let dayCode = result[i].day_code;
            let time = dayCode + ": " + startTime + " - " + endTime;

            let className = result[i].number_title;
            let classId = result[i].id;
            let classDivChild = $("<li>");
            classDivChild.addClass("list-group-item");
            classDivChild.attr("class-id", classId);
            classDivChild.append("<strong>" + className + "</strong>");
            classDivChild.append("<br>");
            classDivChild.append(time);
            // The add-class class is used to append the specific alldata information
            let addBtn = $("<button>");
            addBtn.addClass("btn btn-secondary btn-sm add-class");
            addBtn.attr("type","submit");
            addBtn.text("Add");
            addBtn.attr("data-id",classId);

            let deleteBtn = $("<button>");
            deleteBtn.addClass("btn btn-secondary btn-sm remove-class");
            deleteBtn.attr("type","button");
            deleteBtn.text("Remove");
            deleteBtn.attr("data-id",classId);

            classDivChild.append(addBtn);
            classDivChild.append(deleteBtn);
            classDiv.append(classDivChild);
          }
      }).fail(function(err){
        console.log(err);
      });

    });    
//==================================================================================
// Add Class
    $(document).on("click", ".add-class", function() {
      let id = $(this).data("id");
      // If the specific class id is not in the alldata array add it
      if(state.classes.indexOf(id)> -1){
        state.alldata.push(id);
      }
      console.log(state.alldata);
      var scheduleState = {
        inSchedule: true
      };
      updateTable(scheduleState, id);
    });
// ====================================================
// Remove single class from schedule
    $(document).on("click", ".remove-class", function() {
      let id = $(this).data("id");
      var scheduleState = {
        inSchedule: false
      };
      let reloadUrl = '/index?scheduleId=' + id;
      updateTable(scheduleState, id);
      // window.location.href = reloadUrl;
    });
//==========================================
// Clear Class Schedule
    $(".clear-btn").on("click", function(event) {
      var scheduleState = {
        inSchedule: false
      };
      $.ajax("/classes/clear/", {
        type: "PUT",
        data: scheduleState
      }).then(function () {
        console.log("Cleared class schedule");
        // location.reload();
        renderTimetable();
        renderer.draw('.timetable');
        $("#classes-list").empty();
      });
    });
//==========================================
// Render Timetable
    function renderTimetable (){
      timetable = new Timetable();
      renderer = new Timetable.Renderer(timetable);
      timetable.setScope(8,21);
      timetable.addLocations(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
    };
  });
});

