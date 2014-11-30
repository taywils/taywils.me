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

Once again we'll be using the C++ standard libs along with [Boost Asio](http://www.boost.org/doc/libs/1_57_0/doc/html/boost_asio.html). To begin create a new file within the same directory where you wrote the code for [Part I](/2014/11/15/boostchatclient.html), name the file __boostChatServer.cpp__. Next open the file you just created and we'll start off with the preprocessor definitions and declare use of namespaces.

<div class="gcp" markdown="0"> <pre class="prettyprint">
/* boostChatServer.cpp */
#include&lt;iostream&gt;
#include&lt;list&gt;
#include&lt;map&gt;
#include&lt;queue&gt;
#include&lt;cstdlib&gt;

#include&lt;boost/asio.hpp&gt;
#include&lt;boost/thread.hpp&gt;
#include&lt;boost/asio/ip/tcp.hpp&gt;

using namespace std;
using namespace boost::asio;
using namespace boost::asio::ip;
</pre></div>

Moving right along the next segment of the ChatServer code are the typedefs; hopefully you'll agree with my choice of typedefs to hide all of the Boost smart pointer extra typing since this codebase does not use the standard C++11 smart pointers.

<div class="gcp" markdown="0"> <pre class="prettyprint">
/* boostChatServer.cpp */
typedef boost::shared_ptr&lt;tcp::socket&gt; socket_ptr;
typedef boost::shared_ptr&lt;string&gt; string_ptr;
typedef map&lt;socket_ptr, string_ptr&gt; clientMap;
typedef boost::shared_ptr&lt;clientMap&gt; clientMap_ptr;
typedef boost::shared_ptr&lt; list&lt;socket_ptr&gt; &gt; clientList_ptr;
typedef boost::shared_ptr&lt; queue&lt;clientMap_ptr&gt; &gt; messageQueue_ptr;
</pre></div>

### Overview Of The Chat Server

- __ClientMap__ Maps client socket connections to client messages
- __ClientList__ Stores pointers to each new client connected to the server.
- __MessageQueue__ Collects messages sent to the server and routes them to connected clients.

Together with the three threads of execution we'll introduce shortly the ClientMap, List and MessageQueue can be used together with locks to build a functioning chat server. In short we'll have one thread be responsible for accepting new client connections and adding them to the list of connected clients as individual socket pointers. Next when a new message request hits the server, its content gets pumped into the MessageQueue during the request from within the request handling thred and later the response handling thread consumes the MessageQueue out to each of the clients in the list.

### Function Prototypes And Initial Setup

<div class="gcp" markdown="0"> <pre class="prettyprint">
/* boostChatServer.cpp */
io_service service;
tcp::acceptor acceptor(service, tcp::endpoint(tcp::v4(), 8001));
boost::mutex mtx;
clientList_ptr clientList(new list&lt;socket_ptr&gt;);
messageQueue_ptr messageQueue(new queue&lt;clientMap_ptr&gt;) ;

const int bufSize = 1024;
enum sleepLen // Time is in milliseconds
{
	sml = 100,
	lon = 200
};

// Function Prototypes
bool clientSentExit(string_ptr);
void disconnectClient(socket_ptr);
void acceptorLoop();
void requestLoop();
void responseLoop();
// End of Function Prototypes
</pre></div>

### Full Source Code
<script src="https://gist.github.com/taywils/d0e7e099b5c172dbcf34.js"> </script>

</div>