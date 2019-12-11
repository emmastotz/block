// ====================================================
// DEPENDENCIES
// ====================================================
const db = require("../models");
// ====================================================
// ROUTES
// ====================================================
module.exports = function(app) {
  app.get("/index", function(req, res){
    db.Subjects.findAll({}).then(function(data) {
      var dataObj = {
        subject: data
      };
      res.render("index",dataObj);
    });
  });
  // ====================================================
  app.get("/classes/:SubjectId", function(req, res) {
    db.Classes.findAll({
      where: {
        SubjectId: req.params.SubjectId
      }
    }).then(function(result){
      res.json(result);
    }).catch(function(err){
      res.json(400, err);
    });
  });
  // ====================================================
  app.get("/class/:classKey", function(req, res) {
    db.AllData.findAll({
      where: {
        ClassId: req.params.classKey
      }
    }).then(function(result){
      res.json(result);
    }).catch(function(err){
      res.json(400, err);
    });
  });
  // ====================================================
  app.get("/classes/all/:AllDataId", function(req, res) {
    db.AllData.findAll({
      where: {
        id: req.params.AllDataId
      }
    }).then(function(result){
      res.json(result);
    }).catch(function(err){
      res.json(400, err);
    });
  });
  // ====================================================
  app.get("/schedule/:allDataKey", function(req, res) {
    db.AllData.findAll({
      where: {
        inSchedule: true
      }
    }).then(function(result){
      res.json(result);
    }).catch(function(err){
      res.json(400, err);
    });
  });
  // ====================================================
  app.put("/classes/update/:id", function(req, res) {
    console.log(req.body.inSchedule);
    db.AllData.update({
      inSchedule: req.body.inSchedule
    }, { 
      where: { id: req.params.id }
    }).then(function(result){
      res.json(result);
    }).catch(function(err){
      res.json(400, err);
    });
  });
  // ====================================================
  app.put("/classes/clear/", function(req, res) {
    console.log(req.body.inSchedule);
    db.AllData.update({
      inSchedule: req.body.inSchedule
    }, { 
      where: { inSchedule: true }
    }).then(function(result){
      res.json(result);
    }).catch(function(err){
      res.json(400, err);
    });
  });
  // ====================================================
  app.get("/api/login/:email",function(req,res){
    db.User.findAll({
        where : {email : req.params.email}
    }).then(function(data){
        res.json(data);
    });
  });
  // ====================================================
  // Create a user
  app.post("/api/user", function(req, res){
    db.User.create({ 
            email: req.body.email,
            password: req.body.password
    }).then(function(data){
        res.json(data);
    }).catch(function(err){
        console.log("Here is the error section at routes!");
        throw err;
    });
  });
  // ====================================================
  // Saved a schedule
  app.post("/api/schedule", function(req, res){
    db.savedSchedules.create({
      user_id: req.body.user_id
    }).then(function(data){
      console.log(data);
      for(var i = 0; i < req.body.current_schedule.length; i++){
        db.savedSchedulesLines.create({
          saved_schedules_id: data.id,
          alldata_id: parseInt(req.body.current_schedule[i].id)
        })
      }
    }).catch(function(err){
        console.log("Here is the error section at routes!");
        throw err;
    });
  });
  // ====================================================
  // Retrieve ALL headers for ALL saved schedules corresponding to ONE user
  // ====================================================
    app.get("/api/saved_schedules/:user_id",function(req,res){
      db.savedSchedules.findAll({
          where : {
            user_id : req.params.user_id
          }
      }).then(function(data){
          res.json(data);
      });
    });
  // ====================================================
  // Retrieve the class information corresponding to A particular saved schedule
  // ====================================================
  app.get("/api/saved_schedules_lines/:saved_schedules_id",function(req,res){
    db.savedSchedulesLines.findAll({
        where : {
          saved_schedules_id : req.params.saved_schedules_id
        },
        include: [db.AllData]
    }).then(function(data){
        res.json(data);
    });
  });
};
// ====================================================