---
title: UDP Echo Server In C Tutorial Part I
date: 2014-11-08
tags: [cpp]
categories: [tutorial, socket-programming]
banner: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/udpechoinc.jpg
thumbnail: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/udpechoinc.jpg
comments: false
---
Lately I've been getting back into C, for various reasons I haven't been impressed so far with either GoLang nor Rust and the newest additions to the C++ standard seem to be making the language increasingly harder to manage. However, because I might be developing some larger C++ projects in the future I want to revisit the C programming language in order to strengthen my fundamentals in case I need to deal with raw pointers/unsafe sections of C++ applications. What better place to start getting back into C then with sockets programming.

<!-- more -->
## Intro

[Click here for Part II](/2014/11/09/udpechoincp2)

 As my first blog post on getting back into C/C++ programming I want to look at how one would approach building a simple echo server in C using sockets.If you aren't aware an echo server is a server which copies the client data and sends it back to them upon each request. The simplicity of the echo server is why it is often considered to be the "Hello World" of socket programming. Before we begin make sure you have the following...

- A working C compiler, GCC(Linux), Clang(Mac OSX) and Visual Studio C++(Windows) are all great compilers that come standard with their operating systems

- A text editor that can enable C syntax highlighting. I prefer to use [Vim](www.vim.org) but [SublimeText3](www.sublimetext.com/3) is a great cross-platform text-editor that is gaining popularity

- IDEs are also fine to use but for this tutorial you probably won't need one. [Eclipse CDT is great for Linux](http://www.eclipse.org/cdt/), while [Visual Studio](http://www.visualstudio.com/) and [Xcode](https://developer.apple.com/xcode/) are the usual suspects on Windows and Mac OSX respectively.

Once you have your text editor or IDE setup for C/C++ development we can begin.

## Part I: The Client

### The C preprocessor
Our goal is to build an echo server client. However, we want our client to be able to run on all of the major platforms Linux, OSX and Windows.
To accomplish this we'll need to define some [conditional compilation](http://en.wikipedia.org/wiki/Conditional_compilation) rules using C's prepreprocessor grammar.

- Create a working directory called **UdpEcho**

- Change into the directory *UdpEcho* and create a file called **client.c**

Add the following preprocessor code to make our echo client compile nicely on different platforms.
```cpp
/* client.c */

/* These numbers can be anything thing as long as they are different */
#define PLATFORM_WINDOWS  1
#define PLATFORM_MAC      2
#define PLATFORM_LINUX    3

/* C standard headers */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#if defined(_WIN32) /* Is recognized by Visual C++ compiler */

#define PLATFORM PLATFORM_WINDOWS

#elif defined(__APPLE__) /* Is recognized by Clang */

#define PLATFORM PLATFORM_MAC

#else

#define PLATFORM PLATFORM_LINUX

#endif

#if PLATFORM == PLATFORM_WINDOWS

#include <winsock2.h> /* Winsock2 is the WinAPI sockets library */

#elif PLATFORM == PLATFORM_MAC || PLATFORM == PLATFORM_LINUX

#include <sys/socket.h> /* Sockets header */
#include <netinet/in.h> /* Internet IP address header */
#include <fcntl.h> /*  file control options header */
#include <arpa/inet.h> /* Internet host order to network order and vice versa operations */

#endif

#if PLATFORM == PLATFORM_WINDOWS

#pragma comment(lib,"ws2_32.lib") /* Necessary Winsock2 library pragma */

#endif
```
What will happen when we compile this later is that depending on your operating system the C compiler will either include or exclude specific sections based on the platform detected.

If you are using an intelligent IDE the source code will fade out the preprocessor blocks not used by your system to serve as a visual explaination. For instance if we are on Linux our code will not include the winsock2 header.

<blockquote>
Many software devs tend to sometimes rant a little too much about the old WinAPI codebase especially given since in todays world you'll use the C++ friendly WinRuntimeAPI libraries instead but if you go read about the history of WinAPI you'll find that Microsoft tried very hard to address the difficulties developers had with the existing BSD libraries. For instance look at how we only had to include just a single header for Windows. Anyways if you're curious about the Winsock libraries I suggest going straight to the [MSDN pages](http://msdn.microsoft.com/en-us/library/windows/desktop/ms740673.aspx) on the topic.
</blockquote>

### Function prototypes and object macros
After declaring conditional compliation macros and including header files C programs typically reserve the next section of the code for declaring object macros and function prototypes.

We won't be needing very many for the udp echo client but here they are. Add the following code to *client.c* as listed below.

```cpp
/* client.c */
/* 
 * See http://stackoverflow.com/questions/3988122/static-const-int-not-good-enough-for-array-size
 * For why we have to use #define here vs a const int
 */
#define PORTNUM 12354
#define BUFMAX  1024

#if PLATFORM == PLATFORM_MAC || PLATFORM == PLATFORM_LINUX
void error(const char*);
void macLinuxEchoLoop(int, struct sockaddr*, socklen_t);
void macLinuxEchoClient();
#endif

#if PLATFORM == PLATFORM_WINDOWS
void windowsEchoLoop(SOCKET, SOCKADDR*, size_t);
int windowsEchoClient();
#endif
```

Under the Linux/Mac section we have a error handling function that you'll hopefully never have to use but just in case you decide to fork this code and add more features you can use it as a debug logger. Aside from the error function, both groups have two functions; the echo loop itself and the client socket setup function. We'll add the main function first and start off with the Mac/Linux section before tackling the Windows code.

### Main
Here is the main function.

```cpp
/* class.c */
int main(int argc, char** argv) 
{
#if PLATFORM == PLATFORM_WINDOWS

  windowsEchoClient();

#else

  macLinuxEchoClient();

#endif

  puts("Press any key to continue");
  getc(stdin);

  return EXIT_SUCCESS;
}
```

Although its a tad bit ugly our preprocessor object macro for *PLATFORM* allows us to select the path of execution based on our operating system.

## Mac and Linux Client Code

```cpp
/* client.c */
#if PLATFORM == PLATFORM_MAC || PLATFORM == PLATFORM_LINUX

void error(const char *msg) 
{
  perror(msg);
  exit(EXIT_FAILURE);
}
```

Our error function is just a wrapper around the stdin function for printing messages to stderr. Its a short function and probably could have been written as a *inline* function but optimization isn't the topic of this blog post. Moving along, next up is the client socket setup function.

```cpp
/* client.c */
void macLinuxEchoClient()
{
  int socketFileDescriptor; /* Create socket file descriptor */
  struct sockaddr_in serverAddr; /* Struct for holding information about what server we want to connect to */

  /* Initialize the struct */
  /* http://fdiv.net/2009/01/14/memset-vs-bzero-ultimate-showdown */
  bzero(&serverAddr, sizeof(serverAddr));

  serverAddr.sin_family = AF_INET; /* Our socket will use the internet protocol */
  serverAddr.sin_port = htons(PORTNUM); /* Convert our int to UDP/IP network byte order */
  serverAddr.sin_addr.s_addr = inet_addr("127.0.0.1"); /* The location of the server, will be Localhost */

  /* Convert the human friendly IP address string into a network binary structure */
  inet_pton(AF_INET, "127.0.0.1", &serverAddr.sin_addr);

  /* Establish our socket_fd as a UDP/IP socket or datagram socket using UDP over IP as the protocol */
  socketFileDescriptor = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);

  if(socketFileDescriptor < 0)
    error("socket() failed");

  /* Our message loop needs the socket and server address info, 
   * the sizeof is due to sockaddr being a fixed size struct
   */
  macLinuxEchoLoop(socketFileDescriptor, (struct sockaddr*)& serverAddr, sizeof(serverAddr));
}
```

The beauty of the [User Datagram Protocol](http://en.wikipedia.org/wiki/User_Datagram_Protocol) is that we don't need to actually confirm that our sever exists.

We give it a location, arm our packets with some data and fire away. Whether or not the server actually receives the packets and any error handling for packets dropped along the way is entirely up to the developer of the application. 

```cpp
/* client.c */
void macLinuxEchoLoop(int sock, struct sockaddr* serverAddr, socklen_t serverlen)
{
  int bytesRead;
  int sentResult;
  char inputBuffer[BUFMAX]  = {0};
  char recvBuffer[BUFMAX]   = {0};

  for(;;)
  {
    printf("Type message: ");
    fgets(inputBuffer, BUFMAX, stdin);

    sentResult = sendto(sock, inputBuffer, strlen(inputBuffer), 0, serverAddr, serverlen);

    if(sentResult < 0)
      error("sendTo() failed");

    bytesRead = recvfrom(sock, recvBuffer, BUFMAX, 0, NULL, NULL);

    if(bytesRead < 0)
      error("recvfrom() failed");

    recvBuffer[bytesRead] = 0; /* NULL terminates the char array */
    printf("Server responds: %s\n", recvBuffer);
  }
}

#endif
```

The above function is the echo loop. Its goal is to accept user input from the keyboard, send it off to the server and spit back out the results.

The only gotcha within the echo loop is the fact that we have to use buffers for storing our data. So basically whenever you want to send data to the server, include the inputBuffer and whenever you want to read a response store it to the recvBuffer. That about wraps up the client code for Mac and Linux.

### Windows client code

On Windows based platforms our code will look very similar, with the primary difference being that the Winsock library uses several predefined macros to make our code easier to read. Of course one could easily do the same with good old BSD code Mac/Linux but its nice that Winsock provides macros such as `INVALID_SOCKET` versus the C style of checking "if the return value is negative".

```cpp
/* client.c */
#if PLATFORM == PLATFORM_WINDOWS

int windowsEchoClient()
{
  SOCKET sock; /* Sockets are treated differently from file descriptors on Windows */
  sockaddr_in serverAddr;
  WSADATA wsaDat; /* Winsock startup data */

  /* From Msdn. The WSAStartup function initiates use of the Winsock DLL by a process. */
  int wsaError = WSAStartup( MAKEWORD(2,2), &wsaDat );

  if(!wsaError)
  {
    sock = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);

    if (sock == INVALID_SOCKET)
    {
      wprintf(L"socket function failed with error = %d\n", WSAGetLastError() );
      exit(-1);
    }

    /* ZeroMemory is the Windows version of bzero which is just a wrapper for memset using 0 as the default memory value */
    ZeroMemory(&serverAddr, sizeof(serverAddr));

    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(PORTNUM);
    serverAddr.sin_addr.s_addr = inet_addr("127.0.0.1");

    sock = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);

    windowsEchoLoop(sock, (SOCKADDR*)& serverAddr, sizeof(serverAddr));
  }
  else
  {
    return EXIT_FAILURE;
  }
}
```

If you understood the Mac/Linux client you shouldn't have a hard time digesting the Windows equivalent of the EchoLoop function. The one huge difference here the use of WSACleanup(); if you don't use it Windows will whine at you for being a sloppy socket programmer.

```cpp
void windowsEchoLoop(SOCKET sock, SOCKADDR* serverAddr, size_t serverlen)
{
  int bytesRead;
  int sendToResult;
  char inputBuffer[BUFMAX] = {0};
  char recvBuffer[BUFMAX] = {0};

  for(;;)
  {
    printf("Type message: ");
    fgets(inputBuffer, BUFMAX, stdin);

    sendToResult = sendto(sock, inputBuffer, strlen(inputBuffer), 0, serverAddr, serverlen);

    if (sendToResult == SOCKET_ERROR) {
      wprintf(L"sendto failed with error: %d\n", WSAGetLastError());
      closesocket(sock);
      WSACleanup();

      puts("Press any key to continue");
      getc(stdin);
      exit(sendToResult);
    }

    bytesRead = recvfrom(sock, recvBuffer, BUFMAX, 0, NULL, NULL);

    if (bytesRead == SOCKET_ERROR) {
      wprintf(L"recvfrom failed with error: %d\n", WSAGetLastError());
      closesocket(sock);
      WSACleanup();

      puts("Press any key to continue");
      getc(stdin);
      exit(bytesRead);
    }

    recvBuffer[bytesRead] = 0; /* NULL terminates the char array */
    printf("Server responds: %s\n", recvBuffer);
  }
}

#endif
```

Thats it for today; below is the complete source code.

### Complete Source Code

<script src="https://gist.github.com/taywils/80720c98cc4b24dea9cd.js"> </script>

[Click here for Part II](/2014/11/09/udpechoincp2)
