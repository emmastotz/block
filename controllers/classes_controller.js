// ====================================================
// DEPENDENCIES
// ====================================================
const db = require("../models");
// ====================================================
// ROUTES
// ====================================================
module.exports = function(app) {
  app.get("/", function(req, res){
    db.Subjects.findAll({}).then(function(data) {
      var dataObj = {
        subject: data
      };
      res.render("index",dataObj);
    });
  });
  // ====================================================
  app.get("/class/:classKey", function(req, res) {
    db.AllData.findAll({
      where: {
        SubjectId: req.params.classKey
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
};
// ====================================================