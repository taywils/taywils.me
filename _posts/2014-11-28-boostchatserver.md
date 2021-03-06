---
layout: post
title: C++ Chat Server Tutorial Part II
mydate: Nov 28 2014
tags: [cpp]
catagories: [tutorial, socket-programming, multi-threading]
comments: true
description: In part 2 of the C++ boost chat application tutorial we'll develop the server side code. It uses a bit more C++ coding but the same concepts apply from the first article in the series.
---
## C++ Chat Server Tutorial Part II

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

The key variable definiton from above is the use of boost::mutex. As I mentioned earlier and as I will continue to mention, the code presented in this article was intented to be used with the Boost libraries so clever readers will note that C++ now has a standard std::mutex for builtin lock based synchronization. However, getting back to the subject of mutexes we will be using our mutex for controlling access to objects which are accessed from different threads; in particular the MessageQueue needs to be locked both before messages are enqueued and before message are dequeued from the front. In general since queues are first-in-first-out FIFO datastructures you can be pretty safe that producers(adding message onto the back) and consumers(reading messages from the front) wont ever have to compete but its better safe than sorry thus MessageQueue access must be synchronized in this case.

### Main Function

The main function creates each of the three threads indicated by the suffix "Loop"
- __acceptorLoop__ Handles new client TCP/IP connections
- __requestLoop__ Handles client requests by adding them to MessageQueue(producer)
- __responseLoop__ Handles server responses to the clients, reads from the MessageQueue(consumer)

<div class="gcp" markdown="0"> <pre class="prettyprint">
/* boostChatServer.cpp */
int main(int argc, char** argv)
{
	boost::thread_group threads;

	threads.create_thread(boost::bind(acceptorLoop));
	boost::this_thread::sleep( boost::posix_time::millisec(sleepLen::sml));

	threads.create_thread(boost::bind(requestLoop));
	boost::this_thread::sleep( boost::posix_time::millisec(sleepLen::sml));

	threads.create_thread(boost::bind(responseLoop));
	boost::this_thread::sleep( boost::posix_time::millisec(sleepLen::sml));

	threads.join_all();

	puts("Press any key to continue...");
	getc(stdin);
	return EXIT_SUCCESS;
}
</pre></div>

### AcceptorLoop

The code for the acceptorLoop is very crude but straightforward; the entire function waits for the __io_service__ object to obtain a new client connection once that occurs we create a new TCP/IP socket and add it to our clientList. We use a mutex within the acceptorLoop before accessing the clientList; this is necessary because in order to disconnect a client from our server the disconnect function also needs access to the same clientList.

<div class="gcp" markdown="0"> <pre class="prettyprint">
/* boostChatServer.cpp */
void acceptorLoop()
{
	cout &lt;&lt; &quot;Waiting for clients...&quot; &lt;&lt; endl;

	for(;;)
	{
		socket_ptr clientSock(new tcp::socket(service));

		acceptor.accept(*clientSock);

		cout &lt;&lt; &quot;New client joined! &quot;;

		mtx.lock();
		clientList-&gt;emplace_back(clientSock);
		mtx.unlock();

		cout &lt;&lt; clientList-&gt;size() &lt;&lt; &quot; total clients&quot; &lt;&lt; endl;
	}
}
</pre></div>

### RequestLoop

In short, the requestLoop functions as a clientList scanner. I realize after looking over this code it could have been implemented differently because as the number of clients grow the O(N) time it takes to check each client for a new message all the while holding onto a lock will create bad performance for large numbers of clients. A better approach would be to generate a new thread for each client or even better introduce coroutines and kick off a new coroutine for every new client connection, a technique I've seen demonstrated for servers written by GoLang devs. If you're interested in common HTTP server concurrency strategies used by Go developers there is a pretty decent ebook translated from Chinese to English on Github [build-web-application-with-golang](https://github.com/astaxie/build-web-application-with-golang). Although I disagree with many of the decisions made by the Go team and its "C with safety goggles" approach to building systems applications Go does perform extremely well for building RestFul HTTP backends to replace aging PHP/Python/Ruby stacks. Anyways back to the requestLoop code; for all of its flaws here is the big loop that holds onto a mutex.
 
<div class="gcp" markdown="0"> <pre class="prettyprint">
/* boostChatServer.cpp */
void requestLoop()
{
	for(;;)
	{
		if(!clientList-&gt;empty())
		{
			// Poorly designed loop, client sockets 
			// should alert the server when they have new messages; 
			// the server shouldn't poll the clientList while holding a lock
			mtx.lock();
			for(auto&amp; clientSock : *clientList)
			{
				if(clientSock-&gt;available())
				{
					char readBuf[bufSize] = {0};

					int bytesRead = clientSock-&gt;read_some(buffer(readBuf, bufSize));

					string_ptr msg(new string(readBuf, bytesRead));

					if(clientSentExit(msg))
					{
						disconnectClient(clientSock);
						break;
					}

					clientMap_ptr cm(new clientMap);
					cm-&gt;insert(pair&lt;socket_ptr, string_ptr&gt;(clientSock, msg));

					messageQueue-&gt;push(cm);

					cout &lt;&lt; &quot;ChatLog: &quot; &lt;&lt; *msg &lt;&lt; endl;
				}
			}
			mtx.unlock();
		}

		boost::this_thread::sleep( boost::posix_time::millisec(sleepLen::lon));
	}
}
</pre></div>

### RequestLoop Utility Functions

Inside the requestLoop function there were two methods, __clientSentExit__ and __disconnectClient__. As their names imply we use these two utility functions to properly disconnect clients when they include the string "exit" inside of their message.

<div class="gcp" markdown="0"> <pre class="prettyprint">
/* boostChatServer.cpp */
bool clientSentExit(string_ptr message)
{
	if(message-&gt;find(&quot;exit&quot;) != string::npos)
		return true;
	else
		return false;
}

void disconnectClient(socket_ptr clientSock)
{
	auto position = find(clientList-&gt;begin(), clientList-&gt;end(), clientSock);
	
	clientSock-&gt;shutdown(tcp::socket::shutdown_both);
	clientSock-&gt;close();
	
	clientList-&gt;erase(position);

	cout &lt;&lt; &quot;Client Disconnected! &quot; &lt;&lt; clientList-&gt;size() &lt;&lt; &quot; total clients&quot; &lt;&lt; endl;
}
</pre></div>

### ResponseLoop

Lastly we have the responseLoop, its job is to consume from the MessageQueue and send off the chat string to all recipients on the clientList.
I wasn't too sure why I choose to have this thread function acquire and release the mutex twice but for demonstration purposes the code still functions.

<div class="gcp" markdown="0"> <pre class="prettyprint">
void responseLoop()
{
	for(;;)
	{
		if(!messageQueue-&gt;empty())
		{
			auto message = messageQueue-&gt;front();

			mtx.lock();
			for(auto&amp; clientSock : *clientList)
			{
				clientSock-&gt;write_some(buffer(*(message-&gt;begin()-&gt;second), bufSize));
			}
			mtx.unlock();

			mtx.lock();
			messageQueue-&gt;pop();
			mtx.unlock();
		}

		boost::this_thread::sleep( boost::posix_time::millisec(sleepLen::lon));
	}
}
</pre></div>

Well that about wraps up the tutorial on building a simple chat application with C++ and Boost; I'll be doing a bit more with C++ code future blog posts so stay tuned.

### Full Source Code
<script src="https://gist.github.com/taywils/d0e7e099b5c172dbcf34.js"> </script>

</div>