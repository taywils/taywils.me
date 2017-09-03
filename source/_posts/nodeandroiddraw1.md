---
title: Android Realtime Whiteboard App with NodeJS Part I
date: 2015-01-15
tags: [javascript, android, nodejs]
categories: [tutorial]
comments: true
---
A while back I had interviewed with a company that was looking to hire a full-stack developer with experience building Android apps and who knew just enough NodeJS to work on their realtime socket-based backend code. After speaking on the phone the company and I came to the conclusion that they would judge my application on how well I performed on the take-home coding assignment which was to develop a real-time whiteboard/drawing application together with an accompanying Android app. 

<!-- more -->
Unfortunately I never got that job but the results of the take-home assignment I coded together one evening did impress a few of the devs on their team. Anyways, lets step through the server code.

## Part I: The NodeJS Socket.IO Server
Our whiteboard app will need the following from a server perspective.

- The ability for multiple users to connect in realtime

- A way for users to draw on the whiteboard using their mouse

- A method for 'clearing' the whiteboard to start fresh

Those were the conditions given to me during by the company I was interviewing for and as an additional requirement the whiteboard app had to serve both web and mobile clients simultaneously. Given that we want to write our application in NodeJS we will need to choose the following libraries in order to build out a robust functioning application in the shortest time span.

### Server Requirements

1) A reliable web-framework

2) An easy to use web-socket implementation 

At the time those requirements basically boiled down to choosing the _Express_ web framework for NodeJS and the _Socket.IO_ library for quickly spinning up a real-time bi-directional event based web service.

- [ExpressJS Homepage][link_socket_io]

- [Socket.IO Homepage][link_socket_io]

### Project Initialization

*Install Node.js on your development machine before you begin.*

Create a new directory and call it whiteboard-server.

```
mkdir whiteboard-server
```

Now run the npm command to initialize a new project.

```
cd whiteboard-server
npm init
```

Just press enter for all of the questions you will be prompted with. Once that is done we'll add dependencies to our `package.json` file. From within the project directory `whiteboard-server` run the following three commands.

```
npm install express --save-dev
npm install socket.io --save-dev
npm install logfmt --save-dev
```

At this moment make sure your `package.json` file resembles mine.

```javascript
{
  "name": "whiteboard-server",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "",
    "license": "ISC",
    "scripts": {
      "start": "node index.js"
    },
    "devDependencies": {
      "express": "^4.15.2",
      "logfmt": "^1.2.0",
      "socket.io": "^1.7.3"
    }
}
```

Finally lets write the server component; add a new file call it `index.js`

```
touch index.js
```

### Server Code

Open `index.js`; we begin by importing a few libraries and setting the default PORT number. Later when we run our server we can connect to it on `localhost:5000`.

```javascript
// index.js

var app = require('express')();
var logfmt = require('logfmt');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = 5000;
```

Next, in order to define our whiteboard we need to choose a representative data structure. In our case we want to imagine that each drawable portion of our whiteboard is a tiny square representing say an index in a 2D array. If the value ofthe 2D array at any co-ordinate pair is `false` that means there is no ink. Thus our whiteboard will be initialized as a 2D array where every element of our array is false;

```javascript
// index.js

var BOARD_ROWS = 500;
var BOARD_COLS = 500;

var initBoard = function() {
  var matrix = [];
  for(var row = 0; row < BOARD_ROWS; ++row) {
    var matrixRow = [];
    for(var col = 0; col < BOARD_COLS; ++col) {
      matrixRow.push(false);
    }
    matrix.push(matrixRow);
  }
  return matrix;
};
```

We have our function called `initBoard` which we can now store as a variable to represent the initial state of our whiteboard. I choose to call it paintBoard in order to distinguish it from the title of the article.

```javascript
// index.js

var paintBoard = initBoard();
```

Remember earlier when we defined our `Express` server as `var app = require('express')();`. Lets define the port, attach the log format middleware and set a single endpoint for our clients to connect to. The singular endpoint `/` located at the root directory of our web app will return the file `index.html` which will render the interactive web-socket based UI for clients connecting over their web browsers.

```javascript
// index.js

var port = Number(process.env.PORT || PORT);

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  res.sendFile("./index.html", { root: __dirname });
});
```

> Don't worry about the contents of index.html yet; we will be covering the web UI in part II of this series

## Server Socket.io Code

So far we have setup our web server, defined the whiteboard as a matrix of boolean elements and imported the necessary libraries to run our app but the last piece of the puzzle is the actual socket code.

Surprisingly we aren't building the most complex whiteboard application so our socket code will broken up into the following

- Event listeners

- Event handlers(also known as emitters)

---

### Event listeners

1) `connection` When a new client connects

2) `paint` When a client sends a paint event

3) `debug` During testing if we want to verify our server-client connection 

4) `clear` When the client clears all ink from the whiteboard

5) `disconnect` self explanatory

---

### Event handlers(emitters)

1) `newClient` Server emits that a new connection has been made

2) `paint` Server lets everyone know when a client has drawn

3) `debug` Acknowledges the clients debug event

4) `clear` Server lets clients know that the board has been cleared

---

Socket.io has a very conscise API, to begin we need to wrap our event calls in a `io.on(...)` block.

```javascript
// index.js

io.on('connection', function(socket) {
  /* Rest of socket code will go here */
});
```

With the `io` block defined and given a socket instance lets go ahead and write our events. The very first event will trigger immediately after the client enters the `connection` block so we should send them the current state of the paint board.

```javascript
io.emit('newClient', paintBoard);
```

Next we are going to react or listen and take action on the various listeners we outlined earlier in the article. For instance when the server handles a `paint` event it should paint the co-ordinates and let every client know the board has been drawn on.

```javascript
socket.on('paint', function(paintCoord) {
  paintBoard[paintCoord.x][paintCoord.y] = true;
  socket.broadcast.emit('paint', paintCoord);
});
```

When a client sends a debug message we simply want to echo it back.

```javascript
socket.on('debug', function(msg) {
  io.emit('debug', "Echo from the server: " + msg);
});
```

On `clear` we need to reset the paintBoard and immediately send off a signal to the client so they know to clear their board as well.

```javascript
socket.on('clear', function(clearMsg) {
  paintBoard = initBoard();
  io.emit('clear', "clear");
});
```

Finnally we should print a message for our server to acknowledge that a client has disconnected.

```javascript
socket.on('disconnect', function(){
  //console.log('Client Disconnected');
});
```

Now that we have our server code in place let listen for new clients and together with the web UI we'll cover in part II we can start running our application.

```javascript
// index.js

var app = require('express')();
var logfmt = require('logfmt');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = 5000;

var BOARD_ROWS = 500;
var BOARD_COLS = 500;
var initBoard = function() {
  var matrix = [];
  for(var row = 0; row < BOARD_ROWS; ++row) {
    var matrixRow = [];
    for(var col = 0; col < BOARD_COLS; ++col) {
      matrixRow.push(false);
    }
    matrix.push(matrixRow);
  }
  return matrix;
};

var paintBoard = initBoard();

var port = Number(process.env.PORT || PORT);

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  res.sendFile("./index.html", { root: __dirname });
});

io.on('connection', function(socket) {
  //console.log("Client Connected");
  io.emit('newClient', paintBoard);

  socket.on('paint', function(paintCoord) {
    //console.log('paint: [x = ' + paintCoord.x + ", y = " + paintCoord.y + "]");
    paintBoard[paintCoord.x][paintCoord.y] = true;
    socket.broadcast.emit('paint', paintCoord);
  });

  socket.on('debug', function(msg) {
    io.emit('debug', "Echo from the server: " + msg);
  });

  socket.on('clear', function(clearMsg) {
    //console.log('onClear');
    paintBoard = initBoard();
    io.emit('clear', "clear");
  });

  socket.on('disconnect', function(){
    //console.log('Client Disconnected');
  });
});

http.listen(port, function() {
  console.log('Whiteboard server now running on HOST:' + port);
});
```

## Link To Full Source Code

- [https://github.com/taywils/herokunodetest][link_github_project]

[Click here for part II][link_part_2]

[link_part_2]: /2015/02/20/nodeandroiddraw2
[link_socket_io]: https://socket.io/
[link_express_js]: http://expressjs.com/
[link_github_project]: https://github.com/taywils/herokunodetest
