$(document).ready(function() {
  $(function() {
    $(".classes-display").hide();
    var timetable = new Timetable();
    timetable.setScope(9,20);
    timetable.addLocations(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
    var renderer = new Timetable.Renderer(timetable);
    renderer.draw('.timetable');

    var url = window.location.href;
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
    if(queryString){
      let scheduleId = queryString.split('=')[1];
      console.log('schedule id: ' + scheduleId);
      displayTable(scheduleId);
      window.history.pushState(null,null,'/');
    };
//================================================================================== 
    function displayTable(id){
      $.ajax("/schedule/" + id, function() {
        type: "GET"
      }).then(function(res){
        //FUNCTION
        var appendToTimetable = function (name,day, startTimeHour, startTimeMin, endTimeHour, endTimeMin) {
          timetable.addEvent(name, day, new Date(2015,7,17, startTimeHour, startTimeMin), new Date(2015,7,17,endTimeHour,endTimeMin)); 
          renderer.draw('.timetable');
        };

        for(var i = 0; i<res.length; i++) {
          if(res[i].inSchedule === true){
            var startTimeArray = res[i].start_time.split(":");
            var endTimeArray = res[i].end_time.split(":");

            var name = res[i].subject_code + " " + res[i].number_title;

            if (res[i].day_code === "MWF"){
              appendToTimetable(name, "Monday",  startTimeArray[0], startTimeArray[1], endTimeArray[0], endTimeArray[1]);
              appendToTimetable(name, "Wednesday", startTimeArray[0], startTimeArray[1], endTimeArray[0], endTimeArray[1]);
              appendToTimetable(name, "Friday", startTimeArray[0], startTimeArray[1], endTimeArray[0], endTimeArray[1]);

            } else if (res[i].day_code === "TR"){
              appendToTimetable(name, "Thursday", startTimeArray[0], startTimeArray[1], endTimeArray[0], endTimeArray[1]);
              appendToTimetable(name, "Tuesday", startTimeArray[0], startTimeArray[1], endTimeArray[0], endTimeArray[1]);

            } else if (res[i].day_code === "MW"){
              appendToTimetable(name, "Monday", startTimeArray[0], startTimeArray[1], endTimeArray[0], endTimeArray[1]);
              appendToTimetable(name, "Wednesday", startTimeArray[0], startTimeArray[1], endTimeArray[0], endTimeArray[1]);

            } else if (res[i].day_code === "W"){
              appendToTimetable(name, "Wednesday", startTimeArray[0], startTimeArray[1], endTimeArray[0], endTimeArray[1]);

            } else if(res[i].day_code === "T"){
              appendToTimetable(name, "Tuesday", startTimeArray[0], startTimeArray[1], endTimeArray[0], endTimeArray[1]);

            } else if(res[i].day_code === "R"){
              appendToTimetable(name, "Thursday", startTimeArray[0], startTimeArray[1], endTimeArray[0], endTimeArray[1]);
            }
          }
        }
        renderer.draw('.timetable');
      });
    }
//==================================================================================  
    $(".subject-btn").on("click", function(event) {
      $("#classes-list").empty();
      let id = $(this).data("id");
  
      $.ajax("/class/" + id, {
        type: "GET"
      }).then(function(result) {
        $(".classes-display").show();
        
        for (var i in result){
          let className = result[i].number_title;
          let startTime = result[i].start_time;
          let endTime = result[i].end_time;
          let dayCode = result[i].day_code;
          let idValue = result[i].id;
          let time = dayCode + ": " + startTime + " - " + endTime;
          let section = result[i].sec;
          let classDiv = $("<li>");
          classDiv.addClass("list-group-item");
          classDiv.append("<strong>" + className + "</strong>");
          classDiv.append(" - Section: " + section);
          classDiv.append("<br>");
          classDiv.append(time);

          let addBtn = $("<button>");
          addBtn.addClass("btn btn-secondary btn-sm add-class");
          addBtn.attr("type","submit");
          addBtn.text("Add to Schedule");
          addBtn.attr("data-id",idValue);

          let deleteBtn = $("<button>");
          deleteBtn.addClass("btn btn-secondary btn-sm remove-class");
          deleteBtn.attr("type","button");
          deleteBtn.text("Remove from Schedule");
          deleteBtn.attr("data-id",idValue);
  
          $("#classes-list").append(classDiv);
          $("#classes-list").append(addBtn);
          $("#classes-list").append(deleteBtn);
        };
      }).fail(function(err){
        console.log(err);
      });
    });

//==================================================================================
    function updateTable (scheduleObj, id) {
      $.ajax("/classes/update/" + id, {
        type: "PUT",
        data: scheduleObj
      }).done(function(res){
        displayTable();
      });
    };    
//==================================================================================

    $(document).on("click", ".add-class", function() {
      let id = $(this).data("id");
      var scheduleState = {
        inSchedule: true
      };
      updateTable(scheduleState, id);
    });
// ====================================================
    $(document).on("click", ".remove-class", function() {


      let id = $(this).data("id");
      var scheduleState = {
        inSchedule: false
      };
      let reloadUrl = '/?scheduleId=' + id;
      updateTable(scheduleState, id);
      window.location.href = reloadUrl;
    });
      //==========================================
    $(".clear-btn").on("click", function(event) {
      var scheduleState = {
        inSchedule: false
      };
      $.ajax("/classes/clear/", {
        type: "PUT",
        data: scheduleState
      }).then(function () {
        console.log("Cleared class schedule");
        var timetable = new Timetable();
        timetable.setScope(9,20);
        timetable.addLocations(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
        var renderer = new Timetable.Renderer(timetable);
        renderer.draw('.timetable');
        location.reload();
      });
      
    });
  });
});