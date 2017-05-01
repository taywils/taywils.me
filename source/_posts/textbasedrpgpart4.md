---
title: Build A Text Based Multiplayer RPG Part IV
date: 2011-06-11
categories: [tutorial]
tags: [cpp]
banner: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/textbasedrpgpart4.JPG
thumbnail: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/textbasedrpgpart4.JPG
comments: false
---
We continue our quest to design a console based multiplayer RPG game in this article we'll implement the code for the Monster and Room classes. Both of these classes are critical to our application so pay close attention to the instructions.

<!-- more -->

[Click here for part III][link_part_3]
[Click here for part V][link_part_5]

In part 4 we’re going to implement the methods for two classes, the Monster class and the Room class. Due to its overall small code base we’ll look at the Monster class first. To jog your memory, below are the declarations for the Monster class from “database.h”. 
```c
class Monster
{
  public:
    Monster( string name, int maxHp, int strength, int defence ) ;
    //~Monster() 

    void setHp( int newHp ) ;
    int getHp( void ) const ;

    void setStrength( int newStrength ) ;
    int getStrength( void ) const ;

    void setDefence( int newDefence ) ;
    int getDefence( void ) const ;

    void setName( string newName ) ;
    string getName( void ) const ;

    void setMaxHp( int newMaxHp ) ;

    int mMaxHp ;
    int mHp ;
    int mStrength ;
    int mDefence ;
    string mName ;
    bool inCombat ;
} ;
```
Much like in previous parts we’ll write out the test cases prior to writing any of the methods. Go ahead and add this line to your “Test.h” file. 
```c
void test_monster_class(void);
```
Next open up “Test.cpp”, the Monster class is very basic and just involves a constructor along with four getter/setter pairs. Again with the constructor test we just assert that each attribute is the same as the values we pass into it. 
```c
void Test::test_monster_class(void)
{
  // Monster constuctor test
  Monster test_monster("test", 20, 10, 11);

  assert("test" == test_monster.mName);
  assert(20 == test_monster.mHp);
  assert(10 == test_monster.mStrength);
  assert(11 == test_monster.mDefence);
  assert(false == test_monster.inCombat);
  assert(test_monster.mHp == test_monster.mMaxHp);
```
Lastly for the monster test the getters/setters are pretty basic as well, just type in the code below. 
```c
  // Monster getters and setters test
  Monster monster("gettersetter", 1, 2, 3);

  monster.setName("dragon");
  monster.setHp(100);
  monster.setMaxHp(999);
  monster.setStrength(50);
  monster.setDefence(200);

  assert("dragon" == monster.getName());
  assert(100 == monster.getHp());
  assert(50 == monster.getStrength());
  assert(200 == monster.getDefence());
  assert(999 == monster.mMaxHp);
  assert(monster.getHp() != monster.mMaxHp);
}
```
Now that the test have been defined we can now code up the methods for the monster class; so open up the “database.cpp” file and add the lines below. 
```c
  Monster::Monster( string name, int maxHp, int strength, int defence )
: mName(name), mMaxHp(maxHp), mStrength(strength), mDefence(defence)
{
  setHp(maxHp);
  inCombat = false ;
}

void Monster::setHp( int newHp )
{
  mHp = newHp ;
}

int Monster::getHp( void ) const
{
  return mHp ;
}

void Monster::setStrength( int newStrength )
{
  mStrength = newStrength ;
}

int Monster::getStrength( void ) const
{
  return mStrength ;
}

void Monster::setDefence( int newDefence )
{
  mDefence = newDefence ;
}

int Monster::getDefence( void ) const
{
  return mDefence ;
}

void Monster::setName( string newName ) 
{
  mName = newName ;
}

string Monster::getName( void ) const
{
  return mName ;
}

void Monster::setMaxHp( const int newMaxHp ) 
{
  mMaxHp = newMaxHp ;
}
```
Now that the Monster class is complete we are now going to finish the Room class, for reference here it is again from the “database.h” file. 
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
    string getDescription( void ) const ;

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
To define the unit test lets open the “Test.cpp” file and begin with the Room class constructor. Based on our class declarations the Room constructor must be tested for the case where we initialize with and without a starting Item. 
```c
void Test::test_room_class(void)
{
  // Room constructor test
  Room room_no_item("Cave", "A dark cave");

  assert("Cave" == room_no_item.mName);
  assert("A dark cave" == room_no_item.mDescription);
  assert(NULL == room_no_item.mItem);
  assert(NULL == room_no_item.mNorth);
  assert(NULL == room_no_item.mSouth);
  assert(NULL == room_no_item.mEast);
  assert(NULL == room_no_item.mWest);

  // Room constructor test
  Room room_with_item("Pit", "A deep pit", new Item);

  assert("Pit" == room_with_item.mName);
  assert("A deep pit" == room_with_item.mDescription);
  assert(NULL != room_with_item.mItem);
  assert("" == room_with_item.mItem->getName());
  assert(true == room_with_item.mItem->mAvailiable);
```
  Next we’re going to add a monster to a new room and successfully find the same monster within the room. Note that due to the choice of a List data structure to hold the Monsters we have two options for finding the Monster; either by checking the back of the list for the most recently added monster or by passing the monster’s name as a parameter to our “getMonsterRef()” method which gets the monster’s reference from our List. 
```c
    // Room addMonster test
    Monster monster("monster", 1, 2, 3);
  Room room_monster("House", "A haunted mansion");

  room_monster.addMonster(&monster);

  assert(&monster == room_monster.mMonsters.back());

  // Room getMonsterRef test
  assert(&monster == &(room_monster.getMonsterRef(
          monster.getName())));
  assert(NULL == &(room_monster.getMonsterRef("sheep")));
  ```
  Then we should test the ability for a monster to be removed from a room, if a monster is present we expect the kill monster method to return true else it should return false. In addition if the name of the monster we are trying to kill is not found then kill monster should also return false. 
  ```c
    // Room killMonster test
    assert(false == room_monster.killMonster("Invalid monster name"));
  assert(true == room_monster.killMonster(monster.getName()));
  assert(false == room_monster.killMonster(monster.getName()));
 ```
 If the Room’s item is taken then the item itself should no longer be available.
 ```c
    // Room itemTaken test
    room_with_item.itemTaken();

  assert(false == room_with_item.mItem->mAvailiable);
```
Next we have the ability to search the room for either monsters and or items. Thinking about this you might be wondering how many different responses are possible. Well the solution is rather simple. <blockquote>A room can hold monsters and a single item. So the item is either present or not present within the room. For the monsters they are also either present or all dead. So we have two possible outcomes for the items and two possible outcomes for the monsters</blockquote> 

```c
// Room searchResponse
// Possible game responses without monsters in the room
// a) "There is a Item.mName in this room."
// b) "After searching, you found nothing of value"
Room room_a("Forest", "Many trees", new Item("Suit", Item::ARMOR, 0, 
      20, 0));
string response_a("There is a Suit in this room.");

assert(response_a == room_a.searchResponse());

Room room_b("Desert", "Sandy plains");
string response_b("After searching, you found nothing of value");

assert(response_b == room_b.searchResponse());

// Possible game responses with monsters
// c) "There is a Item.mName in this room.\nThere is a monster nearby...
//    Attack the Monster.mName"
// d) "After searching, you found nothing of value\nThere is a 
//    monster nearby... Attack the Monster.mName"
Room room_c("Sea", "Water", new Item("Blade", Item::WEAPON, 5, 0, 0));
Monster goblin("Goblin", 1, 2, 3);
room_c.addMonster(&goblin);
string response_c("There is a Blade in this room.\nThere is a monster nearby...\nAttack the Goblin");

assert(response_c == room_c.searchResponse());

Room room_d("Space", "Outer space");
Monster alien("Alien", 4, 5, 6);
room_d.addMonster(&alien);
string response_d("After searching, you found nothing of value\nThere is a monster nearby...\nAttack the Alien");

assert(response_d == room_d.searchResponse());
```
Given that we want the players to be able to move freely about, every room has four possible directions leading from it; the usual north, south, east and west. By chance if we accidently tried to invent a new direction the Room linking method should return false.  
```c
  // Room link test
  // The possible directions are 'n', 'e', 'w' or 's'
  Room home_room("House", "A large building");
  Room north("Pool", "A swimming poool");
  Room south("Yard", "Front lawn");
  Room east("Garage", "Empty garage");
  Room west("Balcony", "Wooden balcony");

  // Bad direction
  assert(false == home_room.link('z', north));
  // Good directions
  assert(true == home_room.link('n', north));
  assert(true == home_room.link('s', south));
  assert(true == home_room.link('e', east));
  assert(true == home_room.link('w', west));
  // Verify links
  assert(&north == &(home_room.north()));
  assert(&south == &(home_room.south()));
  assert(&west == &(home_room.west()));
  assert(&east == &(home_room.east()));
```
Lastly you can just add the Room getters/setters into the “Test.cpp” file.
```c
  // Room getters and setters
  home_room.setName("new room");
  assert("new room" == home_room.mName);

  home_room.setDescription("Your new room");
  assert("Your new room" == home_room.getDescription());

  Item* sword = new Item("sword", Item::WEAPON, 10, 0, 0);
  home_room.setItem(sword);
  assert(sword == home_room.mItem);
}
```
What we want to do next is to define the methods for the Room class. So open up the “database.cpp” file and lets get started, we’ll begin with the constructor for the Room so just pay attention to the use of the initialization list for the Room’s attributes. 
```c
  Room::Room( string name, string description, Item* item )
: mName(name), mDescription(description), mItem(item)
{
  mNorth = NULL ;
  mSouth = NULL ;
  mEast = NULL ;
  mWest = NULL ;
}
```
The next method we define will be the “Room::Link()” method. Given that the input is a single char we just have to check whether it is valid or not and then connect the room to the appropriate link. So a switch case block will be sufficient. 
```c
bool Room::link( char direction, MUD::Room& room )
{
  bool flag = false ;

  switch( direction )
  {
    case 'n':
    case 'N':
      mNorth = &room ;
      flag = true ;
      break ;

    case 's':
    case 'S':
      mSouth = &room ;
      flag = true ;
      break ;

    case 'e':
    case 'E':
      mEast = &room ;
      flag = true ;
      break ;

    case 'w':
    case 'W':
      mWest = &room ;
      flag = true ;
      break ;
  }

  return flag ;
}
```
Now that we can link rooms together the next methods will consist of returning the room for a defined direction.
```c
Room& Room::north( void ) 
{
  return *mNorth ;
}

Room& Room::south( void )
{
  return *mSouth ;
}

Room& Room::east( void )
{
  return *mEast ;
}

Room& Room::west( void )
{
  return *mWest ;
}
```
We define the setter for the name attribute. 
```c
void Room::setName( string newName )
{
  mName = newName ;
}
```
Next we have to define how the room should interact with monsters or rather adding, finding and or removing monsters. The first idea is simple, given that we are storing the Monster’s within a List data structure, to add a monster we simply append it to the back of the list.
```c
void Room::addMonster( Monster* newMonster )
{
  mMonsters.push_back( newMonster ) ;
}
```
In order to find a monster within our list of monsters we just iterate over the monster list until we match the name with the name of the monster we’re searching for; if no monster matched then we just return null.  
```c
Monster& Room::getMonsterRef( string monsterName ) 
{
  list< Monster* >::iterator iter ;
  Monster* monsterRef = NULL ;

  for( iter = mMonsters.begin() ; iter != mMonsters.end() ; ++iter )
  {
    if( (*iter)->getName() == monsterName )
    {
      monsterRef = *iter ;
      break ;
    }
  }

  return *monsterRef ;
}
```
For removing i.e killing a monster the idea is the same as finding it but we then remove it from the list of monsters as opposed to returning its reference. When the monster is not found we return false to indicate that no removal occurred. 
```c
Room::success Room::killMonster( string monsterName )
{
  list< Monster* >::iterator iter ;
  bool flag = false ;

  for( iter = mMonsters.begin() ; iter != mMonsters.end() ; ++iter )
  {
    if( (*iter)->getName() == monsterName )
    {
      mMonsters.erase( iter ) ;
      flag = true ;

      break ;
    }
  }

  return flag ;
}
```
Moving on, when an Item is taken from the room we just mark that the Item is unavailable.
```c
void Room::itemTaken( void )
{
  mItem->mAvailiable = false ;
}

void Room::setItem( Item* newItem )
{
  mItem = newItem ;
}
```
The Room’s description is another getter/setter pair.
```c
void Room::setDescription( string newDescription )
{
  mDescription = newDescription ;
}

string Room::getDescription( void ) const
{
  return mDescription ;
}
```
Finally we have to define the “Room::searchResponse()” method. The objective is to return a string object with all the information gathered about the current Room’s monsters and items. So lets start out with just the lines below, 
```c
string Room::searchResponse( void )
{
  string response ;
```
First we’re going to check if an item is currently in the room. An item exist within a room if its both not NULL and is currently available, else there is no item in the room. 
```c
    if( mItem != NULL && true == mItem->mAvailiable )
    {
      response = "There is a " + mItem->getName() + " in this room." ;
    }
    else
    {
      response = "After searching, you found nothing of value" ;
    }
```
Then, if there are monsters present(the monster list is non empty) and for the monsters who are not currently in combat with another player we should present the player with the option to attack it; finally adding this information to the response string.  
```c
    if( !mMonsters.empty() )
    {
      response = response + "\nThere is a monster nearby..." ;

      list< Monster* >::iterator iter ;

      for( iter = mMonsters.begin() ; iter != mMonsters.end() ; ++iter )
      {
        if( false == (*iter)->inCombat )
        {
          response = response + "\nAttack the " + (*iter)->getName() ;
        }
      }
    }

  return response ;
}
```
Lets run the test by changing our “main.cpp” file to look like the one below.
```c
//Filename main.cpp
#include "Database.h"
#include"Test.h"

using namespace MUD ;

int main(void)
{
  Test::get_instance()->test_item_class();
  Test::get_instance()->test_monster_class();
  Test::get_instance()->test_room_class();
}
```

[Click here for part V][link_part_5]

[link_part_3]: /2011/06/09/textbasedrpgpart3
[link_part_5]: /2011/06/15/textbasedrpgpart5
