---
title: Android Realtime Whiteboard App with NodeJS Part II
date: 2015-02-20
tags: [javascript]
categories: [tutorial]
comments: false
banner: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/nodeandroiddraw2.jpg
thumbnail: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/nodeandroiddraw2.jpg
---
Welcome to part II of the Realtime Whiteboard App with NodeJS. In this part we will go over the web UI interface which uses a bit of javascript and will work with the NodeJs server from [part I][link_part_1].

<!-- more -->
## Part II: The UI Interface
As discussed previously the server is expecting the UI to emit four key events.

1) `newClient`

2) `paint`

3) `clear`

4) `debug`

---

As our main focus is on code, lets get the HTML out of the way first. In the same directory from [part I][link_part_1] create a new file title it `index.html`. If you recall from our server code when a client connects to our server at the root '/', we wrote it to respond by sending out the contents of file specifically named `index.html`. On the command line create the file.

```
touch index.html
```

The first couple of lines are just the necessary tags `<html>`, `<head>` and `<body>`. We will also add our javascript dependencies from [http://cdnjs.cloudflare.com][link_cdnjs]; namely jQuery and SocketIO.

```html
<!doctype html>
<html>
  <head>
    <title>HerokuNodeTestWebClient</title>
    <style>
      body {
        background-color: #C0C0C0;
      }
    </style>
  </head>
  <body>
    <h1>Whiteboard Web Client (BETA)</h1>
    <h4>*BETA version doesn't use floating point precision please move your mouse slowly</h4>
    <h4 id="timerNote">Please wait about 10 seconds for socketIO to connect to server</h4>
    <button id="clearButton">Clear WhiteBoard</button>
    <canvas id="myCanvas" width="500" height="500"></canvas>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.3/socket.io.min.js"></script>
    <script>
    <!-- rest of code will go here -->
    </script>
  </body>
</html>
```

### Drawing Canvas and SocketIO
In order to do anything drawing related we will need to set some variables and initiate our socket connection.

```javascript
var socket = io(); // Socket connection
var canvas; // HTML5 canvas
var context; // Drawing context for our canvas
var oldX; // X coordinate of our mouse
var oldY; // Y coordinate of our mouse
var isMouseDown = false; // Are we currently drawing
var randomStrokeStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
```

With the initial variables declared we next will add a utility function to setup the HTML5 canvas. We are going to be using jQuery for binding the canvas events which are easy enough to grasp as they only involve what should happen when the user operates his mouse within the context of the canvas area.

Much akin to our socket code that we wrote for the server, HTML5 canvas events can be setup by `binding` keywords such as `mousemove` using jQuery. As you can already guess the function sent as the callback argument to the jQuery binding will be triggered on when the user moves his mouse. The same logic applies for the other binding events `mousedown`, `mouseup` and `mouseleave`.

```javascript
function setupCanvas() {
  canvas = document.getElementById('myCanvas');
  context = canvas.getContext("2d");
  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, 500, 500);

  $myCanvas = jQuery("#myCanvas");

  $myCanvas.bind("mousedown",function(e) {
    isMouseDown = true;
    paint(
      e.pageX - $(this).offset().left,
      e.pageY - $(this).offset().top,
      false
    );
  });

  $myCanvas.bind("mousemove", function(e) {
    if(isMouseDown) {
      paint(
        e.pageX - $(this).offset().left, 
        e.pageY - $(this).offset().top,
        true
      );
    }
  });

  $myCanvas.bind("mouseup", function(e) {
    isMouseDown = false;
  });

  $myCanvas.bind("mouseleave", function(e) {
    isMouseDown = false;
  });
}
```

The little bit of plane geometery necessary to understand the `paint` functions is trivial. Remember how we are using a 2D array to store the drawing points? The canvas is can be placed at any arbitrary location on our screen but in order to map the coordinates properly to a 2D array that begins at `[0][0]` we just take the position of the mouse event `e.pageX` and subtract the distance from the left edge of the canvas. For the vertical positions the same idea, take `e.pageY` and subtract the distance from the top edge of the canvas.

### Painting

In the `setupCanvas()` function within the `mouse` binding events you should have noted the `paint()` method. Its signature takes an `x`, `y` coordinate pair and a `boolean` that indicates whether or not the mouse is currently being dragged or not.

Whenever we decide to paint we should be doing three things

1) Sending `paint` events through our socket

2) Drawing lines on our canvas

3) Storing the previous position of our mouse

---

The socket code accepts two arguments, a string with the eventName and a json object with the event payload. Which for us is `paint` and a json object with `{ "x": someNumber, "y": someNumber }`.

```javascript
function paint(x, y, mouseState) {
  if(mouseState) {
    socket.emit(
      'paint',
      {
        "x": Math.round(x),
        "y": Math.round(y)
      }
    );
    context.beginPath();
    context.strokeStyle = randomStrokeStyle;
    context.lineWidth = 3;
    context.lineJoin = "round";
    context.moveTo(oldX, oldY);
    context.lineTo(x, y);
    context.closePath();
    context.stroke();
  }
  oldX = x;
  oldY = y;
}

```
In the above code we sent a paint event out to our server, but what about the reverse? In the incident that the server sends a `paint` event to our web client we should update our canvas.

```javascript
function paintPoint(x, y, color) {
  context.fillStyle = color;
  context.fillRect(x, y, 3, 3);
}
```

### Socket Event-Handling

Lastly we'll want to set our drawing canvas and start processing the events sent to our socket, in addition we also have to handle the event after a user decides to clear the board.

```javascript
setupCanvas();

jQuery('#clearButton').bind("click", function() {
  socket.emit('clear', "clear");
  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, 500, 500);
});
```

For development purposes only we have the debug events; the first event sends a `debug` message out to the server and second handles the `debug` event sent from the server.

```javascript
socket.emit('debug', "Hello from web client");

socket.on('debug', function(msg) {
  console.log(msg);
});

socket.on('clear', function(msg) {
  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, 500, 500);
});
```

Whenever a new client joins the server we will want to update our board and paint it accordingly.

```javascript
socket.on('newClient', function(paintBoard) {
  //console.log("Loading paintBoard");
  for(var row = 0; row < paintBoard.length; ++row) {
    for(var col = 0; col < paintBoard[row].length; ++col) {
      if(true == paintBoard[row][col]) {
        paintPoint(row, col, "green");
      }
    }
  }
});

socket.on('paint', function(paintCoord) {
  paintPoint(paintCoord.x, paintCoord.y, "green");
});
```

Thats it for part II; in the third and final part of this series we will finally write the code for the Android client.

## Full Code

```html
<!-- index.html -->
<!doctype html>
<html>
  <head>
    <title>HerokuNodeTestWebClient</title>
    <style>
      body {
        background-color: #C0C0C0;
      }
    </style>
  </head>
  <body>
    <h1>Whiteboard Web Client (BETA)</h1>
    <h4>*BETA version doesn't use floating point precision please move your mouse slowly</h4>
    <h4 id="timerNote">Please wait about 10 seconds for socketIO to connect to server</h4>
    <button id="clearButton">Clear WhiteBoard</button>
    <canvas id="myCanvas" width="500" height="500"></canvas>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.3/socket.io.min.js"></script>
    <script>
      var socket = io();
      var canvas;
      var context;
      var oldX;
      var oldY;
      var isMouseDown = false;
      var randomStrokeStyle = '#'+Math.floor(Math.random()*16777215).toString(16);

      function setupCanvas() {
        canvas = document.getElementById('myCanvas');
        context = canvas.getContext("2d");
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, 500, 500);

        $myCanvas = jQuery("#myCanvas");

        $myCanvas.bind("mousedown",function(e) {
          isMouseDown = true;
          paint(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
        });

        $myCanvas.bind("mousemove", function(e) {
          if(isMouseDown) {
            paint(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
          }
        });

        $myCanvas.bind("mouseup", function(e) {
          isMouseDown = false;
        });

        $myCanvas.bind("mouseleave", function(e) {
          isMouseDown = false;
        });
      }

      function paint(x, y, mouseState) {
        if(mouseState) {
          socket.emit('paint', {"x": Math.round(x), "y": Math.round(y)});
          context.beginPath();
          context.strokeStyle = randomStrokeStyle;
          context.lineWidth = 3;
          context.lineJoin = "round";
          context.moveTo(oldX, oldY);
          context.lineTo(x, y);
          context.closePath();
          context.stroke();
        }
        oldX = x;
        oldY = y;
      }

      function paintPoint(x, y, color) {
        context.fillStyle = color;
        context.fillRect(x, y, 3, 3);
      }

      setupCanvas();

      jQuery('#clearButton').bind("click", function() {
        //console.log("emit 'clear'");
        socket.emit('clear', "clear");
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, 500, 500);
      });

      socket.emit('debug', "Hello from web client");

      socket.on('debug', function(msg) {
        console.log(msg);
      });

      socket.on('clear', function(msg) {
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, 500, 500);
      })

      socket.on('newClient', function(paintBoard) {
        //console.log("Loading paintBoard");
        for(var row = 0; row < paintBoard.length; ++row) {
          for(var col = 0; col < paintBoard[row].length; ++col) {
            if(true == paintBoard[row][col]) {
              paintPoint(row, col, "green");
            }
          }
        }
      });

      socket.on('paint', function(paintCoord) {
        paintPoint(paintCoord.x, paintCoord.y, "green");
      })
    </script>
  </body>
</html>
```

[Click here for part I][link_part_1]

[link_part_1]: /2015/01/15/nodeandroiddraw1
[link_cdnjs]: http://cdnjs.cloudflare.com
