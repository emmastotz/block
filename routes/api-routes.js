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
};
// ====================================================