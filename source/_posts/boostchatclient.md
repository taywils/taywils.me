---
title: C++ Chat Server Tutorial Part I
date: 2014-11-15
tags: [cpp]
categories: [tutorial, socket-programming, multi-threading]
banner: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/boostchatclient.jpg
thumbnail: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/boostchatclient.jpg
comments: false
---
In this tutorial we'll learn how to write a client for a feature limited chat server in C++ using the Boost libraries. The codebase for this tutorial is a bit dated as many of the features included by Boost are now apart of the C++ standard library but knowledege of Boost is still worthy of merit in case you run into the many C++ projects which make use of it.

<!-- more -->

[Click here for Part II](/2014/11/28/boostchatserver)

### Tutorial Assumes Boost Version >= 1.53

We'll be making use of the Boost C++ libraries for this tutorial so before we begin make sure you have read through the installation documentation on the Boost website on. Below I have included some links for each operating system on how to install a recent version of Boost; its not extremely difficult but sometimes installing Boost can be tricky for those of us not familiar with compiling C++ projects from source code or the difference between the header-file only libraries and the rest of Boost.

- [Windows users Boost Installation Guide](http://www.boost.org/doc/libs/1_57_0/more/getting_started/windows.html)
- [Ubuntu/Debian Linux can use the aptitude Boost](http://stackoverflow.com/questions/12578499/how-to-install-boost-on-ubuntu)
- [Ubuntu/Debian Linux can also use the Upstream Boost which is recommended](http://www.boost.org/doc/libs/1_57_0/more/getting_started/unix-variants.html)
- [Mac OS X should use Homebrew](http://brewformulas.org/Boost)

If you need extra help installing the Boost C++ libraries or making sure that you can compile a project using Boost and properly link the libraries Google and or Stackoverflow are your best bets. Once you're comfortable building projects and or compiling single files with Boost we're ready to begin.

### Part I: The Chat Client Code

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

- **std::queue< std::string >** to represent the bounded-buffer of messages

- **boost::thread** objects for adding and removing messages from the queue

### Preprocessor Directives And Function Prototypes

Lets start off, create a new working directory called **chat_app** wherever you want on your system.

Next change into the **chat_app** directory and create a new file, name it **boostChatClient.cpp**.

First we'll need to include a few libraries; some from the C++ standard template library and others from Boost.

```cpp
#include<iostream>
#include<queue>
#include<string>
#include<cstdlib>

#include<boost/thread.hpp>
#include<boost/bind.hpp>
#include<boost/asio.hpp>
#include<boost/asio/ip/tcp.hpp>
#include<boost/algorithm/string.hpp>
```

The above library includes are fairly basic for a C++ console application but unfamiliar to most are probably the Boost includes.

- **boost/thread** Multithreading support

- **boost/bind** A library for functional programming but used here to create sub-rountines for threads

- **boost/asio** System socket and network programming library

- **boost/algorithm/string** Pretty self-explainatory; gives use some new string methods

I will be using namespace aliasing in this application, it can be a pain sometimes to read code without namespace aliasing so lets at least make an effort to strive for clean human readable code. So add the lines below to the current file right after the preprocessor library includes.

```cpp
/* boostChatClient.cpp */
using namespace std;
using namespace boost;
using namespace boost::asio;
using namespace boost::asio::ip;
``

Next we define some typedefs for quickly describing some boost shared pointers. Shared pointers are now apart of the C++ standard but there are problems abound when you try and mix and match C++ std shared pointers with Boost library shared pointers. Not so much for performance but more from the fact that using Boost shared pointers introduces a dependency on the Boost libraries; so to keep your code Boost friendly just stick with the Boost versions of the smart pointer collection.

```cpp
/* boostChatClient.cpp */
typedef boost::shared_ptr<tcp::socket> socket_ptr;
typedef boost::shared_ptr<string> string_ptr;
typedef boost::shared_ptr< queue<string_ptr> > messageQueue_ptr;
```

In order to initialize the boost::asio networking methods we need to create a special object called **io_service**. The best way to think of **io_service** is as shared queue which only accepts functions that deal with asynchronous I/O. Thus you can represent a socket bound to a network port within your application and in order to send the socket a method such as __connect()__ the method must get enqueued within the `io_service` before its sent down to the operating system.

<blockquote class="quote" markdown="1">
The documentation on the anatomy of Boost::asio is the most helpful for understanding the architecture of the library. [Basic Boost.Asio Anatomy](http://www.boost.org/doc/libs/1_57_0/doc/html/boost_asio/overview/core/basics.html)
</blockquote>

```cpp
/* boostChatClient.cpp */
io_service service; // Boost Asio io_service
messageQueue_ptr messageQueue(new queue<string_ptr>); // Queue for producer consumer pattern
tcp::endpoint ep(ip::address::from_string("127.0.0.1"), 8001); // TCP socket for connecting to server
const int inputSize = 256; // Maximum size for input buffer
string_ptr promptCpy; // Terminal prompt displayed to chat users
```

Add the following function prototypes; we'll discuss the functions as they get implemented. As you can already guess by the descriptive names of each function the function's with the suffix __Loop__ will be ran on threads and interact with the __messageQueue__ we defined earlier.

```cpp
/* boostChatClient.cpp */
// Function Prototypes
bool isOwnMessage(string_ptr);
void displayLoop(socket_ptr);
void inboundLoop(socket_ptr, string_ptr);
void writeLoop(socket_ptr, string_ptr);
string* buildPrompt();
// End of Function Prototypes
```

### The main() Function, Thread Creation And Socket Initialization

From the explaination earlier in the article we create a `thread_group` facilitate the all of our async functions. In regards to the producer-consumer pattern, 

- **inboundLoop()** Will push items from the socket to our messageQueue; i.e producer

- **displayLoop()** Removes items from messageQueue to display on the client terminal; i.e consumer

```cpp
  /* boostChatClient.cpp */
int main(int argc, char** argv)
{
  try
  {
    boost::thread_group threads;
    socket_ptr sock(new tcp::socket(service));

    string_ptr prompt( buildPrompt() );
    promptCpy = prompt;

    sock->connect(ep);

    cout << "Welcome to the ChatApplication\nType \"exit\" to quit" << endl;

    threads.create_thread(boost::bind(displayLoop, sock));
    threads.create_thread(boost::bind(inboundLoop, sock, prompt));
    threads.create_thread(boost::bind(writeLoop, sock, prompt));

    threads.join_all();
  }
  catch(std::exception&amp; e)
  {
    cerr << e.what() << endl;
  }

  puts("Press any key to continue...");
  getc(stdin);
  return EXIT_SUCCESS;
}
```

### Function Definitions

The first function _buildPrompt_ is a function which handles the display of the terminal input for clients.

Its fairly simple in that it takes a string of the clients name and assigns it to the value of the prompt pointer we declared earlier.

```cpp
/* boostChatClient.cpp */
string* buildPrompt()
{
  const int inputSize = 256;
  char inputBuf[inputSize] = {0};
  char nameBuf[inputSize] = {0};
  string* prompt = new string(": ");

  cout << "Please input a new username: ";
  cin.getline(nameBuf, inputSize);
  *prompt = (string)nameBuf + *prompt;
  boost::algorithm::to_lower(*prompt);

  return prompt;
}
```

Following the buildPrompt() function the first of the threaded functions is the _inboundLoop()_.

```cpp
/* boostChatClient.cpp */
void inboundLoop(socket_ptr sock, string_ptr prompt)
{
  int bytesRead = 0;
  char readBuf[1024] = {0};

  for(;;)
  {
    if(sock->available())
    {
      bytesRead = sock->read_some(buffer(readBuf, inputSize));
      string_ptr msg(new string(readBuf, bytesRead));

      messageQueue->push(msg);
    }

    boost::this_thread::sleep( boost::posix_time::millisec(1000));
  }
}
```
Our code for the _inboundLoop()_ is self-explainatory but in particular it creates a loop which only inserts into the thread when a message is available on the socket connected to the server. Reading from the socket object is an operation which may potentially interfere with writing to the socket so we put a one second delay on checks for reading.

As for writting mesasges to the socket to send off to other members of the Chat session we need a loop that will constantly poll for user input. Once the user input is read write the message to the socket wait for the next input. Recall that this operation is threaded so in-comming messages can still be displayed since that happens on an entirely different thread.

```cpp
/* boostChatClient.cpp */
void writeLoop(socket_ptr sock, string_ptr prompt)
{
  char inputBuf[inputSize] = {0};
  string inputMsg;

  for(;;)
  {
    cin.getline(inputBuf, inputSize);
    inputMsg = *prompt + (string)inputBuf + '\n';

    if(!inputMsg.empty())
    {
      sock->write_some(buffer(inputMsg, inputSize));
    }

    // The string for quitting the application
    // On the server-side there is also a check for "quit" to terminate the TCP socket
    if(inputMsg.find("exit") != string::npos)
      exit(1); // Replace with cleanup code if you want but for this tutorial exit is enough

    inputMsg.clear();
    memset(inputBuf, 0, inputSize);
  }
}
```

For the extra pedantic, you might be wondering why there is no extraneous clean-up code and instead we just call exit(1); for the sake of keeping this tutorial brief and to the point we are not launching a production ready scalable service oriented distributed ChatApplication to be used by thousands of clients. Anyhow moving on the last of the threaded funtions is for displaying the messages read from the socket to the terminal.

```cpp
/* boostChatClient.cpp */
void displayLoop(socket_ptr sock)
{
  for(;;)
  {
    if(!messageQueue->empty())
    {
      // Can you refactor this code to handle multiple users with the same prompt?
      if(!isOwnMessage(messageQueue->front()))
      {
        cout << "\n" + *(messageQueue->front());
      }

      messageQueue->pop();
    }

    boost::this_thread::sleep( boost::posix_time::millisec(1000));
  }
}
```

The _displayLoop()_ function is fairly crude but it gets the job done. We rely on the fact that every message begins with a user prompt in order to determine if the message belonged to the client or not. When I say crude I mean that a proper chat application with tag each user with a specific id number because our code fails to handle the error when multiple users share the same prompt. Speaking of which here is the last of the utility functions; the one which checks if the prompt from _buildPrompt()_ is found within the string arriving from the socket.

```cpp
bool isOwnMessage(string_ptr message)
{
  if(message->find(*promptCpy) != string::npos)
    return true;
  else
    return false;
}
```

Thanks for reading my tutorial on how to setup a chat client using C++ and the Boost Libraries; this code deserves a refactor considering that many of the Boost code used is now apart of the latest C++ standard. In addition the introduction of a protocol could be useful for unique identification of clients and other things as well.
Stay tuned for the second part of this tutorial where we code the server side of the Chat applciation.

### Full Source Code
<script src="https://gist.github.com/taywils/9e8019fe72ff3ab16e0f.js"> </script>

[Click here for Part II](/2014/11/28/boostchatserver.html)
  </div>
