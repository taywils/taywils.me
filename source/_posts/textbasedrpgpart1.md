---
title: Build A Text Based Multiplayer RPG Part I
date: 2011-06-05
categories: [tutorial]
tags: [cpp]
---
[Click here for part II][link_part_2]

# Intro

This is the first article in a multi-part series on how to develop a console based multiplayer MUD style RPG game. By the end of this series you will have a fully working console app that will run a typical client server model desktop application on Windows. This tutorial requires the Microsoft Visual C++ Compiler.

## Review Material

<a href="http://cslibrary.stanford.edu/102/">Click here for a review on pointers if you need to brush up.</a>
<a href="http://www.cprogramming.com/tutorial/stl/iterators.html">Click here for a review on C++ iterators, if you can’t follow it then read the pointer review first.</a>

## Background

If you happen to be curious as to what exactly a “text based role playing game(rpg)” is in my own words a text based rpg is simply a game in which the player or players input commands into a terminal and are fed back a description of the actions which took place within the game world. <a href="http://en.wikipedia.org/wiki/Online_text-based_role-playing_game">For more info see the Wikipedia entry on it</a>.

Ok, now that we’re all familiar with the concept, lets first review why anyone would even want to build a text-based rpg in todays world of fancy <a href="http://us.battle.net/wow/en/">3D graphics, special effects and semi-realistic computer rendered player models</a>. I believe text based rpgs are a great start for programmers who want to build more serious/professional grade rpgs for several reasons. First, text based rpgs allow programmers to focus purely on the game engine itself without the overhead of graphics and or animation.

Second, the core of any role playing game relies on the sophistication of its <a href="http://en.wikipedia.org/wiki/Role-playing_game_system">role playing system</a>; or the game mechanics. Without a unique and interesting core system, gamers will quickly dismiss your rpg as a rehash or just another D&D clone.

Lastly, from a programming perspective it’s a great excuse to practice data structures, socket programming and object oriented design. In this first part of series we’re going to begin by writing out the code base for the header class which will hold all the definitions for the objects which will appear within our game. However before we even write a single line of code lets first think about how we want all the game objects to fit together. Take a look at the picture below, and take note of all the objects that are identified. We have the <em>player</em>, <em>monster</em>, <em>items</em>, <em>dungeon</em> and <em>terminal </em>objects which are all clearly identified within our simple mock up. Although those won’t be our exact classes that we’ll code in a moment, the rough picture just lets us better understand the model.
<p style="text-align: center;"><a class="lightbox" href="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/Simple_C%2B%2B_Part_1_2.png"><img class="aligncenter size-thumbnail wp-image-92" src="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/Simple_C%2B%2B_Part_1_2.png" alt="Photo" width="150" height="150" /></a></p>

## Initial Code

Now lets start coding; call this file <strong>database.h,</strong> why we chose to name it database will be important in the future once we get to the multiplayer aspects of the game but enough talk.

```c
#include<iostream>
#include<string>
#include<list>
#include<vector>
#include<map>
#include<algorithm>
#include<iterator>
#include<locale>
#include<sstream>

using namespace std ;

namespace MUD
{
  class Player ;
  class Item ;
  class Room ;
  class Dungeon ;
  class Monster ;
  class Dispatch ;
  class Filter ;
```

Ok so now we have our libraries all included and the forward declarations for our classes planned out. Don’t worry about the inclusion of the not so common libraries such as locale, and sstream yet as we’ll introduce them in the future.


## Item and Monster Classes

To start off we begin with the Item class. The item class as you can guess will represent items within our rpg game. Due to this being a simple rpg game we will restrict ourselves to just three types; weapons, armor and health. At this moment you might be wondering why don’t we just make three different classes, one for each item. However, as you can see below, we’ll just stick with this one class and generalize it.

```c
    class Item
    {
      public:
        enum TYPE { WEAPON, ARMOR, HEALTH } ;

        Item( string name, Item::TYPE type, int power, int vitality, int health ) ;
        Item operator=( Item& newItem ) ;
        Item( void ) ;
        //~Item()

        void setPower( int value ) ;
        int getPower( void ) ;

        void setVitality( int value ) ;
        int getVitality( void ) ;

        void setHealth( int value ) ;
        int getHealth( void ) ;

        void setName( string name ) ;
        string getName( void ) ;

        void setType( TYPE newType ) ;
        TYPE getType( void ) ;

        string mName ;
        int mPower ;
        int mVitality ;
        int mHealth ;
        TYPE mType ;
        bool mAvailiable ;
    } ;
```

The item class as you can look at above uses six different attributes, name, power, vitality, health, type and availability. We’ll discuss each of those further when we get to writing the actual methods for the class but for now try and think about how each of those attributes relate to the three different enum types or weapon, armor and health. Next, we are going to look at the monster class. This class being as its represents the monsters in our game should meet the following requirements. Monsters should have some measurement of life or hit points, a strength or attack power, a defense rating, a unique name and of course an indicator of whether or not they are currently in combat.

```c
    class Monster
    {
      public:
        Monster( string name, int maxHp, int strength, int defence ) ;
        //~Monster() 

        void setHp( int newHp ) ;
        int getHp( void ) ;

        void setStrength( int newStrength ) ;
        int getStrength( void ) ;

        void setDefence( int newDefence ) ;
        int getDefence( void ) ;

        void setName( string newName ) ;
        string getName( void ) ;

        void setMaxHp( int newMaxHp ) ;

        int mMaxHp ;
        int mHp ;
        int mStrength ;
        int mDefence ;
        string mName ;
        bool inCombat ;
    } ;
```

## The Room Class and Player Classes

For more sophisticated games our monster class would probably have attributes for magic, speed, steal-able items and experience points rewarded if your into the experience points style of rpgs. But for this simple game; strength, hp and defense will do. Moving along we are ready to begin sketching out the code for the room class. The room class is a class which will represent a single room within our dungeon and will also contain items, monsters and allow players to traverse them. In order to best represent the interconnected nature of the rooms as they would appear in our game setting the data structure of choice will be a simple 4-way(technically 8-way since each rooms allows backtracking) linked list with each direction being the familiar north, south, east and west. When I first designed this application several months ago the room class was by far the most difficult class conceptually since most of the game revolves around traversing the rooms, finding items(within rooms), slaying monsters(again within rooms), updating the state of the player(moving about rooms) and keeping the state of the dungeon intact(managing the rooms). As you can tell the room class is key to this simple game we’re making.

```c
    class Room
    {
      public:
        Room( string name, string description, Item* item = NULL ) ;
        //Room( void ) ;
        //~Room()

        typedef bool success ;

        void addMonster( Monster* newMonster ) ;
        Monster& getMonsterRef( string monsterName ) ;
        success killMonster( string monsterName ) ;
        void itemTaken( void ) ;
        string searchResponse( void ) ;
        success link( char direction, Room& room ) ;
        Room& north( void ) ;
        Room& south( void ) ;
        Room& east( void ) ;
        Room& west( void ) ;

        void setName( string newName ) ;

        void setDescription( string newDescription ) ;
        string getDescription( void ) ;

        void setItem( Item* newItem ) ;

        Item* mItem ;
        Room* mNorth ;
        Room* mSouth ;
        Room* mEast ;
        Room* mWest ;
        list< Monster* > mMonsters ;
        string mName ;
        string mDescription ;
    } ;
```

Next up is the player class, although for this simple game the player class resembles the monster class to an exceedingly high degree and you might be thinking “why are we not using inheritance from a general base class that has hp, str, def and such”. The answer to that question was due to me having originally planned out the player class to have multiple sub classes representing jobs such wizard, knight, archer, monk, ninja and such and to have different weapons and movement bonuses and so on until I realized that it was getting too large. So I cut all that stuff out and decided to keep things simple.

```c
    class Player
    {
      public:
        Player( string name, Room* start = NULL ) ;
        //~Player()

        typedef bool dead ;

        void setHp( int newHp ) ;
        int getHp( void ) ;

        void setStrength( int newStrength ) ;
        int getStrength( void ) ;

        void setDefence( int newDefence ) ;
        int getDefence( void ) ;

        string getLocation( void ) ;

        void setName( string newName ) ;
        string getName( void ) const ;

        string equip( string itemName ) ;
        string attack( string monsterName ) ;
        string move( char direction ) ;
        string search( void ) ;
        dead death( void ) ;

        int mMaxHp ;
        int mHp ;
        int mStrength ;
        int mDefence ;
        Room* mLocation ;
        string mName ;
        Item* mWeapon ;
        Item* mArmor ;
        dead mLife ;
    } ;
```

## The Dungeon Class

Now here is where the class design gets a little tricky. The dungeon class, the class we’re coding next will make use of two std::vector<> objects to hold both the current players and the references to the various rooms within the game. Also an interesting method within the dungeon class which we’ll describe in detail later on in this tutorial series is the combatLoop() method. If you recall from earlier, the player class already has an attack() method so why does the entire dungeon need to be aware of which players are in combat? Remember that the goal of this tutorial is a multiplayer game so important aspects of the dungeon such as which players are alive and which monsters have been slain should be propagated to each player. Ok, so here is the code.

```c
class Dungeon
{
  public:
    Dungeon( int maxPlayers, int maxRooms ) ;
    //~Dungeon()

    bool isComplete( void ) ;
    string addPlayer( Player* newPlayer ) ;
    string addRoom( Room* newRoom ) ;
    string removePlayer( string playerName ) ;
    void generatePlayerStats( Player* newPlayer ) ;
    void combatLoop( Player& hero, Monster& villain ) ;
    string* playerStatus( Player& player ) ;
    void displayHelp( void ) ;

    int mMaxRooms ;
    int mMaxPlayers ;
    vector< Room* > mRooms ;
    vector< Player* > mPlayers ;
} ;
```

## Utility helpers, "Filter" and "Dispatch"

Lastly there are two utility classes I wrote to help facilitate the ever important parsing of the user inputs into the game terminal. Being that this game is text based, players will undoubtedly type in all sorts of crazy commands and awkward inputs. So the design of the two utility classes dispatch and filter were put in place to basically filter all incoming messages to ensure validity and to dispatch valid messages based on a simple protocol I crafted to handle commands. In other words, in order to avoid players attempting to cheat the game say by equipping from rooms which they currently don’t occupy or grabbing all the health items from other players the filter class serves to clean up dirty commands before they even reach the dungeon class.

```c
class Filter
{
  public:
    typedef bool valid ;

    valid validateMessage( string message ) ;
    string chat( string message ) ;
} ;

class Dispatch
{
  public:
    char extractCommand( string fromFilter ) ;
    string extractValue( string fromFilter ) ;
} ;
```

Ok folks that’s about all for now; just remember to stay tuned for the next parts of this tutorial which I’ll roll out when I get the time.

-Thanks-

Oh and here is the whole code if you're in a hurry

```c
// database.h
#include<iostream>
#include<string>
#include<list>
#include<vector>
#include<map>
#include<algorithm>
#include<iterator>
#include<locale>
#include<sstream>

using namespace std ;

namespace MUD
{
  class Player ;
  class Item ;
  class Room ;
  class Dungeon ;
  class Monster ;
  class Dispatch ;
  class Filter ;

  class Item
  {
    public:
      enum TYPE { WEAPON, ARMOR, HEALTH } ;

      Item( string name, Item::TYPE type, int power, int vitality, int health ) ;
      Item operator=( Item& newItem ) ;
      Item( void ) ;
      //~Item()

      void setPower( int value ) ;
      int getPower( void ) ;

      void setVitality( int value ) ;
      int getVitality( void ) ;

      void setHealth( int value ) ;
      int getHealth( void ) ;

      void setName( string name ) ;
      string getName( void ) ;

      void setType( TYPE newType ) ;
      TYPE getType( void ) ;

      string mName ;
      int mPower ;
      int mVitality ;
      int mHealth ;
      TYPE mType ;
      bool mAvailiable ;
  } ;

  class Monster
  {
    public:
      Monster( string name, int maxHp, int strength, int defence ) ;
      //~Monster() 

      void setHp( int newHp ) ;
      int getHp( void ) ;

      void setStrength( int newStrength ) ;
      int getStrength( void ) ;

      void setDefence( int newDefence ) ;
      int getDefence( void ) ;

      void setName( string newName ) ;
      string getName( void ) ;

      void setMaxHp( int newMaxHp ) ;

      int mMaxHp ;
      int mHp ;
      int mStrength ;
      int mDefence ;
      string mName ;
      bool inCombat ;
  } ;

  class Room 
  {
    public:
      Room( string name, string description, Item* item = NULL ) ;
      //Room( void ) ;
      //~Room()

      typedef bool success ;

      void addMonster( Monster* newMonster ) ;
      Monster& getMonsterRef( string monsterName ) ;
      success killMonster( string monsterName ) ;
      void itemTaken( void ) ;
      string searchResponse( void ) ;
      success link( char direction, Room& room ) ;
      Room& north( void ) ;
      Room& south( void ) ;
      Room& east( void ) ;
      Room& west( void ) ;

      void setName( string newName ) ;

      void setDescription( string newDescription ) ;
      string getDescription( void ) ;

      void setItem( Item* newItem ) ;

      Item* mItem ;
      Room* mNorth ;
      Room* mSouth ;
      Room* mEast ;
      Room* mWest ;
      list< Monster* > mMonsters ;
      string mName ;
      string mDescription ;
  } ;

  class Player
  {
    public:
      Player( string name, Room* start = NULL ) ;
      //~Player()

      typedef bool dead ;

      void setHp( int newHp ) ;
      int getHp( void ) ;

      void setStrength( int newStrength ) ;
      int getStrength( void ) ;

      void setDefence( int newDefence ) ;
      int getDefence( void ) ;

      string getLocation( void ) ;

      void setName( string newName ) ;
      string getName( void ) const ;

      string equip( string itemName ) ;
      string attack( string monsterName ) ;
      string move( char direction ) ;
      string search( void ) ;
      dead death( void ) ;

      int mMaxHp ;
      int mHp ;
      int mStrength ;
      int mDefence ;
      Room* mLocation ;
      string mName ;
      Item* mWeapon ;
      Item* mArmor ;
      dead mLife ;
  } ;

  class Dungeon
  {
    public:
      Dungeon( int maxPlayers, int maxRooms ) ;
      //~Dungeon()

      bool isComplete( void ) ;
      string addPlayer( Player* newPlayer ) ;
      string addRoom( Room* newRoom ) ;
      string removePlayer( string playerName ) ;
      void generatePlayerStats( Player* newPlayer ) ;
      void combatLoop( Player& hero, Monster& villain ) ;
      string* playerStatus( Player& player ) ;
      void displayHelp( void ) ;

      int mMaxRooms ;
      int mMaxPlayers ;
      vector< Room* > mRooms ;
      vector< Player* > mPlayers ;
  } ;

  class Filter
  {
    public:
      typedef bool valid ;

      valid validateMessage( string message ) ;
      string chat( string message ) ;
  } ;

  class Dispatch
  {
    public:
      char extractCommand( string fromFilter ) ;
      string extractValue( string fromFilter ) ;
  } ;
}
```

[Click here for part II][link_part_2]

[link_part_2]: /2011/06/08/textbasedrpgpart2
