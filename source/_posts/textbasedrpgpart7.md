---
title: Build A Text Based Multiplayer RPG Part VII
date: 2011-06-17
categories: [tutorial]
tags: [cpp]
comments: true
---
The Final part of our tutorial, after completing this tutorial you will have successfully created a multiplayer text based rpg. Read on to learn how to design the game server that will connect to the client code written in part six.

<!-- more -->
[Click here for part VI][link_part_6]

In the last part of this series we're going to develop the server logic to host our game and end with a short demonstration of how it works in action. Just as you performed it in part 6, create a new Visual C++ CLR project within Visual Studio and add the following files leaving them empty for now; "Common.h", "database.h", "server.h", "database.cpp", "main.cpp" and "server.cpp". 

The first file we'll write is the "Common.h" file. All "Common.h" does is declare the namespaces and set the constant values we'll be using for the server application. If you recall from part six when we set the client to access the server via port 13000, you can now see why we did so because by setting the same port on the server the server will know which port to set the listening socket to.

```c
#pragma once

/// namespaces
using namespace System;
using namespace System::IO;
using namespace System::Net;
using namespace System::Net::Sockets;
using namespace System::Text;
using namespace System::Threading;
using namespace System::Collections;

namespace NetGame
{
  /// Constants
  const unsigned PORT        =  13000;
  const unsigned MAX_PLAYERS =  2;
}
```

Next we move to the "database.h" file. If you remember way back in part 1 where we outlined the code for our game I told you there was a reason why we titled the header file for the game database instead of dungeon or something. The reason as you can see now is because our game will serve like a virtual database where we'll pull out data on monsters, items and locations for players to interact with and update them whenever actions occur to propagate changes to the game world out to all players. Now go ahead and add "database.h" from the test project over to this project. Then copy the files for "database.cpp" over to this new project as well from the test. However CLR applications need to reference "stdafx.h" within "database.cpp", so add the line below.

```c
#include "stdafx.h"
```
For the server we'll start with declaring its classes and methods within "server.h" so go open that file. Within "server.h" add the following pre-processor directives.
```c
#pragma once

#include "stdafx.h"
#include "Common.h"
#include "database.h"
```
Next we'll be adding two classes, one for the server and one for managing the client connections. In C++/CLI we need to have our classes managed as well so for the server class add the declarations below.
```c
namespace NetGame
{
  public ref class Server
  {
    public:
      Server();
      static void MsgToAll( String^ from, String^ message );
      static void ServerMsgToAll(String^ serverMessage );
      static void MsgToPlayer( String^ serverMessage, System::String^ playername );

      TcpListener^                           gameServer;
      static System::Collections::Hashtable^ playerNames;
      static System::Collections::Hashtable^ playersByConnection;
  };
```
Then for the client relay which is responsible for starting and stopping a thread for each new player on the server add the code below.
```c
    public ref class TcpRelayClient
    {
      public:
        TcpRelayClient( TcpClient^ playerConnection );
        TcpClient^     client;
        StreamReader^  reader;
        StreamWriter^  writer;
        String^        player;

      private: 
        void startRelay();
        void run();
    };
```
The last two methods of the server class are specific for backwards compatibility between managed and native C++.
```c
  // See the link below
  //msdn.microsoft.com/en-us/library/1b4az623(v=VS.90).aspx 
  //How to: Convert System::String to Standard String
  void MarshalString ( String^ s, std::string& os ) ;
  String^ toSysString( std::string ) ;
}
```
<div>
The point of string marshaling is to allow use to translate between C++/CLI String^ and native `std::string*` pointers. Now we're ready to tackle the meat of the application, the definitions of the servers methods; open up "server.cpp" for editing and first add the pre-processor directives.
</div>
```c
#pragma once

#include "stdafx.h"
#include "server.h"
#include "database.h" 

using namespace MUD ;
```
For this game since we're not using an actual database lets declare all of our game objects first before accepting any connections from remote clients.
```c
//BEGIN creation of the game objects
Dungeon caves( 2, 21 ) ;

Item* herb_a = new Item( "herb", Item::HEALTH, 0, 0, 0 ) ;
Item* herb_b = new Item( "herb", Item::HEALTH, 0, 0, 0 ) ;
Item* herb_c = new Item( "herb", Item::HEALTH, 0, 0, 0 ) ;
Item* herb_d = new Item( "herb", Item::HEALTH, 0, 0, 0 ) ;
Item* herb_e = new Item( "herb", Item::HEALTH, 0, 0, 0 ) ;
Item* herb_f = new Item( "herb", Item::HEALTH, 0, 0, 0 ) ;
Item* herb_g = new Item( "herb", Item::HEALTH, 0, 0, 0 ) ;

Item* woodsword = new Item( "woodsword", Item::WEAPON, 10, 0, 0 ) ;
Item* steelblade = new Item( "steelblade", Item::WEAPON, 20, 0, 0 ) ;
Item* crystalsword = new Item( "crystalsword", Item::WEAPON, 35, 0, 0 ) ;
Item* genjiblade = new Item( "genjiblade", Item::WEAPON, 60, 0, 0 ) ;
Item* angelicsword = new Item( "angelicsword", Item::WEAPON, 80, 0, 0 ) ;
Item* finalweapon = new Item( "dragonslayer", Item::WEAPON, 2000, 0, 0 ) ;

Item* woodarmor = new Item( "woodarmor", Item::ARMOR, 0, 5, 15 ) ;
Item* steelarmor = new Item( "steelarmor", Item::ARMOR, 0, 7, 20 ) ;
Item* diamondarmor = new Item( "diamondarmor", Item::ARMOR, 0, 12, 30 ) ;
Item* crystalarmor = new Item( "crystalarmor", Item::ARMOR, 0, 15, 35 ) ;
Item* dragonarmor = new Item( "dragonarmor", Item::ARMOR, 0, 20, 100 ) ;
Item* ultimatearmor = new Item( "ultimatearmor", Item::ARMOR, 0, 1000, 1000 ) ;

Monster* bear = new Monster( "bear", 15, 2, 3 ) ;
Monster* goblin = new Monster( "goblin", 5, 3, 1 ) ;
Monster* imp = new Monster( "imp", 5, 5, 2 ) ;
Monster* redgoblin = new Monster( "redgoblin", 5, 5, 5 ) ;
Monster* demon = new Monster( "demon", 6, 3, 7 ) ;
Monster* zergling = new Monster( "zergling", 10, 10, 9 ) ;
Monster* bats = new Monster( "bats", 20, 15, 3 ) ;
Monster* morebats = new Monster( "morebats", 25, 20, 15 ) ;
Monster* golem = new Monster( "golem", 50, 21, 9 ) ;
Monster* goatdemon = new Monster( "goatdemon", 100, 10, 10 ) ;
Monster* cyclops = new Monster( "cyclops", 150, 90, 0 ) ;
Monster* behemoth = new Monster( "behemoth", 250, 30, 40 ) ;
Monster* alien = new Monster( "alien", 50, 21, 4 ) ;
Monster* giantrat = new Monster( "giantrat", 55, 40, 1 ) ;
Monster* fallenangel = new Monster( "fallenangel", 300, 100, 100 ) ;
Monster* greatdragon = new Monster( "greatdragon", 500, 300, 1 ) ;
Monster* invincibledragon = new Monster( "invincibledragon", 999, 999, 999 ) ;

Room* mainHall = new Room( "The main cavern", "A murkey swamp cavern", woodsword ) ;
Room* river = new Room( "The black river", "A river with dark water", woodarmor ) ;
Room* greencave = new Room( "The greencave", "A moss covered cave", herb_a ) ;
Room* bluecave = new Room( "The bluecave", "A frosty cave", steelblade ) ;
Room* darkpit = new Room( "The darkpit", "An endless hole lies before you", steelarmor ) ;
Room* morbidfield = new Room( "The morbidfield", "Pitch black grass surrounds you", herb_b ) ;
Room* graveyard = new Room( "The graveyard", "Tombstones abound", diamondarmor ) ;
Room* crypt = new Room( "The crypt", "A nasty rotten crypt", crystalsword ) ;
Room* evilpassage = new Room( "The evil passage", "An evil pasage", crystalarmor ) ;
Room* darklair = new Room( "The dark lair", "A dark lair", herb_c ) ;
Room* firepit = new Room( "The firey pits", "Fire is every where", herb_d ) ;
Room* greenpasture = new Room( "The greenpastures", "A meadow is before you", genjiblade ) ;
Room* icecave = new Room( "The icy caves", "Ice everywhere you look", herb_e ) ;
Room* livingroom = new Room( "The living room", "The room is alive", dragonarmor ) ;
Room* cellar = new Room( "The cellar", "A dirty cellar filled with rats", angelicsword ) ;
Room* lifespring = new Room( "The lifespring", "A beautiful fountain stands", herb_f ) ;
Room* waterfall = new Room( "The waterfall", "Clear blue water falls", herb_g ) ;
Room* hellsgate = new Room( "The gates of hell", "Large rusty doors lead to hell", ultimatearmor ) ;
Room* dragoncave = new Room( "The dragon's cave", "An ancient cave..." ) ;
Room* dragonsden = new Room( "The dragon's den", "A powerful monster awaits" ) ;
Room* lostforest = new Room( "The secret forest", "The strongest sword lies hidden here", finalweapon ) ;

Filter filter ;

Dispatch dispatch ;
char command ;
string value ;
//END creation of the game objects
```

In a professional game setting it would be here where you would instantiate a connection to your MySQL or whatever database your using and not load the server code until the database connection has been verified; but for this simple game this will be good enough. Now that our game objects have been created, we'll start by defining the Server constructor. Within the Server constructor we want to initialize the dynamic content of the game, i.e game content which will change state throughout the execution of our game.

```c
namespace NetGame
{
  Server::Server()
  {  
    //BEGIN linking game objects
    mainHall->link( 'e', *river ) ;
    river->link( 's', *greencave ) ;
    river->link( 'e', *bluecave ) ;
    river->link( 'w', *mainHall ) ;
    greencave->link( 'n', *river ) ;
    bluecave->link( 'w', *river ) ;
    bluecave->link( 'n', *darkpit ) ;
    darkpit->link( 's', *bluecave ) ;
    darkpit->link( 'n', *morbidfield ) ;
    morbidfield->link( 's', *darkpit ) ;
    morbidfield->link( 'e', *graveyard ) ;
    graveyard->link( 'w', *morbidfield ) ;
    graveyard->link( 'n', *crypt ) ;
    graveyard->link( 'e', *evilpassage ) ;
    crypt->link( 's', *graveyard ) ;
    evilpassage->link( 'w', *graveyard ) ;
    evilpassage->link( 's', *darklair ) ;
    darklair->link( 'n', *evilpassage ) ;
    darklair->link( 's', *firepit ) ;
    firepit->link( 'n', *darklair ) ;
    firepit->link( 'e', *greenpasture ) ;
    greenpasture->link( 'w', *firepit ) ;
    greenpasture->link( 's', *icecave ) ;
    greenpasture->link( 'e', *livingroom ) ;
    icecave->link( 'n', *greenpasture ) ;
    livingroom->link( 'w', *greenpasture ) ;
    livingroom->link( 'e', *cellar ) ;
    cellar->link( 'w', *livingroom ) ;
    cellar->link( 'n', *lifespring ) ;
    cellar->link( 'e', *hellsgate ) ;
    lifespring->link( 's', *cellar ) ;
    lifespring->link( 'n', *waterfall ) ;
    waterfall->link( 's', *lifespring ) ;
    hellsgate->link( 'w', *cellar ) ;
    hellsgate->link( 'e', *dragoncave ) ;
    dragoncave->link( 'w', *hellsgate ) ;
    dragoncave->link( 'e', *dragonsden ) ;
    dragonsden->link( 'w', *dragoncave ) ;
    dragonsden->link( 'e', *lostforest ) ;
    lostforest->link( 'w', *dragonsden ) ;

    mainHall->addMonster( goblin ) ;
    mainHall->addMonster( imp ) ;
    river->addMonster( bear ) ;
    river->addMonster( redgoblin ) ;
    bluecave->addMonster( demon ) ;
    bluecave->addMonster( zergling ) ;
    morbidfield->addMonster( bats ) ;
    morbidfield->addMonster( morebats ) ;
    graveyard->addMonster( golem ) ;
    evilpassage->addMonster( goatdemon ) ;
    firepit->addMonster( cyclops ) ;
    greenpasture->addMonster( behemoth ) ;
    livingroom->addMonster( alien ) ;
    cellar->addMonster( giantrat ) ;
    hellsgate->addMonster( fallenangel ) ;
    dragoncave->addMonster( greatdragon ) ;
    dragonsden->addMonster( invincibledragon ) ;

    caves.addRoom( mainHall ) ;
    caves.addRoom( river ) ;
    caves.addRoom( greencave ) ;
    caves.addRoom( bluecave ) ;
    caves.addRoom( darkpit ) ;
    caves.addRoom( morbidfield ) ;
    caves.addRoom( graveyard ) ;
    caves.addRoom( crypt ) ;
    caves.addRoom( evilpassage ) ;
    caves.addRoom( darklair ) ;
    caves.addRoom( firepit ) ;
    caves.addRoom( greenpasture ) ;
    caves.addRoom( icecave ) ;
    caves.addRoom( livingroom ) ;
    caves.addRoom( cellar ) ;
    caves.addRoom( lifespring ) ;
    caves.addRoom( waterfall ) ;
    caves.addRoom( hellsgate ) ;
    caves.addRoom( dragoncave ) ;
    caves.addRoom( dragonsden ) ;
    caves.addRoom( lostforest ) ;
    //END linking game objects
```
Next we'll set the options for the game, open up the server on our desired port and begin accepting player connections.
```c
    // MAX_PLAYERS and PORT can be set in Common.h
    bool running            =  true;
    playerNames             =  gcnew Hashtable( MAX_PLAYERS );
    playersByConnection     =  gcnew Hashtable( MAX_PLAYERS );

    gameServer              =  gcnew TcpListener( PORT );
    gameServer->Start();
```
Now that the server is started you want to run the servers connection loop to keep it in a pending state for new players
```c
      // Server loop is infinite since we have to close the program
      // manually when we want the server to stop.
      while ( true )
      {
        if ( gameServer->Pending() )
      }
    TcpClient^ playerConnection = gameServer->AcceptTcpClient();
    Console::WriteLine( "SERVER: New player now connected! "  ); 
    gcnew TcpRelayClient( playerConnection );
  }
}
}
```
The next method to define is the global messaging method which can send messages from the server to all players. This is a key feature for our game because we can easily alert players of events such as when a new player connects and or other things.
The code might look confusing at first but all we're doing is gathering up all the open player connections into a array of Sockets and iterating through each socket and pushing a copy of the message out. Oh and we also catch the exception if the socket connection failed, then we just remove it from the server's list(remember the playersconnections HashTable from server.h).
```c
void Server::MsgToAll( String^ from, String^ message )
{
  StreamWriter^ serverwriter;
  ArrayList^ toRemove = gcnew ArrayList( 0 );

  array<Sockets::TcpClient^>^  tcpClients =  gcnew array<Sockets::TcpClient^>( playerNames->Count );

  Server::playerNames->Values->CopyTo(tcpClients, 0); 
  for ( int count = 0; count < tcpClients->Length; ++count )
  {
    try
    {
      if (message->Trim() == "" || tcpClients[count] == nullptr )  
        continue;  
      serverwriter =  gcnew StreamWriter(tcpClients[ count ]->GetStream());  
      //write our message to the window  
      serverwriter->WriteLine(from + ": " + message);  
      //make sure all bytes are written  
      serverwriter->Flush();  
      //dispose of the writer object until needed again  
      serverwriter = nullptr;  

    }
    catch ( Exception^ error_44 )
    {
      error_44 = error_44;
      String^ name = (String^)playersByConnection[tcpClients[count]];  
      //send the message that the user has left  
      Server::ServerMsgToAll("** " + name + " ** Has Left The Room.");  
      //remove the name from playernames list
      Server::playerNames->Remove( name );
      //remove that index of the array, thus freeing it up  
      //for another user  
      Server::playersByConnection->Remove(tcpClients[count]);  
    }
  }
}
```

Next we'll write the code for the ServerMsgToAll, the thing about this method is that its only used to report back to the server admin the messages sent via MsgToAll when an exception occurred. The logic behind the method is similar to MsgToAll so enter the code below.

```c
void Server::ServerMsgToAll(String^ serverMessage )
{
  StreamWriter^ serverwriter;

  array<Sockets::TcpClient^>^  tcpClients =  gcnew array<Sockets::TcpClient^>( playerNames->Count );

  Server::playerNames->Values->CopyTo(tcpClients, 0); 

  for ( int count = 0; count < tcpClients->Length; ++count )
  {
    try
    {
      if (serverMessage->Trim() == "" || tcpClients[count] == nullptr )  
        continue;  
      serverwriter =  gcnew StreamWriter(tcpClients[ count ]->GetStream());  
      //write our message to the window  
      serverwriter->WriteLine( serverMessage );  
      //make sure all bytes are written  
      serverwriter->Flush();  
      //dispose of the writer object until needed again  
      serverwriter = nullptr;  
      Console::WriteLine( "SERVER SENT:" + " has joined the game" );

    }
    catch ( Exception^ error_44 )
    {
      error_44 = error_44;
      String^ name = (String^)playersByConnection[tcpClients[count]];  

      Server::playerNames->Remove( name );
      //remove that index of the array, thus freeing it up  
      //for another user  
      Server::playersByConnection->Remove(tcpClients[count]);  
    }
  } 
}
```

MsgToPlayer is similar again to the previous two methods except that the MsgToPlayer accepts an additional parameter for the player name of who you wish to direct the message at. The player name is reference by looking up the playerNames hash table using the player name as the key.

```c
void Server::MsgToPlayer(String^ serverMessage, System::String^ playername)
{
  StreamWriter^ serverwriter;

  array<Sockets::TcpClient^>^ tcpClients = gcnew array<Sockets::TcpClient^>( playerNames->Count );

  Server::playerNames->Values->CopyTo(tcpClients, 0); 

  for ( int count = 0; count < tcpClients->Length; ++count )
  {
    try
    {
      if (serverMessage->Trim() == "" || tcpClients[count] == nullptr )  
        continue;  

      if( playerNames->ContainsKey( playername ) )
      {
        serverwriter =  gcnew StreamWriter(tcpClients[ count ]->GetStream());  
        //write our message to the window  
        serverwriter->WriteLine( serverMessage );  
        //make sure all bytes are written  
        serverwriter->Flush();  
        //dispose of the writer object until needed again  
        serverwriter = nullptr;  
        Console::WriteLine( "SERVER SENT: " + serverMessage + " to " + playername );
      }
    }
    catch ( Exception^ error_44 )
    {
      error_44 = error_44;
      String^ name = (String^)playersByConnection[tcpClients[count]];  

      Server::playerNames->Remove( name );
      //remove that index of the array, thus freeing it up  
      //for another user  
      Server::playersByConnection->Remove(tcpClients[count]);  
    }
  } 
}
```
The next method just handles the case when a new player connection has been made.
```c
// When a new player connects to the server spawn a thread that will
// run the game loop.
TcpRelayClient::TcpRelayClient( TcpClient^ playerConnection )
{
  client =  playerConnection;
  Thread^   playerRelayThread   = gcnew Thread( 
      gcnew ThreadStart( this, & NetGame::TcpRelayClient::startRelay ) );

  playerRelayThread->Start();
}
```
If you look at the last method you'll notice that for each player connection we spawn a new thread on the server with the startRelay() method. The startRelay() method was chosen because its the method which runs all the logic for interacting with our game database. For the most part the startRelay() method consist of the same game loop from the test version of the game, you'll notice it soon but before that the initialization for the game loop is where the new code is. To start we setup both a stream writer and stream reader to send and receive messages from the player on the thread.
```c
// When we start a new thread for a player who just connected,
// this is the method the thread runs.
// In short this is the game loop the player interacts with.
void TcpRelayClient::startRelay( )
{  
  reader = gcnew StreamReader( client->GetStream() );
  // Writer sends messages out to the client whos connection
  // is running on this thread.
  writer = gcnew StreamWriter( client->GetStream() );

  NetworkStream^ netReader = client->GetStream();
```
Just before we actually let the player begin sending new commands we have to store the player's name within our players hashtable. Please note that for this simple game we don't double check that two players will have the exact same name because we aren't building this game to support thousands of players, so our collision prone hashtables are good enough. Ok so lets get the players name, store it within the player hashtables and then let them play.
```c
  writer->WriteLine( "New Game " );
  Console::WriteLine( "SERVER: Getting the new users Name " );
  writer->WriteLine( "Enter a new name for your charecter" );
  writer->Flush();
  Console::WriteLine( "SERVER SENT: Enter a new name for your character" );

  // Read the player's response
  array<Byte, 1>^  bytesFromClient = gcnew array<Byte, 1>(256);
  String^ strFromClient = String::Empty ;
  Int32 bytes = 0 ;
  bytes = netReader->Read( bytesFromClient, 0, bytesFromClient->Length ) ;
  strFromClient = Text::Encoding::ASCII->GetString( bytesFromClient, 0, bytes );
  player = strFromClient ;

  // Add the player to the hash tables as a new key value pair
  Console::WriteLine( player + " has joined the game" );
  Server::playerNames->Add( player, client ); 
  Server::playersByConnection->Add( client, player );
  String^ message ;

  Thread^ playerConnect = gcnew Thread( 
      gcnew ThreadStart( this, & NetGame::TcpRelayClient::run ) );

  playerConnect->Start();
```
Finally we can insert the code for the game loop which is directly extracted from the test game but with some slight additions to how the strings are processed. If you can recall from "server.h" there were two methods, MarshalString and toSysString. Marshal string converts a given managed string or a System::String to native std::string, while toSysString does exactly what it says it does.

```c
  //ALL THE CODE BELOW IS THE ACTUAL GAME LOOP
  //Create a new player and add to the Dungeon 
  string output ;
  string input ;
  String^ tempStr = nullptr ;

  string playerName ;
  // MarshalString converts a managed String^ to a native string
  MarshalString( player, playerName ) ; 
  Player* thePlayer = new Player( playerName, mainHall ) ;
  output = caves.addPlayer( thePlayer ) ;

  //Let all players know of the new player
  message = toSysString( output ) ;

  //Display needed info for the players
  output = "\nDefeat all monsters" ;
  output += "\nEnter a new command to start, for help menu enter" ;
  output += "\nhelp:" ;
  output += "\nTo quit enter \"quit\"" ;
  message += toSysString( output ) ;
  Server::MsgToPlayer( message, player ) ;

  //Get client command
  bytesFromClient->Clear( bytesFromClient, 0, 256 ) ;
  bytes = netReader->Read( bytesFromClient, 0, bytesFromClient->Length ) ;
  strFromClient = Text::Encoding::ASCII->GetString( bytesFromClient, 0, bytes ); 
  MarshalString( strFromClient, input ) ;

  //Start the game loop
  while( input != "quit" )
  {
    //Pass the users message through the filter
    if( filter.validateMessage( input ) )
    {
      //Split the users message into a command and value pair
      command = dispatch.extractCommand( input ) ;
      value = dispatch.extractValue( input ) ;

      //Match the command and forward the value
      switch( command )
      {
        case 'a': //Attack 
          //If the monster does not exist or the name was mispelled
          if( &(thePlayer->mLocation->getMonsterRef( value )) == NULL )
          {
            //cout << "There is no " + value + " at this location" << endl ;
            output = "There is no " + value + " at this location" ;
            message = toSysString( output ) ;
            Server::MsgToPlayer( message, player ) ;
            break ;
          }
          //If the monster is there but in combat the player cannot fight it
          if( thePlayer->mLocation->getMonsterRef( value ).inCombat == true )
          {
            //cout << "The " + value + " is currently fighting" << endl ;
            output = "The " + value + " is currently fighting" ;
            message = toSysString( output ) ;
            Server::MsgToPlayer( message, player ) ;
            break ;
          }
          caves.combatLoop( *thePlayer, thePlayer->mLocation->getMonsterRef( value ) ) ;
          output = "combat has finished" ;
          message = toSysString( output ) ;
          Server::MsgToPlayer( message, player ) ;
          break ;

        case 'm': //Move
          //cout << thePlayer->move( value[0] ) ;
          output = thePlayer->move( value[0] ) ;
          message = toSysString( output ) ;
          Server::MsgToPlayer( message, player ) ;
          break ;

        case 'f': //Find
          //cout << thePlayer->search() ;
          output = thePlayer->search() ;
          message = toSysString( output ) ;
          Server::MsgToPlayer( message, player ) ;
          break ;

        case 'l': //Location
          //cout << thePlayer->getLocation() ;
          output = thePlayer->getLocation() ;
          message = toSysString( output ) ;
          Server::MsgToPlayer( message, player ) ;
          break ;

        case 'e': //Equip
          //cout << thePlayer->equip( value ) ;
          output = thePlayer->equip( value ) ;
          message = toSysString( output ) ;
          Server::MsgToPlayer( message, player ) ;
          break ;

        case 'y': //You
          {
            string* playerStats = new string ;
            playerStats = caves.playerStatus( *thePlayer ) ;

            for( int i = 0 ; i < 7 ; ++i )
            {
              //cout << playerStats[i] << endl ;
              output = playerStats[i] ;
              message = toSysString( output ) ;
              Server::MsgToPlayer( message, player ) ;
            }

            playerStats = NULL ;
            delete playerStats ;
          }
          break ;

        case 't': //Talk
          output = value ;
          message = toSysString( output ) ;
          Server::MsgToAll( player, message ) ;
          break ;

        case 'h': //Help Menu
          //cout << "a: mv: find: loc: eq: you: t: help:" << endl ;
          output = "a: mv: find: loc: eq: you: t: help:" ;
          message = toSysString( output ) ;
          Server::MsgToPlayer( message, player ) ;
          break ;
      }
    }
    else
    {
      //cout << "Invalid command" << endl ;
      output = "Invalid command" ;
      message = toSysString( output ) ;
      Server::MsgToPlayer( message, player ) ;
    }

    if( caves.isComplete() )
    {
      //cout << "Dungeon Cleared, YOU WIN!" << endl ;
      output = "Dungeon Cleared, YOU WIN!" ;
      message = toSysString( output ) ;
      Server::MsgToAll( player, message ) ;
      break ;
    }

    if( thePlayer->death() )
    {
      //cout << thePlayer->getName() + " was slain by the " + thePlayer->mLocation->getMonsterRef( value ).getName() << endl ;
      //output = thePlayer->getName() + " was slain by the " + thePlayer->mLocation->getMonsterRef( value ).getName() ;
      output = "slain type quit to continue" ;
      message = toSysString( output ) ;
      Server::MsgToPlayer( message, player ) ;
      thePlayer->mLocation->getMonsterRef( value ).inCombat = false ;
      break ;
    }
    else
    {
      //Get the next command
      //cout << "\n\nNew Command" << endl ;
      //cin >> input ;
      //bytes = 0 ;
      bytesFromClient->Clear( bytesFromClient, 0, 256 ) ;
      bytes = netReader->Read( bytesFromClient, 0, bytesFromClient->Length ) ;
      strFromClient = Text::Encoding::ASCII->GetString( bytesFromClient, 0, bytes ); 
      MarshalString( strFromClient, input ) ;
    }
  }
  //End of game loop
}
```
Before we demo our fully functional multiplayer game we have to add the last utility methods for string processing and for logging of the games actions to the server's console.
```c
// When running is set to true during initialization of the server
// which happens when the server constructor is called, this will
// begin the loop which just displays all game info to the 
// server admin. Think of it as a log of all the players actions.
void  TcpRelayClient::run()
{
  bool running = true;

  try
  {
    String^ line = "";
    while ( running )
    {
      if ( client->Connected )
      {
        line = reader->ReadLine();
        Server::MsgToAll( player,  line );
      }
      else
      {
        running = false;            
      }
    }
  }
  catch ( Exception^ eRun )
  {
    Console::WriteLine( "EXCEPTION" +  eRun->Message + "\nThe player named: " + player + " has disconnected, the server continues" );
  }
}

// Converts a managed string to a native string 
void MarshalString ( String ^ s, string& os ) 
{
  using namespace Runtime::InteropServices;
  const char* chars = (const char*)(Marshal::StringToHGlobalAnsi(s)).ToPointer();
  os = chars;
  Marshal::FreeHGlobal(IntPtr((void*)chars));
}

// Converts a native string to a managed one
String^ toSysString( std::string output )
{
  String^ tempStr = gcnew String( output.c_str() ) ;

  return tempStr ;
}
}
```
Now open up the file "main.cpp" and run the server, we run the server via the constructor method so as soon as you create the server it will pend for request on 127.0.0.1 port 13000 for new players.

For the demo what you'll need to do is to open up three instances of Visual Studio. One instance will run the server, so open up the server project on the first one while the second and third instances will each run clients; so open up the client project on the other two. Once you have all three open the first step is to start the server.

Then launch the second client and give this new player a name.

Now switch back to the first client enter the following commands, "eq:woodsword" and then "a:imp" this will have the effect of equipping the woodsword item from the Main Hall and killing the imp monster. Finally switch back over to the second client and enter the following command "find:", you will notice that both the woodsword and the imp have cannot be found as they were both taken care of by the first player. You have just finished writing a simple text based multiplayer RPG.

Once again the two files below, the one for the server and the one for the client are hosted on my dropbox account, so if at any time they aren't accessible(I often move files around and don't clean up dead links) and put a request into the comments section.

<a href="http://dl.dropbox.com/u/22280460/Simple_RPG_Client.rar">Click here to download the client application</a>
<a href="http://dl.dropbox.com/u/22280460/Simple_RPG_Server.rar">Click here to download the server application</a>

[link_part_6]: /2011/06/16/textbasedrpgpart6
