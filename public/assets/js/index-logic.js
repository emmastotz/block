$(document).ready(function() {
  // The state is used as input for the time table. 
  // It changes by adding classes or specific class instances.
  let state = {
    indexOfSchedule: 0,
    allCombinations: [],
    classes: [],
    alldata: [],
    navbar: true,
    collision: false,
    dropdown: true
  };
  // Array of chars representings days of the week
  var dayCode = ["M", "T", "W", "R", "F", "S"];

  // JSON object to simplify switch
  let dayEquivalenceJSON = {
    M: 'Monday',
    T: 'Tuesday',
    W: 'Wednesday',
    R: 'Thursday',
    F: 'Friday',
    S: 'Saturday'
  };

  $(function() {
    var timetable = new Timetable();
    var renderer = new Timetable.Renderer(timetable);
    $(".classes-display").hide();
    $(".collision").hide();
    renderTimetable();
    renderer.draw(".timetable");
    //==============================================================
    // Helper functions to remove an element from an array
    function removeFromArray(arr, elem) {
      let index = arr.indexOf(elem);
      index > -1 ? arr.splice(index,1) : 0
    }
    //==============================================================
    // Function that detects if the current schedule has a instructor rating validation error
    function detectRatingPreferenceConflict() {
      let instructorRatingPreference = 0.0;
      let combinations = state.allCombinations[state.indexOfSchedule]
      // Check to see if before validation is active. If it is retrieve the preference saved in local storage
      if (localStorage.getItem("userPreferences") != null)
        instructorRatingPreference =
          parseFloat(
            JSON.parse(localStorage.getItem("userPreferences")).profRating
          ) | 0.0;

      for (
        var i = 0;
        i < combinations.length;
        i++
      ) {
        let instructorName = combinations[i].Instructor.name;
        let instructorRating = combinations[i].Instructor.rating;

        if (instructorRating != null) {
          if (instructorRating < instructorRatingPreference) {
            let displayText =
              `The instructor ${instructorName} rating of ${instructorRating} ` +
              `is less than the given preference of ${instructorRatingPreference}`;

            $(".time-entry").css("background-color", "red");
            $(".collision").show();
            let collisionCurrent = $(".collision").attr("title");
            let collisionItemStart = "<li>";
            let collisionItemClose = "</li>";
            let collisionString =
              collisionCurrent +
              " " +
              collisionItemStart +
              displayText +
              collisionItemClose;
            $(".collision").attr("data-original-title", collisionString);
          }
        }
      }
    }
    //==============================================================
    // Function that detects if the current schedule has a collision
    function detectTimePreferenceConflict() {
      let timeStartValidationText = "01:00";
      let timeAfterValidationText = "23:00";
      let combinations = state.allCombinations[state.indexOfSchedule];

      // If the userPreferences at local storage at NOT null then we can perform the extraction of the logic
      if (localStorage.getItem("userPreferences")) {
        var timeStartValidation = JSON.parse(
          localStorage.getItem("userPreferences")
        ).timeBefore;
        var timeAfterValidation = JSON.parse(
          localStorage.getItem("userPreferences")
        ).timeAfter;
      } else {
        var timeStartValidation = timeStartValidationText;
        var timeAfterValidation = timeAfterValidationText;
      }

      timeStartValidation =
        parseFloat(timeStartValidation.split(":")[0]) +
        parseFloat(timeStartValidation.split(":")[1]) / 60;

      timeAfterValidation =
        parseFloat(timeAfterValidation.split(":")[0]) +
        parseFloat(timeAfterValidation.split(":")[1]) / 60;

      for (
        var i = 0;
        i < combinations.length;
        i++
      ) {
        let startTimeArraySource = combinations[i].start_time.split(":");
        let startTimeNumberSource =
          parseFloat(startTimeArraySource[0]) +
          parseFloat(startTimeArraySource[1]) / 60;

        // Validation for time less than preference.
        if (startTimeNumberSource < timeStartValidation) {
          let displayText =
            `${combinations[i].number_title} starts before ${timeStartValidation}`

          $(".time-entry").css("background-color", "red");
          $(".collision").show();
          // let collisionCurrent = $(".collision").attr("data-original-title")
          let collisionCurrent = $(".collision").attr("title");

          let collisionItemStart = "<li>";
          let collisionItemClose = "</li>";

          let collisionString =
            collisionCurrent +
            " " +
            collisionItemStart +
            displayText +
            collisionItemClose;
          $(".collision").attr("data-original-title", collisionString);
          $(".collision").attr("title", collisionString);
        }

        // Validation for time greater than preference.
        if (startTimeNumberSource > timeAfterValidation) {
          let displayText =
            state.allCombinations[state.indexOfSchedule][i].number_title +
            " starts after " +
            timeAfterValidation;

          $(".time-entry").css("background-color", "red");
          let collisionCurrent = $(".collision").attr("title");
          let collisionItemStart = "<li>";
          let collisionItemClose = "</li>";

          let collisionString =
            collisionCurrent +
            " " +
            collisionItemStart +
            displayText +
            collisionItemClose;
          $(".collision").attr("data-original-title", collisionString);
          $(".collision").attr("title", collisionString);
        }
      }
    }
    //==============================================================
    // Function that detects if the current schedule has a collision
    function detectCollision() {
      var scheduleIndex = state.indexOfSchedule;
      var allCombos = state.allCombinations[scheduleIndex];
      $(".collision").hide();

      for (var i = 0; i < allCombos.length; i++) {
        let startTimeArraySource = allCombos[i].start_time.split(
          ":"
        );
        let endTimeArraySource = allCombos[i].end_time.split(
          ":"
        );
        let startTimeNumberSource =
          parseFloat(startTimeArraySource[0]) +
          parseFloat(startTimeArraySource[1]) / 60;
        let endTimeNumberSource =
          parseFloat(endTimeArraySource[0]) +
          parseFloat(endTimeArraySource[1]) / 60;

        for (var j = i; j < allCombos.length - 1; j++) {
          let startTimeArrayTarget = allCombos[j + 1].start_time.split(":");
          let endTimeArrayTarget = allCombos[j + 1].end_time.split(":");
          let startTimeNumberTarget =
            parseFloat(startTimeArrayTarget[0]) +
            parseFloat(startTimeArrayTarget[1]) / 60;
          let endTimeNumberTarget =
            parseFloat(endTimeArrayTarget[0]) +
            parseFloat(endTimeArrayTarget[1]) / 60;

          if (
            startTimeNumberTarget >= startTimeNumberSource &&
            startTimeNumberTarget <= endTimeNumberSource &&
            allCombos[i].day_code ==
              allCombos[j + 1].day_code
          ) {
            $(".time-entry").css("background-color", "red");
            $(".collision").show();
            let collisionCurrentText = $(".collision").attr("title");

            let collisionItemStart = "<li>";
            let collisionItemClose = "</li>";
            let collisionText =
              allCombos[i].number_title +
              " and " +
              allCombos[j + 1].number_title +
              " overlap at " +
              allCombos[i].start_time;

            let collisionString =
              collisionCurrentText +
              collisionItemStart +
              collisionText +
              collisionItemClose;
            $(".collision").attr("data-original-title", collisionString);
            $(".collision").attr("title", collisionString);

            return true;
          }
        }
      }
      return false;
    }

    //================================================================
    // Helper functions to create all possible combinations between two arrays
    const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
    const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

    //================================================================
    // Day Code Function
    function dayEquivalence(param) {
      if(typeof dayEquivalenceJSON[param] !== 'undefined')
        var day = dayEquivalenceJSON[param]
      else
        var day = ""
      return day
    }
    //==================================================================================
    // Create combination of classes and class instances
    function generateAllCombinations() {
      let godArray = [];
      for (var i = 0; i < state.alldata.length; i++) {
        $.ajax("/classes/all/" + state.alldata[i], function() {
          type: "GET";
        }).then(function(res) {
          var arr = [];
          arr.push(res[0]);
          godArray.push(arr);
          state.allCombinations = mixer(godArray);
          setTimeout(1000, displayTable());
        });
      }

      for (var i = 0; i < state.classes.length; i++) {
        // A temp array where we will store our result set.
        // Each class instance will be added as an entry of the array.
        $.ajax("/class/" + state.classes[i], function() {
          type: "GET";
        }).then(function(res) {
          var tempArray = [];
          // Iterate over classes intances based on the general class
          for (var j = 0; j < res.length; j++) {
            tempArray.push(res[j]);
          }
          // Push the array containing all class instances
          godArray.push(tempArray);
          state.allCombinations = mixer(godArray);
          setTimeout(1000, displayTable());
        });
      }
    }
    //==================================================================================
    // Function used to mix an array of arrays
    function mixer(arr) {
      var mix_result = [];
      for (var i = 0; i < arr.length; i++)
        mix_result = i == 0 ? arr[i] : cartesian(mix_result, arr[i])

      if (localStorage.getItem("userPreferences") != null)
        if (JSON.parse(localStorage.getItem("userPreferences")).omitConflicts)
          mix_result = mix_result.filter(
            schedule => detectConflict(schedule) == false
          );

      return mix_result;
    }
    //================================================================
    // Add a class
    function appendToTimetable(
      name,
      day,
      startTimeHour,
      startTimeMin,
      endTimeHour,
      endTimeMin
    ) {
      timetable.addEvent(
        name,
        day,
        new Date(2015, 7, 17, startTimeHour, startTimeMin),
        new Date(2015, 7, 17, endTimeHour, endTimeMin)
      );
      renderer.draw(".timetable");
    }
    //================================================================
    // Displays all classes in the database with a value of true
    function displayTable() {
      let emptyString = "";
      $(".collision").attr("data-original-title", emptyString);
      $(".collision").attr("title", emptyString);

      if (state.allCombinations[state.indexOfSchedule]) {
        if (state.allCombinations[state.indexOfSchedule].length) {
          for (
            var i = 0;
            i < state.allCombinations[state.indexOfSchedule].length;
            i++
          ) {
            var startTimeArray = state.allCombinations[state.indexOfSchedule][
              i
            ].start_time.split(":");
            var endTimeArray = state.allCombinations[state.indexOfSchedule][
              i
            ].end_time.split(":");
            var name =
              state.allCombinations[state.indexOfSchedule][i].subject_code +
              " " +
              state.allCombinations[state.indexOfSchedule][i].number_title;

            for (var j in dayCode) {
              if (
                state.allCombinations[state.indexOfSchedule][
                  i
                ].day_code.includes(dayCode[j])
              ) {
                appendToTimetable(
                  name,
                  dayEquivalence(dayCode[j]),
                  startTimeArray[0],
                  startTimeArray[1],
                  endTimeArray[0],
                  endTimeArray[1]
                );
              }
            }
            renderer.draw(".timetable");
            let counter = state.indexOfSchedule + 1;
            $("#schedule-counter").text(
              counter + " of " + state.allCombinations.length
            );
          }
        } else {
          var startTimeArray = state.allCombinations[
            state.indexOfSchedule
          ].start_time.split(":");
          var endTimeArray = state.allCombinations[
            state.indexOfSchedule
          ].end_time.split(":");
          var name =
            state.allCombinations[state.indexOfSchedule].subject_code +
            " " +
            state.allCombinations[state.indexOfSchedule].number_title;
          for (var j in dayCode) {
            if (
              state.allCombinations[state.indexOfSchedule].day_code.includes(
                dayCode[j]
              )
            ) {
              appendToTimetable(
                name,
                dayEquivalence(dayCode[j]),
                startTimeArray[0],
                startTimeArray[1],
                endTimeArray[0],
                endTimeArray[1]
              );
            }
          }
          renderer.draw(".timetable");
          let counter = state.indexOfSchedule + 1;
          $("#schedule-counter").text(
            counter + " of " + state.allCombinations.length
          );
        }
      }

      // If the current schedule selected has conflicting classes then return true;
      if (state.allCombinations.length) {
        detectCollision();
        detectTimePreferenceConflict();
        detectRatingPreferenceConflict();
        $(".collision").attr("title", "");
      }
    }

    //==================================================================================
    // Display Classes corresponding to a Subject category when the subject link is clicked.
    $(".subject-btn").on("click", function(event) {
      // Empties the classes list
      $("#classes-list").empty();
      // Gets the ID corresponding to the subject hyper link that has been clicked.
      let id = $(this).data("id");
      // Uses the ID of the subject and passes it to the routes in order to retrieve the classes corresponding to that subject
      $.ajax("/classes/" + id, {
        type: "GET"
      })
        .then(function(result) {
          // TODO: What is the reason behind the show() below?
          $(".classes-display").show();
          // Iterates over the result set of the classes and appends each class to the classes list
          for (var i in result) {
            let className = result[i].class_name;
            // The id of the class in the All Data table
            let classId = result[i].id;
            // The classes will be a List Item in ordered / unordered lists
            let classDiv = $("<li>");
            // Add an html class to the List Item HTML element that will be used for styling purposes
            classDiv.addClass("list-group-item");
            // Add's an attribute called class-id to used for unique identification
            classDiv.attr("class-id", classId);
            // The button that will be used to display all specific instances of a class.
            // This information is contained in the All Data table
            let openBtn = $("<button>");
            openBtn.addClass("btn btn-link open");
            openBtn.attr("type", "button");
            // The class name text is displayed on the button of the class
            openBtn.text(className);
            // A unique identifier for the button that controls the display of classes instances when a class is clicked
            openBtn.attr("data-id", classId);

            let addBtn = $("<button><i></i></button>");
            addBtn.addClass("btn btn-link add-classes li fa fa-plus");
            addBtn.attr("type", "submit");
            addBtn.attr("data-id", classId);
            addBtn.attr("data-name", className);
            addBtn.css("color", "#2e7fad");

            classDiv.append(openBtn);
            classDiv.append(addBtn);
            $("#classes-list").append(classDiv);

            let subclassDiv = $("<ul>");
            subclassDiv.addClass("list-group");
            subclassDiv.attr("id", "subclass-" + classId);
            $("#classes-list").append(subclassDiv);
          }
        })
        .fail(function(err) {
          console.log(err);
        });
    });
    //==================================================================================
    // Appends the classes corresponding to a specific subject
    $(document).on("click", ".add-classes", function() {
      let id = $(this).data("id");
      let className = $(this).data("name");

      // If the classes id is not in the class array add it
      if (state.classes.indexOf(id) == -1) {
        state.classes.push(id);

        let deleteBtn = $("<button><i></i></button>");
        deleteBtn.addClass("btn btn-link remove-class fa fa-times");
        deleteBtn.attr("type", "clear");
        deleteBtn.attr("data-id", id);
        deleteBtn.attr("schedule-type", "general-class");

        let listItem = $("<li>");
        listItem.addClass("list-group-item");
        listItem.attr("id", "class-list-id-" + id);
        listItem.append(className);
        listItem.append(deleteBtn);
        listItem.attr("schedule-type", "general-class");

        $("#classes-scheduled").append(listItem);
        generateAllCombinations();
      }
    });
    //==================================================================================
    // Appends the classes corresponding to a specific subject
    $(document).on("click", ".open", function() {
      let id = $(this).data("id");
      // This subclass div is where we append the class instances (coming from alldata)
      let classDiv = $("#subclass-" + id);
      $.ajax("/class/" + id, {
        type: "GET"
      })
        .then(function(result) {
          classDiv.empty();
          $(".classes-display").show();
          for (var i in result) {
            let start = result[i].start_time.split(":");
            let end = result[i].end_time.split(":");

            let startTime = start[0] + ":" + start[1];
            let endTime = end[0] + ":" + end[1];

            let dayCode = result[i].day_code;
            let instructorName = result[i].Instructor.name;

            let displayText =
              instructorName +
              "., " +
              dayCode +
              ": " +
              startTime +
              " - " +
              endTime;
            // let time = dayCode + ": " + startTime + " - " + endTime;

            let className = result[i].number_title;
            let classId = result[i].id;

            let classDivChild = $("<li>");
            classDivChild.addClass("list-group-item");
            classDivChild.attr("class-id", classId);
            // classDivChild.append(instructorName);
            classDivChild.append(displayText);

            let addBtn = $("<button><i></i></button>");
            addBtn.addClass("btn btn-link add-class fa fa-plus");
            addBtn.attr("type", "submit");
            addBtn.attr("data-id", classId);
            addBtn.attr("data-name", className);
            addBtn.attr("data-time", displayText);

            classDivChild.append(addBtn);
            classDiv.append(classDivChild);
          }
        })
        .fail(function(err) {
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
      if (state.alldata.indexOf(id) == -1) {
        state.alldata.push(id);

        let deleteBtn = $("<button><i></i></button>");
        deleteBtn.addClass("btn btn-link remove-class fa fa-times");
        deleteBtn.attr("type", "clear");
        deleteBtn.attr("data-id", id);
        deleteBtn.attr("schedule-type", "specific-class");

        let listItem = $("<li>");
        listItem.addClass("list-group-item");
        listItem.attr("id", "class-list-id-" + id);
        listItem.append(className);
        listItem.append($("<br>"));
        listItem.append(classTime);
        listItem.append(deleteBtn);
        listItem.attr("schedule-type", "specific-class");

        $("#classes-scheduled").append(listItem);

        generateAllCombinations();
      }
    });
    // =================================================================================
    // Remove Single Class from Schedule
    $(document).on("click", ".remove-class", function() {
      let id = $(this).data("id");
      let classType = $(this).attr("schedule-type");
      // Removes the specific class from the alldata array of the state OR the classes array
      if (classType == "general-class")
        removeFromArray(state.classes, parseInt(id));
      else if (classType == "specific-class")
        removeFromArray(state.alldata, parseInt(id));
      $("#class-list-id-" + id).remove();
      renderTimetable();
      generateAllCombinations();
      let counter = state.indexOfSchedule + 1;
      $("#schedule-counter").text(
        counter + " of " + state.allCombinations.length
      );
      if ((state.classes.length == 0) & (state.alldata.length == 0)) {
        $("#schedule-counter").text(0 + " of " + 0);
      }
      renderer.draw(".timetable");
    });
    // =================================================================================
    // Clear Class Schedule
    $(".clear-btn").on("click", function() {
      $(".collision").hide();
      renderTimetable();
      renderer.draw(".timetable");
      $("#classes-list").empty();
      $("#classes-scheduled").empty();
      $(".error-message").empty();
      state.alldata = [];
      state.indexOfSchedule = 0;
      state.classes = [];
      state.allCombinations = [];
      $("#schedule-counter").text(
        state.indexOfSchedule + " of " + state.allCombinations.length
      );
    });
    // =================================================================================
    // Render Timetable
    function renderTimetable() {
      timetable = new Timetable();
      renderer = new Timetable.Renderer(timetable);
      timetable.setScope(8, 21);
      timetable.addLocations([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ]);
    }
    // =================================================================================
    // Open/Close Nav Bar
    $("#navOpen").on("click", function() {
      if (state.navbar) {
        $(".navbar").css("width", "200px");
        $(".subject-display").css("margin-left", "200px");
        $(".student-schedule").css("margin-left", "200px");
        $(".collapsible").css("visibility", "visible");
        $(".full-menu").css("visibility", "visible");
        $(".icon-menu").css("padding-right", "0");
        state.navbar = false;
      } else {
        $(".navbar").css("width", "50px");
        $(".subject-display").css("margin-left", "50px");
        $(".student-schedule").css("margin-left", "50px");
        $(".collapsible").css("visibility", "hidden");
        $(".full-menu").css("visibility", "hidden");
        $(".fa-history").css("color", "#2E7FAD");
        state.navbar = true;
      }
    });
    // =================================================================================
    // Previous Permutation Function
    $(".control-prev").on("click", function() {
      if (state.allCombinations.length) {
        state.indexOfSchedule--;
        if (state.indexOfSchedule < 0) {
          state.indexOfSchedule = state.allCombinations.length - 1;
        }
        state.indexOfSchedule =
          state.indexOfSchedule % state.allCombinations.length;
      }
      renderTimetable();
      displayTable();
    });
    // =================================================================================
    // Next Permutation Function
    $(".control-next").on("click", function() {
      if (state.allCombinations.length) {
        state.indexOfSchedule++;
        state.indexOfSchedule =
          state.indexOfSchedule % state.allCombinations.length;
      }
      renderTimetable();
      displayTable();
    });
    // =================================================================================
    // View Saved Schedule
    $(document).on("click", ".view-saved", function() {
      renderTimetable();
      let scheduledId = $(this).attr("id");

      $.ajax("/api/saved_schedules_lines/" + scheduledId, {
        type: "GET"
      }).then(function(res) {
        for (var j in res) {
          let dayCode = res[j].AllDatum.day_code;
          let startTimeArray = res[j].AllDatum.start_time.split(":");
          let endTimeArray = res[j].AllDatum.end_time.split(":");
          let name = res[j].AllDatum.number_title;
          for (var j in dayCode) {
            if (dayCode.includes(dayCode[j])) {
              appendToTimetable(
                name,
                dayEquivalence(dayCode[j]),
                startTimeArray[0],
                startTimeArray[1],
                endTimeArray[0],
                endTimeArray[1]
              );
            }
          }
        }
        renderer.draw(".timetable");
      });
    });
    // =================================================================================
    // Dropdown Generator
    $(".dropdown-toggle").on("click", function() {
      if (state.dropdown) {
        $(".saved").remove();
        state.dropdown = false;

        let scheduleData = {
          user_id: parseInt(sessionStorage.getItem("user_id"))
        };

        $.ajax("/api/saved_schedules/" + scheduleData.user_id, {
          type: "GET"
        }).then(function(data) {
          for (var i in data) {

            let dropdownItem = $("<li>");
            dropdownItem.addClass("list-group-item saved");
            dropdownItem.attr("id","li-" + data[i].id)

            // Delete link for schedule
            let deleteBtn = $("<button></button>");
            deleteBtn.addClass("btn remove-saved-schedule");
            let iElem = $("<i></i>")
            iElem.addClass("fa fa-times")
            deleteBtn.attr("id", data[i].id);
            deleteBtn.append(iElem);

            // Name link for schedule
            let buttonLink = $("<button>");
            buttonLink.addClass("btn btn-link view-saved");
            buttonLink.text(data[i].schedule_name);
            buttonLink.attr("id", data[i].id);

            dropdownItem.append(deleteBtn)
            dropdownItem.append(buttonLink);
            $(".saved-schedules").append(dropdownItem);
          }
        });
      } else {
        state.dropdown = true;
        $(".saved-schedules").empty();
      }
    });
    // =================================================================================
    // Tooltip Hover
    $(function() {
      $('[data-toggle="tooltip"]').tooltip();
    });
    // =================================================================================
    // Save Schedule Name function
    $(".save-schedule-name-btn").on("click", function() {
      if (state.allCombinations[state.indexOfSchedule]) {
        scheduleName = $("#saved-schedule-name").val()
        let scheduleData = {
          user_id: parseInt(sessionStorage.getItem("user_id")),
          current_schedule: state.allCombinations[state.indexOfSchedule],
          schedule_name: scheduleName
        };
        $.ajax("/api/schedule", {
          type: "POST",
          data: scheduleData
        }).then(function(data) {
        });
      }
      // Alerting save success
      $(".alert-success").css("visibility", "visible");
      setTimeout(function() {
        $(".alert-success").css("visibility", "hidden");
      }, 2500);
    });
    // =================================================================================
    // Delete Saved Schedule
    $(document).on("click",".remove-saved-schedule", function(){
      id = $(this)[0].id
      let destroyData = {
        schedule_id: id
      }

      $.ajax("/api/schedule", {
         type: "DELETE",
         data: destroyData
       }).then(function(data) {
         $("#li-" + id).remove();
         console.log(data);
       });

    });
    // =================================================================================
    // Save Preferences
    $(".save-preferences-btn").on("click", function() {
      // Saving preferences in an object
      const userPref = {
        timeBefore: $("#time-before").val(),
        timeAfter: $("#time-after").val(),
        profRating: $("#prof-rating").val(),
        omitConflicts: $("#omit-conflicts").is(":checked")
      };

      // Stringifying object for storage & sending it to local storage
      const stringifiedUserPref = JSON.stringify(userPref);
      localStorage.setItem("userPreferences", stringifiedUserPref);

      // Alerting save success
      $(".alert-success").css("visibility", "visible");

      setTimeout(function() {
        $(".alert-success").css("visibility", "hidden");
      }, 2500);

      // Retrieving saved data from local storage
      //update the value of inputs with users saved preferences
      $(".time-before").attr("value", userPref.timeBefore);
      $(".time-after").attr("value", userPref.timeAfter);
      $(".prof-rating").attr("value", userPref.profRating);
      $(".omit-conflicts").attr("value", userPref.omitConflicts);

      if (state.allCombinations.length != 0) {
        generateAllCombinations();
        renderTimetable();
        displayTable();
      }
    });
    // =================================================================================
    // Log Out Function
    $(".log-out").on("click", function() {
      sessionStorage.removeItem("user_id");
    });
    // =================================================================================
    // Detect conflict
    function detectConflict(schedule) {
      let instructorRatingPreference = 0.0;
      let timeStartValidationText = "01:00";
      let timeAfterValidationText = "23:00";

      if (localStorage.getItem("userPreferences") != null)
        instructorRatingPreference =
          parseFloat(
            JSON.parse(localStorage.getItem("userPreferences")).profRating
          ) | 0.0;

      // If the userPreferences at local storage at NOT null then we can perform the extraction of the logic
      if (localStorage.getItem("userPreferences")) {
        var timeStartValidation = JSON.parse(
          localStorage.getItem("userPreferences")
        ).timeBefore;
        var timeAfterValidation = JSON.parse(
          localStorage.getItem("userPreferences")
        ).timeAfter;
      } else {
        var timeStartValidation = timeStartValidationText;
        var timeAfterValidation = timeAfterValidationText;
      }

      timeStartValidation =
        parseFloat(timeStartValidation.split(":")[0]) +
        parseFloat(timeStartValidation.split(":")[1]) / 60;

      timeAfterValidation =
        parseFloat(timeAfterValidation.split(":")[0]) +
        parseFloat(timeAfterValidation.split(":")[1]) / 60;

      if (schedule.length > 0) {
        for (var i in schedule) {
          let instructorRating = schedule[i].Instructor.rating;
          let startTimeArraySource = schedule[i].start_time.split(":");

          let startTimeNumberSource =
            parseFloat(startTimeArraySource[0]) +
            parseFloat(startTimeArraySource[1]) / 60;

          // Validation for instructor ratings
          if (
            (instructorRating != null) &
            (instructorRating < instructorRatingPreference)
          )
            return true;

          // Validation for time less than preference or time after preference
          if (
            (startTimeNumberSource < timeStartValidation) |
            (startTimeNumberSource > timeAfterValidation)
          )
            return true;

          let endTimeArraySource = schedule[i].end_time.split(":");

          let endTimeNumberSource =
            parseFloat(endTimeArraySource[0]) +
            parseFloat(endTimeArraySource[1]) / 60;

          for (var j = parseInt(i); j < schedule.length - 1; j++) {
            let startTimeArrayTarget = schedule[j + 1].start_time.split(":");
            let endTimeArrayTarget = schedule[j + 1].end_time.split(":");
            let startTimeNumberTarget =
              parseFloat(startTimeArrayTarget[0]) +
              parseFloat(startTimeArrayTarget[1]) / 60;

            if (
              startTimeNumberTarget >= startTimeNumberSource &&
              startTimeNumberTarget <= endTimeNumberSource &&
              schedule[i].day_code == schedule[j + 1].day_code
            )
              return true;
          }
        }

        return false;
      } else {
        let instructorRating = schedule.Instructor.rating;
        let startTimeArraySource = schedule.start_time.split(":");

        let startTimeNumberSource =
          parseFloat(startTimeArraySource[0]) +
          parseFloat(startTimeArraySource[1]) / 60;

        // Validation for instructor ratings
        if (
          (instructorRating != null) &
          (instructorRating < instructorRatingPreference)
        )
          return true;

        // Validation for time less than preference or time after preference
        if (
          (startTimeNumberSource < timeStartValidation) |
          (startTimeNumberSource > timeAfterValidation)
        )
          return true;

        return false;
      }
    }
  });
});
// =================================================================================
