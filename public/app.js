var myapp = angular.module('TodoList', ['ngRoute', 'ngAnimate']);
myapp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/tasks', {
            templateUrl: 'partials/tasks.html',
            controller: 'TaskController'
        }).
        when('/task', {
            templateUrl: 'partials/task.html',
            controller: 'TaskController'
        }).
        otherwise({redirectTo: '/tasks'});
}]);
myapp.controller('TaskController', function ($http, $location) {
    var app = this;
    var url = '/rest';

    app.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    app.initNewTask = function () {
        app.editTask = {_id: null, title: "", text: "", due: "", done: false};
    }

    function loadTasks() {
        $http.get(url + '/tasks').success(function (tasks) {
            app.tasks = tasks;
        });
    }

    app.saveTask = function (task) {
        if (task && task.title) {
            $http.post(url + '/add', {task: task}).success(function () {
                loadTasks();
                app.initNewTask();
                $location.path("/tasks");
            });
        }
    }

    app.showDetails = function (item) {
        if (item.show) {
            item.show = false;
        } else {
            item.show = true;
        }
    }

    app.deleteTask = function (task) {
        if (confirm('Really delete?')) {
            $http.post(url + '/delete', {task: task}).success(function () {
                loadTasks();
            });
        }
    }
    app.setDone = function (task, done) {
        task.done = done;
        app.saveTask(task);
    }

    app.initNewTask();
    loadTasks();
});
