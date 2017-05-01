---
title: UDP Echo Server In C Tutorial Part II
date: 2014-11-09
tags: [cpp]
categories: [tutorial, socket-programming]
banner: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/udpechoincp2.jpg
thumbnail:  https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/udpechoincp2.jpg
comments: false
---
The second part to the UDP Echo Server in C tutorial. In part II we add the server component of the code base and together with the client code from part I we'll have a functioning application.

<!-- more -->
## Intro
[Click here for Part I](/2014/11/08/udpechoinc)

Welcome to the second part of the how to write a echo server in C. In this short second part we'll finish up by adding the server code that our client in part I will use connect to over UDP/IP. Once again the code will work on all the major platforms Mac, Linux and Windows. Much of the socket address setup code and creation of a file descriptor is the same as the client application but the major difference with the server is that the server must bind its socket to port.

- Move into the working directory created in Part I called **UdpEcho**
- Create a file called **server.c**

## Part II: The Server

If you read through Part I of this tutorial much of the code here will be instantly familiar. The server code uses the same platform object macros and selects a branch of code based on the system its being executed on.

### C preprocessor setup, function prototypes and main

```cpp
/* server.c */
#define PLATFORM_WINDOWS  1
#define PLATFORM_MAC      2
#define PLATFORM_LINUX    3

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#if defined(_WIN32)

#define PLATFORM PLATFORM_WINDOWS

#elif defined(__APPLE__)

#define PLATFORM PLATFORM_MAC

#else

#define PLATFORM PLATFORM_LINUX

#endif

#if PLATFORM == PLATFORM_WINDOWS

#include <winsock2.h>

#elif PLATFORM == PLATFORM_MAC || PLATFORM == PLATFORM_LINUX

#include <sys/socket.h>
#include <netinet/in.h>
#include <fcntl.h>
#include <arpa/inet.h>

#endif

#if PLATFORM == PLATFORM_WINDOWS

#pragma comment(lib,"ws2_32.lib")

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

  puts("Press any key to continue");
  getc(stdin);

  return EXIT_SUCCESS;
}
```

### Mac and Linux Server Setup

```cpp
/* server.c */
#if PLATFORM == PLATFORM_MAC || PLATFORM == PLATFORM_LINUX

void macLinuxEchoServer()
{
  int socketFileDescriptor;
  struct sockaddr_in serverAddr;
  struct sockaddr_in clientAddr;

  socketFileDescriptor = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);

  bzero(&serverAddr, sizeof(serverAddr));

  serverAddr.sin_family = AF_INET;
  serverAddr.sin_addr.s_addr = htonl(INADDR_ANY);
  serverAddr.sin_port = htons(PORTNUM);

  bind(socketFileDescriptor, (struct sockaddr*)& serverAddr, sizeof(serverAddr));

  macLinuxEchoLoop(socketFileDescriptor, (struct sockaddr*)& clientAddr, sizeof(clientAddr));
}
```

Here we notice the one key difference between the client code and the server code; the use of bind. In a nutshell; from wikipedia ["When a socket is created using socket(), it is only given a protocol family, but not assigned an address."](http://en.wikipedia.org/wiki/Berkeley_sockets#bind.28.29). The assignment of an address is crucial for our sever because without it how else will clients know where to send packets. In other words a socket by itself can identify its protocol from the arguments passed to the socket() creation function but for a process which claims a socket to receive packets based on the networked computers port, there needs to be a one to one immutable relation between IP address and port number.

### Mac and Linux Server Echo Loop

Our echo loop is extremely concise, read data from the bound socket, print a notification message and bounce it back to the same client address.

```cpp
/* server.c */
void macLinuxEchoLoop(int sockFd, struct sockaddr* cliaddr, socklen_t clilen)
{
  int bytesRead;
  socklen_t len;
  char msg[BUFMAX] = {0};

  printf("Waiting for datagrams on 127.0.0.1:%d\n", PORTNUM);

  for(;;)
  {
    len = clilen;
    bzero(&msg, sizeof(msg));

    bytesRead = recvfrom(sockFd, msg, BUFMAX, 0, cliaddr, &len);

    printf("Got message: %s\n", msg);

    sendto(sockFd, msg, bytesRead, 0, cliaddr, len);
  }
}

#endif
```

### Windows Server Setup

On Windows our server setup code is nearly identical to the Mac/Linux version, with the main difference as discussed earlier being the bind() function call.

```cpp
/* server.c */
#if PLATFORM == PLATFORM_WINDOWS

int windowsEchoServer()
{
  SOCKET sock;
  sockaddr_in serverAddr;
  sockaddr_in clientAddr;
  WSADATA wsaDat;

  int wsaError = WSAStartup( MAKEWORD(2,2), &wsaDat );

  if(!wsaError)
  {
    sock = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);

    ZeroMemory(&serverAddr, sizeof(serverAddr));

    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = htonl(INADDR_ANY);
    serverAddr.sin_port = htons(PORTNUM);

    bind(sock, (struct sockaddr*)& serverAddr, sizeof(serverAddr));

    windowsEchoLoop(sock, (struct sockaddr*)& clientAddr, sizeof(clientAddr));
  }
  else
  {
    return EXIT_FAILURE;
  }
}
```

### Windows Server Echo Loop

At the very minimum the sever echo loop doesn't need to do much as shown in the code below; add it to server.c and finish it up.

```cpp
/* server.c */
void windowsEchoLoop(SOCKET sock, sockaddr* cliaddr, size_t clilen)
{
  int bytesRead;
  int len;
  char msg[BUFMAX] = {0};

  printf("Waiting for datagrams on 127.0.0.1:%d\n", PORTNUM);

  for(;;)
  {
    len = clilen;
    ZeroMemory(&msg, sizeof(msg));

    bytesRead = recvfrom(sock, msg, BUFMAX, 0, cliaddr, &len);

    printf("Got message: %s\n", msg);

    sendto(sock, msg, bytesRead, 0, cliaddr, len);
  }
}

#endif
```

Now go build and run the **server.c** once that code is running and awaiting new clients go build and run **client.c** to see the Echo server in action.

### Complete Source Code

<script src="https://gist.github.com/taywils/f656feda0bca7cbd8a78.js"> </script>

[Click here for Part I](/2014/11/08/udpechoinc)
