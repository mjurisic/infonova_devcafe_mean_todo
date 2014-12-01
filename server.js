var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todolist');

var Task = mongoose.model('Task', {title: String, text: String, due: Date, done: Boolean});

app.get('/rest/tasks', function (req, res) {
    Task.find({}, function (err, tasks) {
        if (err) {
            res.send(err);
        } else {
            res.send(tasks);
        }
    });
});

app.post('/rest/add', function (req, res) {
    var newTask = new Task(req.body.task);
    if (newTask._id) {
        Task.findOneAndUpdate({_id: newTask._id}, {
            title: newTask.title,
            text: newTask.text,
            due: newTask.due,
            done: newTask.done
        }, function (err) {
            if (err) {
                console.log(err);
            }
            res.send();
        });
    } else {
        newTask.save(function (err) {
            res.send();
        });
    }
});

app.post('/rest/delete', function (req, res) {
    var task = req.body.task;
    if (task) {
        Task.find({_id: task._id}).remove(function (err) {
            if (err) {
                console.log(err);
            }
            res.send();
        })
    }
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.get(/^(.+)$/, function (req, res) {
    res.sendFile(path.join(__dirname, 'public/' + req.params[0]));
});

app.listen(80);
