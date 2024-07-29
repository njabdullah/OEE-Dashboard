// var initialTime = new Date();
// var dateElement = document.getElementById('date');
// var timeElement = document.getElementById('time');

// function updateDateTime() {
//     var now = new Date();
//     var timeSinceStart = now.getTime() - initialTime.getTime();
//     var adjustedTime = new Date(initialTime.getTime() + timeSinceStart);

//     var date = adjustedTime.getFullYear() + '-' +
//                ('0' + (adjustedTime.getMonth() + 1)).slice(-2) + '-' +
//                ('0' + adjustedTime.getDate()).slice(-2);
//     var time = ('0' + adjustedTime.getHours()).slice(-2) + ':' +
//                ('0' + adjustedTime.getMinutes()).slice(-2) + ':' +
//                ('0' + adjustedTime.getSeconds()).slice(-2);

//     dateElement.textContent = date;
//     timeElement.textContent = time;

//     updateMachineStatus(date, time);
//     requestAnimationFrame(updateDateTime);
// }

var startTime = new Date('2024-07-02T21:00:58');
var initialTime = new Date();
var dateElement = document.getElementById('date');
var timeElement = document.getElementById('time');

function updateDateTime() {
    var now = new Date();
    var timeSinceStart = now.getTime() - initialTime.getTime();
    var adjustedTime = new Date(startTime.getTime() + timeSinceStart);

    var date = adjustedTime.getFullYear() + '-' +
               ('0' + (adjustedTime.getMonth() + 1)).slice(-2) + '-' +
               ('0' + adjustedTime.getDate()).slice(-2);
    var time = ('0' + adjustedTime.getHours()).slice(-2) + ':' +
               ('0' + adjustedTime.getMinutes()).slice(-2) + ':' +
               ('0' + adjustedTime.getSeconds()).slice(-2);

    dateElement.textContent = date;
    timeElement.textContent = time;

    updateMachineStatus(date, time);
    requestAnimationFrame(updateDateTime);
}