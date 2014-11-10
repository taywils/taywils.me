---
layout: post
title: UDP Echo Server In C Tutorial Part II
mydate: Nov 09 2014
tags: [cpp]
catagories: [tutorial, socket-programming]
comments: true 
description: The second part to the UDP Echo Server in C tutorial. In part II we add the server component of the code base and together with the client code from part I we'll have a functioning application.
---
## UDP Echo Server In C Tutorial Part II

<div class="post-content" markdown="1">
### Intro
[Click here for Part I](/2014/11/08/udpechoinc.html)

Welcome to the second part of the how to write a echo server in C. In this short second part we'll finish up by adding the server code that our client in part I will use connect to over UDP/IP. Once again the code will work on all the major platforms Mac, Linux and Windows. Much of the socket address setup code and creation of a file descriptor is the same as the client application but the major difference with the server is that the server must bind its socket to port.
</div>

### Part II: The Server

If you read through Part I of this tutorial much of the code here will be instantly familiar. The server code uses the same platform object macros and selects a branch of code based on the system its being executed on.

<div class="post-content" markdown="1">

### C preprocessor setup, function prototypes and main

<div class="gcp" markdown="0"> <pre class="prettyprint">
#define PLATFORM_WINDOWS  1
#define PLATFORM_MAC      2
#define PLATFORM_LINUX    3

#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;

#if defined(_WIN32)

	#define PLATFORM PLATFORM_WINDOWS

#elif defined(__APPLE__)

	#define PLATFORM PLATFORM_MAC

#else

	#define PLATFORM PLATFORM_LINUX

#endif

#if PLATFORM == PLATFORM_WINDOWS

	#include &lt;winsock2.h&gt;

#elif PLATFORM == PLATFORM_MAC || PLATFORM == PLATFORM_LINUX

	#include &lt;sys/socket.h&gt;
	#include &lt;netinet/in.h&gt;
	#include &lt;fcntl.h&gt;
	#include &lt;arpa/inet.h&gt;

#endif

#if PLATFORM == PLATFORM_WINDOWS

	#pragma comment(lib,&quot;ws2_32.lib&quot;)

#endif

#define PORTNUM 12354
#define BUFMAX 1024

#if PLATFORM == PLATFORM_MAC || PLATFORM == PLATFORM_LINUX
	void macLinuxEchoLoop(int, struct sockaddr*, socklen_t);
	void macLinuxEchoServer();
#endif

#if PLATFORM == PLATFORM_WINDOWS
	void windowsEchoLoop(SOCKET, sockaddr*, size_t);
	int windowsEchoServer();
#endif

int main(int argc, char** argv)
{
	#if PLATFORM == PLATFORM_WINDOWS

		windowsEchoServer();

	#else

		macLinuxEchoServer();

	#endif

	puts(&quot;Press any key to continue&quot;);
	getc(stdin);

	return EXIT_SUCCESS;
}
</pre></div>

### Mac and Linux Server Setup

<div class="gcp" markdown="0"> <pre class="prettyprint">
#if PLATFORM == PLATFORM_MAC || PLATFORM == PLATFORM_LINUX

void macLinuxEchoServer()
{
	int socketFileDescriptor;
	struct sockaddr_in serverAddr;
	struct sockaddr_in clientAddr;

	socketFileDescriptor = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);

	bzero(&amp;serverAddr, sizeof(serverAddr));

	serverAddr.sin_family = AF_INET;
	serverAddr.sin_addr.s_addr = htonl(INADDR_ANY);
	serverAddr.sin_port = htons(PORTNUM);

	bind(socketFileDescriptor, (struct sockaddr*)&amp; serverAddr, sizeof(serverAddr));

	macLinuxEchoLoop(socketFileDescriptor, (struct sockaddr*)&amp; clientAddr, sizeof(clientAddr));
}
</pre></div>

Here we notice the one key difference between the client code and the server code; the use of bind. In a nutshell; from wikipedia ["When a socket is created using socket(), it is only given a protocol family, but not assigned an address."](http://en.wikipedia.org/wiki/Berkeley_sockets#bind.28.29). The assignment of an address is crucial for our sever because without it how else will clients know where to send packets. In other words a socket by itself can identify its protocol from the arguments passed to the socket() creation function but for a process which claims a socket to receive packets based on the networked computers port, there needs to be a one to one immutable relation between IP address and port number.
</div>
