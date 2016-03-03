const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app)
                 .listen(port, function () {
                    console.log('Listening on port ' + port + '.');
                  });

const socketIo = require('socket.io');
const io = socketIo(server);
const countVotes = require('./lib/count-votes');
const votes = require('./lib/votes');
const generateId = require('./lib/generate-id');

app.use(express.static('public'));
app.locals.title = 'Hustle Time'
app.locals.polls = {}
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/poll', function(req, res){
  var poll = req.body.poll;
  var id = generateId();
  var adminId = req.body.poll.adminId;
  app.locals.polls[id] = poll;
  poll['adminId'] = adminId;
  poll['id'] = id;
  poll['votes'] = [];

  res.redirect('/polls/' + id + "/" + adminId);
});

app.get('/polls/:id', function(req, res) {
  var poll = app.locals.polls[req.params.id];
  res.render('admin-poll-view', {poll: poll, votes: countVotes(poll)});
})

app.get('/polls/admin/:adminId', function(req, res){
  var pollList = [];
  var keys = Object.keys(app.locals.polls)
  for (var i = 0; i < keys.length; i++){
    var poll = app.locals.polls[keys[i]];
    if(poll['adminId'] === req.params.adminId){ pollList.push(poll)}
  }
  res.render('hustle-admin-view', {polls: pollList});
})

app.get('/polls/:id/:adminId', function(req, res){
  var poll = app.locals.polls[req.params.id];
  res.render('admin-poll-view', {poll: poll, id: req.params.id, adminID: req.params.adminId, votes: countVotes(poll)});
})

io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected.');
	
  socket.on('message', function (channel, message) {
  if (channel === 'voteCast') {
    var poll = app.locals.polls[message.id]
    poll['votes'].push(message.option);
    votes[socket.id] = message;
    socket.emit('voteCount-' + poll.id, countVotes(poll));
    // socket.emit('userVote', message);
  	}
	});

	socket.on('disconnect', function () {
	  console.log('A user has disconnected.', io.engine.clientsCount);
	  delete votes[socket.id];
	  // socket.emit('voteCount-' + pollId, countVotes(poll));
	  io.sockets.emit('usersConnected', io.engine.clientsCount);
	});

});

module.exports = server;
