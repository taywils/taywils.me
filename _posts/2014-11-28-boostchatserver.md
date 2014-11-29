---
layout: post
title: C++ Chat Server Tutorial Part II
mydate: Nov 28 2014
tags: [cpp]
catagories: [tutorial, socket-programming, multi-threading]
comments: true
description: In part 2 of the C++ boost chat application tutorial we'll develop the server side code. It uses a bit more C++ coding but the same concepts apply from the first article in the series.
---
## C++ Chat Server Tutorial Part II (DRAFT)

<div class="post-content" markdown="1">
### Intro

[Click here for Part I](/2014/11/15/boostchatclient.html)

#### Tutorial Assumes Boost Version >= 1.53

Welcome to the second part of the chat application tutorial. In this part we'll be finishing up our chat appliation by writting the server side code which handles accepting new messages and routing them out to each of the connected clients. Much like the client application the server uses TCP/IP sockets, threads and relies on the producer-consumer pattern to store messages within a queue. However unlike the client app the server application will use mutually exclusive locks for its concurrency strategy and introduce a few more Boost smart pointers.

The same guidelines for what you need to have installed on your machine apply from the first part of this tutorial. So if you need to download the latest version of the Boost C++ Libraries on your machine refer to part I. Other than the necessary Boost C++ libs you should also again be using a modern C++ compiler that supports at minimum the C++11 standard; ok enough talk lets start coding.

### Part II: The Chat Server Code

### Full Source Code
<script src="https://gist.github.com/taywils/d0e7e099b5c172dbcf34.js"> </script>

</div>