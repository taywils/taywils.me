---
title: Android Realtime Whiteboard App with NodeJS Part I
date: 2015-01-15
tags: [javascript, android, nodejs]
categories: [tutorial]
comments: false
banner: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/nodeandroiddraw1.jpg
thumbnail: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/nodeandroiddraw1.jpg
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

## Link To Full Source Code

- [https://github.com/taywils/herokunodetest][link_github_project]

[link_socket_io]: https://socket.io/
[link_express_js]: http://expressjs.com/
[link_github_project]: https://github.com/taywils/herokunodetest
