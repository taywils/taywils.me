---
layout: post
title: C++ Chat Server Tutorial Part I
mydate: Nov 15 2014
tags: [cpp]
catagories: [tutorial, socket-programming, multi-threading]
comments: true 
description: In this tutorial we'll learn how to write a client for a feature limited chat server in C++ using the Boost libraries. The codebase for this tutorial is a bit dated as many of the features included by Boost are now apart of the C++ standard library but knowledege of Boost is still worthy of merit in case you run into the many C++ projects which make use of it.
---
## C++ Chat Server Tutorial Part I

<div class="post-content" markdown="1">
### Intro

####Tutorial Assumes Boost Version >= 1.53

We'll be making use of the Boost C++ libraries for this tutorial so before we begin make sure you have read through the installation documentation on the Boost website on. Below I have included some links for each operating system on how to install a recent version of Boost; its not extremely difficult but sometimes installing Boost can be tricky for those of us not familiar with compiling C++ projects from source code or the difference between the header-file only libraries and the rest of Boost.

- [Windows users Boost Installation Guide](http://www.boost.org/doc/libs/1_57_0/more/getting_started/windows.html)
- [Ubuntu/Debian Linux can use the aptitude Boost](http://stackoverflow.com/questions/12578499/how-to-install-boost-on-ubuntu)
- [Ubuntu/Debian Linux can also use the Upstream Boost which is recommended](http://www.boost.org/doc/libs/1_57_0/more/getting_started/unix-variants.html)
- [Mac OS X should use Homebrew](http://brewformulas.org/Boost)

If you need extra help installing the Boost C++ libraries or making sure that you can compile a project using Boost and properly link the libraries Google and or Stackoverflow are your best bets. Once you're comfortable building projects and or compiling single files with Boost we're ready to begin.
</div>

### Part I: The Chat Client Code

<div class="post-content" markdown="1">
Our client code for the Chat application will rely upon the use of threads to divide our code into three distinct sub-routines.

- A thread for displaying chat messages
- Another thread for sending messages to the Chat server
- And a third thread for receiving messages routed by the server from other connected clients

There are many approaches to designing multi-threaded applications and its a big topic that often rears its head during interviews with top tech companies but for the sake of this tutorial we'll only need to concern ourselves with just a small subset of concurrent programming. For the purposes of the application we're going to build in this tutorial series we're going to be using what is known as the _"Producer-Consumer"_ pattern for organizing our code. As a side note for the pedantics reading this article I'm not claiming that this code will follow _Producer-Consumer_ to the exact sepcification but for the most part it will resemble a typical _Producer-Consumer_ setup.

### Producer-Consumer Overview For The Chat Client

Quoting from the [Wikipedia page on the pattern](http://en.wikipedia.org/wiki/Producer-consumer_problem)...

<blockquote class="quote">
In computing, the producer–consumer's problem (also known as the bounded-buffer problem) is a classic example of a multi-process synchronization problem. The problem describes two processes, the producer and the consumer, who share a common, fixed-size buffer used as a queue.
</blockquote>

Thus the following is a list of C++ objects used by our Client to implement the _Producer-Consumer_ pattern.

- **boost::thread_group** to address multi-processing
- **std::queue&lt; std::string &gt;** to represent the bounded-buffer of messages
- **boost::thread** objects for adding and removing messages from the queue

### Preprocessor Directives And Function Prototypes

Lets start off, create a new working directory called **chat_app** wherever you want on your system.
Next change into the **chat_app** directory and create a new file, name it **boostChatClient.cpp**.
First we'll need to include a few libraries; some from the C++ standard template library and others from Boost.

<div class="gcp" markdown="0"> <pre class="prettyprint">
/* boostChatClient.cpp */
#include&lt;iostream&gt;
#include&lt;queue&gt;
#include&lt;string&gt;
#include&lt;cstdlib&gt;

#include&lt;boost/thread.hpp&gt;
#include&lt;boost/bind.hpp&gt;
#include&lt;boost/asio.hpp&gt;
#include&lt;boost/asio/ip/tcp.hpp&gt;
#include&lt;boost/algorithm/string.hpp&gt;
</pre></div>

The above library includes are fairly basic for a C++ console application but unfamiliar to most are probably the Boost includes.

- **boost/thread** Multithreading support
- **boost/bind** A library for functional programming but used here to create sub-rountines for threads
- **boost/asio** System socket and network programming library
- **boost/algorithm/string** Pretty self-explainatory; gives use some new string methods

I will be using namespace aliasing in this application, it can be a pain sometimes to read code without namespace aliasing so lets at least make an effort to strive for clean human readable code. So add the lines below to the current file right after the preprocessor library includes.

<div class="gcp" markdown="0"> <pre class="prettyprint">
/* boostChatClient.cpp */
using namespace std;
using namespace boost;
using namespace boost::asio;
using namespace boost::asio::ip;
</pre></div>

Next we define some typedefs for quickly describing some boost shared pointers. Shared pointers are now apart of the C++ standard but there are problems abound when you try and mix and match C++ std shared pointers with Boost library shared pointers. Not so much for performance but more from the fact that using Boost shared pointers introduces a dependency on the Boost libraries; so to keep your code Boost friendly just stick with the Boost versions of the smart pointer collection.

<div class="gcp" markdown="0"> <pre class="prettyprint">
/* boostChatClient.cpp */
typedef boost::shared_ptr&lt;tcp::socket&gt; socket_ptr;
typedef boost::shared_ptr&lt;string&gt; string_ptr;
typedef boost::shared_ptr&lt; queue&lt;string_ptr&gt; &gt; messageQueue_ptr;
</pre></div>
</div>
