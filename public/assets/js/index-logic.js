$(document).ready(function() {
  // The state of the page. 
  // Used as input for the time table and fed by adding classes or specific class instances (all data)
  let state = {
    indexOfSchedule: 0,
    allCombinations: [],
    classes: [],
    alldata: []   
  };

  // Array of chars representings days of the week
  var dayCode = ['M','T','W','R','F','S'];

  $(function() {

    var timetable = new Timetable();
    var renderer = new Timetable.Renderer(timetable);
    $(".classes-display").hide();
    renderTimetable();
    renderer.draw('.timetable');

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
//==================================================================================
// Create combination of classes and class instances
function generateAllCombinations(){
  var godArray = [];
  for(var i = 0; i < state.alldata.length; i++){
    $.ajax("/classes/all/" + state.alldata[i], function(){
      type: "GET"
    }).then(function(res){
      var arr = [];
      arr.push(res[0]);
      console.log(arr);
      godArray.push(arr);
    })
  };

  for(var i = 0; i < state.classes.length; i++){
    // A temp array where we will store our result set.
    // Each class instance will be added as an entry of the array.
    $.ajax("/class/" + state.classes[i], function(){
      type: "GET"
    }).then(function(res){
      var tempArray = [];
      // Iterate over classes intances based on the general class
      for(var j = 0; j < res.length; j++){
        tempArray.push(res[j]);
      }
      // Push the array containing all class instances 
      godArray.push(tempArray);
      state.allCombinations = mixer(godArray);
      console.log("This is all combinations array ");
      console.log(state.allCombinations);
    });

  }

};
//==================================================================================
// Function used to mix an array of arrays
function mixer(arr){
  var mix_result = [];
  for(var i = 0; i < arr.length; i++){
    if(i == 0){
      mix_result = arr[i]
    } else {
      mix_result = cartesian(mix_result,arr[i]);
    }
  }
  return mix_result;
}
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

            let openBtn = $("<button>");
            openBtn.addClass("btn btn-link btn-sm open");
            openBtn.attr("type","button");
            openBtn.text(className);
            openBtn.attr("data-id",classId);

            let addBtn = $("<button><i></i></button>");
            addBtn.addClass("btn btn-link btn-sm add-classes li fa fa-plus");
            addBtn.attr("type","submit");
            addBtn.attr("data-id", classId);
            addBtn.attr("data-name", className);
            
            classDiv.append(openBtn);
            classDiv.append(addBtn);
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
      let className = $(this).data("name");

      // If the classes id is not in the class array add it
      if(state.classes.indexOf(id) == -1){
        state.classes.push(id);
      }
      console.log(state.classes);

      let deleteBtn = $("<button><i></i></button>");
      deleteBtn.addClass("btn btn-link btn-sm remove-class fa fa-times");
      deleteBtn.attr("type","clear");
      deleteBtn.attr("data-id",id);

      let listItem = $("<li>")
      listItem.addClass("list-group-item");
      listItem.attr("id", "class-list-id-" + id)
      listItem.append(className);
      listItem.append(deleteBtn);

      $("#classes-scheduled").append(listItem);
      console.log("The current number of general classes in state are : " + state.classes);
      generateAllCombinations();
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
        $("#subclass-" + id).empty();
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
            classDivChild.append(className);
            classDivChild.append("<br>");
            classDivChild.append(time);

            let addBtn = $("<button><i></i></button>");
            addBtn.addClass("btn btn-link btn-sm add-class fa fa-plus");
            addBtn.attr("type", "submit");
            addBtn.attr("data-id", classId);
            addBtn.attr("data-name", className);
            addBtn.attr("data-time", time);

            classDivChild.append(addBtn);
            classDiv.append(classDivChild);
          }
      }).fail(function(err){
        console.log(err);
      });

    });    
// ==================================================================================
// Add Class
    $(document).on("click", ".add-class", function() {
      let id = $(this).data("id");
      let className = $(this).data("name");
      let classTime = $(this).data("time");

      // If the specific class id is not in the alldata array add it
      if(state.classes.indexOf(id) == -1){
        state.alldata.push(id);
      }
      console.log(state.alldata);
      var scheduleState = {
        inSchedule: true
      };

      let deleteBtn = $("<button><i></i></button>");
      deleteBtn.addClass("btn btn-link btn-sm remove-class fa fa-times");
      deleteBtn.attr("type","clear");
      deleteBtn.attr("data-id",id);

      let listItem = $("<li>")
      listItem.addClass("list-group-item");
      listItem.attr("id", "class-list-id-" + id)
      listItem.append(className);
      listItem.append($("<br>"));
      listItem.append(classTime);
      listItem.append(deleteBtn);

      $("#classes-scheduled").append(listItem);

      updateTable(scheduleState, id);

      console.log("The current number of general classes in state are : " + state.classes);
      generateAllCombinations();
    });

// ==================================================================================
// Remove Single Class from Schedule
    $(document).on("click", ".remove-class", function() {
      let id = $(this).data("id");

      var scheduleState = {
        inSchedule: false
      };

      $("#class-list-id-" + id).remove();
      updateTable(scheduleState, id);
    });

// ==================================================================================
// Save Class Schedule
    $(".save-btn").on("click", function(){
      console.log("Save schedule button clicked");
    });
// ==================================================================================
// Clear Class Schedule
    $(".clear-btn").on("click", function() {
      var scheduleState = {
        inSchedule: false
      };
      $.ajax("/classes/clear/", {
        type: "PUT",
        data: scheduleState
      }).then(function () {
        renderTimetable();
        renderer.draw('.timetable');
        $("#classes-list").empty();
        $("#classes-scheduled").empty();
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
//==========================================
// Open/Close Nav Bar
    $("#navOpen").on("click", function() {
      
    });
//==========================================
// Previous Permutation Function
    $(".control-prev").on("click", function() {
      state.indexOfSchedule--;
    });
//==========================================
// Next Permutation Function
    $(".control-next").on("click", function() {
      state.indexOfSchedule++;
    });

  });
});