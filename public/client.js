var socket = io();

var connectionCount = document.getElementById('connection-count');

socket.on('usersConnected', function (count) {
  connectionCount.innerText = 'Connected Users: ' + count;
});

var statusMessage = document.getElementById('status-message');

socket.on('statusMessage', function (message) {
  statusMessage.innerText = message;
});

var buttons = document.querySelectorAll('#choices button');

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function () {
    socket.send('voteCast', this.innerText);
  });
}

var resultCount = document.getElementById('results');

socket.on('voteCount', function (votes) {
  var results = "Results: ";
    for (var vote in votes) {
      results = results + vote + ": " +  votes[vote] + " "
    };
  resultCount.innerText = results;
});