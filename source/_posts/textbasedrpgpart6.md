---
title: Build A Text Based Multiplayer RPG Part VI
date: 2011-06-16
more: More
categories: [tutorial]
tags: [cpp]
banner: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/textbasedrpgpart6.JPG
thumbnail: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/textbasedrpgpart6.JPG
---
In part six of the tutorial we build the client side code for the multiplayer game which will connect to the server. After completion of this part you can run the client code by itself to simulate a single player version of the game.

<!-- more -->
[Click here for part V][link_part_5]
[Click here for part VII][link_part_7]

In this tutorial we are going to build the client code which will be used by players to access the server where the game is hosted. However for this part of the tutorial we're going to transition over from <a href="http://en.wikipedia.org/wiki/C%2B%2B">pure C++</a> to <a href="http://en.wikipedia.org/wiki/C%2B%2B/CLI">C++/CLI</a> for access to the <a href="http://msdn.microsoft.com/en-us/library/system.net.aspx">.Net framework's networking libraries</a>. If you haven't been following this tutorial using Windows don't feel left out because you can still take the basic ideas of networking shown here and apply them to <a href="http://en.wikipedia.org/wiki/BSD_sockets">BSD sockets</a> which are used on Unix(includes Mac OS X) operating systems. Or if you are skillful enough with <a href="http://en.wikipedia.org/wiki/Java_Native_Interface">Java native interfacing</a> you can port this whole program over to Java and use <a href="http://download.oracle.com/javase/tutorial/networking/sockets/">Java's networking packages</a>, and run our little game on any machine with the JRE installed.

Anyways I'll assume that for this part of the tutorial you are either running a copy of Visual Studio 2008, Visual Studio 2010 or the express edition of Visual Studio 2010. I'm personally running the professional version of Visual Studio 2010 but you can get the express version of Visual Studio 2010 here.

<a href="http://www.microsoft.com/visualstudio/en-us/products/2010-editions/visual-cpp-express">Get the express version of Visual Studio 2010.</a>

<!-- more -->
Install Visual Studio 2010 if you haven't and once that is done follow the instructions below to create a new C++/CLI project.

1) File -> New -> Project
2) From the project menu find Visual C++
3) Under Visual C++ you'll see some listings, click the one titled CLR
4) Then create a new CLR Console Application by giving it a proper name
5) For CLR applications you need to keep the default files while adding your own source and headers so make sure your project appears similar to the picture below.

This require that you create a new "main.cpp" file, so do that now and add it to the sources folder of your application. Now open up the "main.cpp" file as all of the following code snippets will reference the that file.

The first thing we want to do is to reference the .Net libraries for networking, threading, text manipulation and console output. To do so, add the following lines of code.

```c
#include "stdafx.h"

using namespace System;
using namespace System::IO;
using namespace System::Net;
using namespace System::Net::Sockets;
using namespace System::Text;
using namespace System::Threading;
```
As our game's client program all it needs to do is simply connect to the server and be able to both send and receive request from it. Lets call the function connect() and have it take a single string argument which will be the servers ip address.
```c
void connect( String^ server )
{
```
Next we need to capture two types of network exceptions, being that we will be creating a socket to stream byte code to our server they will be the ArgumentNullException and the SocketException. You can probably guess which types of errors they catch by their names so lets focus on connecting to our server. Like all exception handled code in C++/CLI we have to wrap the code responsible for throwing exceptions within a try{} block.
```c
    try
    {
```
For any <a href="http://en.wikipedia.org/wiki/Transmission_Control_Protocol">tcp client</a> the basic premise is to connect to a remote server via specific port. Our game will use port 13000 and the server ip will be the argument passed to the function as a string.
```c
        // Create a TcpClient.
        // Note, for this client to work you need to have a TcpServer 
        // connected to the same address as specified by the server, port
        // combination.
        Int32 port = 13000;
        TcpClient^ client = gcnew TcpClient( server, port );
```
Now that our client is setup and knows the location of our server we now need to be able to send and receive messages on our port by setting up a network stream object. The network stream object will allow us to read and write messages(as encoded bytes) to and from the server.

```c
        // Get a client stream for reading and writing.
        NetworkStream^ stream = client->GetStream();

        //Prepare a Byte array to store the servers response
        array<Byte>^ responseData = gcnew array<Byte>(256);
```
In addition since byte code in its raw form is practically useless to humans we'll create a string to hold the decoded messages as ascii text.
```c
        //The repsonse text string
        String^ response = String::Empty ;
```

In our client server model once the client connects to the server the server will acknowledege the connect and send out an initial message. Since all communication between the client and server takes place over the network stream we have to decode the network stream into our byte array and then decode the raw bytes into ascii so we can read the result.

```c
        // Read the TcpServer's response and store it as bytes.
        Int32 bytes = stream->Read( responseData, 0, responseData->Length );
        response = Text::Encoding::ASCII->GetString( responseData, 0, bytes );
        Console::WriteLine( response );
```
Much like the single player stand alone test version, we'll still enter new commands into a console but this time the commands will get encoded and streamed over to the server.
```c
        //Enter a new command as raw text 
        String^ command ;
        Console::WriteLine( "Type a new command\n" ) ;
        command = Console::ReadLine() ;
```

Recall how we read data from the server, we loaded the stream into our byte array, we encoded the byte array to ascii and then we output the message to our screen. So to send messages back to the server we just reverse this process. We load a byte array with the text typed into the console.

```c
        // Translate the passed command into ASCII and store it as a Byte array.
        array<Byte>^ commandData = Text::Encoding::ASCII->GetBytes( command );
```
Lastly we're going to re-implement the game loop, if you remember, our game will run until the user types "quit" into the command console. The game will just repeat the same process we outlined above for reading and writing across the network stream but this time within a loop.
```c
        while( command != "quit" )
        {
          // Send the command to the connected TcpServer
          stream->Write( commandData, 0, commandData->Length );
          Console::WriteLine( "Sent: {0}", command );

          //Store the server's response
          response = String::Empty ;

          //If there is a message from the server capture and display it
          responseData->Clear( responseData, 0, 256 ) ;

          bytes = stream->Read( responseData, 0, responseData->Length );

          //While there is a message available from the server read it
          while( bytes > 0 )
          {
            response = Text::Encoding::ASCII->GetString( responseData, 0, bytes );
            Console::WriteLine( "Received: {0}", response );

            bytes = 0 ;
            responseData->Clear( responseData, 0, 256 ) ;
            if( stream->DataAvailable )
            {
              bytes = stream->Read( responseData, 0, responseData->Length );
            }
          }

          //Enter a new command as raw text 
          Console::WriteLine( "Type a new command\n" ) ;
          command = Console::ReadLine() ;

          commandData = Text::Encoding::ASCII->GetBytes( command );
          stream->Write( commandData, 0, commandData->Length );

        }
      // Close everything.
      client->Close();

    }
```
Remember the exceptions we have to catch? Just add them to the end of the try block.
```c
    catch( ArgumentNullException^ e ) 
    {
      Console::WriteLine( "ArgumentNullException: {0}", e );
    }
  catch( SocketException^ e ) 
  {
    Console::WriteLine( "SocketException: {0}", e );
  }
}
```
Now finish the client code by adding the main() method, we'll be setting up our server on localhost so just pass 127.0.0.1 to the argument of the connect function.
```c
int main(array<System::String ^> ^args)
{
  connect( "127.0.0.1" ) ;

  return 0;
}
```
Here is a full copy of the file "main.cpp"
```c
#include "stdafx.h"

using namespace System;
using namespace System::IO;
using namespace System::Net;
using namespace System::Net::Sockets;
using namespace System::Text;
using namespace System::Threading;

void connect( String^ server )
{
  try
  {
    // Create a TcpClient.
    // Note, for this client to work you need to have a TcpServer 
    // connected to the same address as specified by the server, port
    // combination.
    Int32 port = 13000;
    TcpClient^ client = gcnew TcpClient( server, port );

    // Get a client stream for reading and writing.
    NetworkStream^ stream = client->GetStream();

    //Prepare a Byte array to store the servers response
    array<Byte>^ responseData = gcnew array<Byte>(256);

    //The repsonse text string
    String^ response = String::Empty ;

    // Read the TcpServer's response and store it as bytes.
    Int32 bytes = stream->Read( responseData, 0, responseData->Length );
    response = Text::Encoding::ASCII->GetString( responseData, 0, bytes );
    Console::WriteLine( response );

    //Enter a new command as raw text 
    String^ command ;
    Console::WriteLine( "Type a new command\n" ) ;
    command = Console::ReadLine() ;

    // Translate the passed command into ASCII and store it as a Byte array.
    array<Byte>^ commandData = Text::Encoding::ASCII->GetBytes( command );

    while( command != "quit" )
    {
      // Send the command to the connected TcpServer
      stream->Write( commandData, 0, commandData->Length );
      Console::WriteLine( "Sent: {0}", command );

      //Store the server's response
      response = String::Empty ;

      //If there is a message from the server capture and display it
      responseData->Clear( responseData, 0, 256 ) ;

      bytes = stream->Read( responseData, 0, responseData->Length );

      //While there is a message available from the server read it
      while( bytes > 0 )
      {
        response = Text::Encoding::ASCII->GetString( responseData, 0, bytes );
        Console::WriteLine( "Received: {0}", response );

        bytes = 0 ;
        responseData->Clear( responseData, 0, 256 ) ;
        if( stream->DataAvailable )
        {
          bytes = stream->Read( responseData, 0, responseData->Length );
        }
      }

      //Enter a new command as raw text 
      Console::WriteLine( "Type a new command\n" ) ;
      command = Console::ReadLine() ;

      commandData = Text::Encoding::ASCII->GetBytes( command );
      stream->Write( commandData, 0, commandData->Length );

    }
    // Close everything.
    client->Close();

  }
  catch( ArgumentNullException^ e ) 
  {
    Console::WriteLine( "ArgumentNullException: {0}", e );
  }
  catch( SocketException^ e ) 
  {
    Console::WriteLine( "SocketException: {0}", e );
  }
}

int main(array<System::String ^> ^args)
{
  connect( "127.0.0.1" ) ;

  return 0;
}
```
<a href="http://dl.dropbox.com/u/22280460/Simple_C%2B%2B_Client.rar">Click here to download the client code for Visual Studio 2010</a>

The file is hosted on my dropbox account so let me know if you can't access it and I'll re-upload it again.

[Click here for part VII][link_part_7]

[link_part_5]: /2011/06/15/textbasedrpgpart5
[link_part_7]: /2011/06/17/textbasedrpgpart7
