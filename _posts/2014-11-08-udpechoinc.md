---
layout: post
title: UDP Echo Server In C Tutorial Part I
mydate: Nov 08 2014
tags: [cpp]
catagories: [tutorial, socket-programming]
comments: true 
description: Lately I've been getting back into C, for various reasons I haven't been impressed so far with either GoLang nor Rust and the newest additions to the C++ standard seem to be making the language increasingly harder to manage. However, because I might be developing some larger C++ projects in the future I want to revisit the C programming language in order to strengthen my fundamentals in case I need to deal with raw pointers/unsafe sections of C++ applications. What better place to start getting back into C then with sockets programming.
---
## UDP Echo Server In C Tutorial Part I

<div class="post-content" markdown="1">
### Intro

As my first blog post on getting back into C/C++ programming I want to look at how one would approach building a simple echo server in C using sockets.
If you aren't aware an echo server is a server which copies the client data and sends it back to them upon each request. The simplicity of the echo server is why it is often considered to be the "Hello World" of socket programming. Before we begin make sure you have the following...

- A working C compiler, GCC(Linux), Clang(Mac OSX) and Visual Studio C++(Windows) are all great compilers that come standard with their operating systems

- A text editor that can enable C syntax highlighting. I prefer to use [Vim](www.vim.org) but [Atom](https://atom.io/) is a great cross-platform text-editor that is gaining popularity

- IDEs are also fine to use but for this tutorial you probably won't need one. [Eclipse CDT is great for Linux](http://www.eclipse.org/cdt/), while [Visual Studio](http://www.visualstudio.com/) and [Xcode](https://developer.apple.com/xcode/) are the usual suspects on Windows and Mac OSX respectively.

Once you have your text editor or IDE setup for C/C++ development we can begin.
</div>

### Part I: The Client

<div class="post-content" markdown="1">
### The C preprocessor
Our goal is to build an echo server client. However, we want our client to be able to run on all of the major platforms Linux, OSX and Windows.
To accomplish this we'll need to define some [conditional compilation](http://en.wikipedia.org/wiki/Conditional_compilation) rules using C's prepreprocessor grammar.

- Create a working directory called **UdpEcho**
- Change into the directory *UdpEcho* and create a file called **client.c**

Add the following preprocessor code to make our echo client compile nicely on different platforms.
<div class="gcp" markdown="0"> <pre class="prettyprint">
/* client.c */

/* These numbers can be anything thing as long as they are different */
#define PLATFORM_WINDOWS  1
#define PLATFORM_MAC      2
#define PLATFORM_LINUX    3

/* C standard headers */
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;

#if defined(_WIN32) /* Is recognized by Visual C++ compiler */

  #define PLATFORM PLATFORM_WINDOWS

#elif defined(__APPLE__) /* Is recognized by Clang */

  #define PLATFORM PLATFORM_MAC

#else

  #define PLATFORM PLATFORM_LINUX

#endif

#if PLATFORM == PLATFORM_WINDOWS

  #include &lt;winsock2.h&gt; /* Winsock2 is the WinAPI sockets library */

#elif PLATFORM == PLATFORM_MAC || PLATFORM == PLATFORM_LINUX

  #include &lt;sys/socket.h&gt; /* Sockets header */
  #include &lt;netinet/in.h&gt; /* Internet IP address header */
  #include &lt;fcntl.h&gt; /*  file control options header */
  #include &lt;arpa/inet.h&gt; /* Internet host order to network order and vice versa operations */

#endif

#if PLATFORM == PLATFORM_WINDOWS

  #pragma comment(lib,&quot;ws2_32.lib&quot;) /* Necessary Winsock2 library pragma */

#endif
</pre></div>
What will happen when we compile this later is that depending on your operating system the C compiler will either include or exclude specific sections based on the platform detected.
If you are using a intelligent IDE the source code will fade out the preprocessor blocks not used by your system to serve as a visual explaination. For instance if we are on Linux our code will not include the winsock2 header.

<blockquote class="quote" markdown="1">
Many software devs tend to sometimes rant a little too much about the old WinAPI codebase especially given since in todays world you'll use the C++ friendly WinRuntimeAPI libraries instead but if you go read about the history of WinAPI you'll find that Microsoft tried very hard to address the difficulties developers had with the existing BSD libraries. For instance look at how we only had to include just a single header for Windows. Anyways if you're curious about the Winsock libraries I suggest going straight to the [MSDN pages](http://msdn.microsoft.com/en-us/library/windows/desktop/ms740673.aspx) on the topic.
</blockquote>

### Function prototypes and object macros
After declaring conditional compliation macros and including header files C programs typically reserve the next section of the code for declaring object macros and function prototypes.
We won't be needing very many for the udp echo client but here they are. Add the following code to *client.c* as listed below.

<div class="gcp" markdown="0"> <pre class="prettyprint">
/* client.c */
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
</pre></div>

Under the Linux/Mac section we have a error handling function that you'll hopefully never have to use but just in case you decide to fork this code and add more features you can use it as a debug logger. Aside from the error function, both groups have two functions; the echo loop itself and the client socket setup function. We'll add the main function first and start off with the Mac/Linux section before tackling the Windows code.

### Main
Here is the main function.

<div class="gcp" markdown="0"> <pre class="prettyprint">
/* class.c */
int main(int argc, char** argv) {
  #if PLATFORM == PLATFORM_WINDOWS

    windowsEchoClient();

  #else

    macLinuxEchoClient();

  #endif

  puts(&quot;Press any key to continue&quot;);
  getc(stdin);

  return EXIT_SUCCESS;
}
</pre></div>
</div>
