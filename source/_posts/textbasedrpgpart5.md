---
title: Build A Text Based Multiplayer RPG Part V
date: 2011-06-15
categories: [tutorial]
tags: [cpp]
banner: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/textbasedrpgpart5.JPG
thumbnail: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/textbasedrpgpart5.JPG
---
The fifth part of the tutorial on creating a text based multiplayer RPG game will see us creating the last part of the testing and game mechanics before the next section where we'll launch the client and server code to actually test our game in action.

<!-- more -->
- [Click here for part IV][link_part_4]
- [Click here for part VI][link_part_6]

In this part of the tutorial we will complete the test and methods necessary to get the full functionality for the stand alone single player version. In the next part of the tutorial part 6, we will begin to develop both the client and server code that allows other users to connect and play our game over a local area network. So lets continue with the testing and move onto the player class. Go ahead and open up the “test.h" file and add line below.

```c
void test_player_class();
```

Then open up the file “test.cpp" and add the methods for the player test class beginning at the line indicated.

```c
void Test::test_player_class(void)
{
  // Player constructor w/o initial room
  Player no_room_player("hero");

  assert(10 == no_room_player.mMaxHp);
  assert(10 == no_room_player.mHp);
  assert(1 == no_room_player.mStrength);
  assert(0 == no_room_player.mDefence);
  assert(NULL == no_room_player.mLocation);
  assert("hero" == no_room_player.mName);
  assert(NULL == no_room_player.mWeapon);
  assert(NULL == no_room_player.mArmor);

  // Player constructor w/room
  Player room_player("dude", new Room("Home", "A big house"));

  assert(NULL != room_player.mLocation);

  // Player getters/setters
  Player get_set("setter", new Room("Lake", "A clean lake"));

  get_set.setDefence(1);
  get_set.setHp(10);
  get_set.setName("getter");
  get_set.setStrength(2);

  assert(1 == get_set.getDefence());
  assert(10 == get_set.getHp());
  assert("getter" == get_set.getName());
  assert(2 == get_set.getStrength());
  assert("Lake" == get_set.getLocation());

  // Player equip test
  // The Item is not found
  // - There is no item within the room "There is no item to equip in this rooom"
  // - The player misspelled the item name "To equip an item you must type its full name correctly"
  Room no_item_room("Itemless", "There is no item here");
  Player no_item_player("Hi");
  no_item_player.mLocation = &no_item_room;
  string response("There is no item to equip in this room");

  assert(response == no_item_player.equip("Bad Item name"));

  Room with_item("Item room", "Item filled room", new Item("dagger", Item::WEAPON, 10, 0, 0));
  no_item_player.mLocation = &with_item;
  response = "To equip an item you must type its full name correctly";

  assert(response == no_item_player.equip("daggers"));

  // Weapon is found
  // - The weapon becomes unavailable
  // - The players strength is set equal to the weapons power value
  // - The response returned is "You equipped the Item.mName"      Player item_player("Bye", &with_item);
  response = "You equipped the dagger";

  assert(response == item_player.equip("dagger"));
  assert(false == with_item.mItem->mAvailiable);
  assert(with_item.mItem->getPower() == item_player.getStrength());

  // Armor is found
  // - The armor becomes unavailable
  // - The players vitality is set equal to the armor's defence  // - The response returned is "You equipped the Item.mName"
  // - The armor's health value is added to the players max hp
  Item* steel_plate = new Item("steelplate", Item::ARMOR, 0, 10, 20);
  with_item.setItem(steel_plate);
  response = "You equipped the steelplate";

  assert(response == item_player.equip("steelplate"));
  assert(with_item.mItem->mAvailiable == false);
  assert(steel_plate->getHealth() + item_player.getHp()
      == item_player.mMaxHp);
  assert(with_item.mItem->getVitality() == item_player.getDefence());

  // Health is found
  // - The health item becomes unavailable
  // - The player's hp is fully restored
  // - The response is "You were healed"
  Item* herb = new Item("herbs", Item::HEALTH, 0, 0, 0);
  with_item.setItem(herb);
  response = "You were healed";

  assert(response == item_player.equip("herbs"));
  assert(with_item.mItem->mAvailiable == false);
  assert(item_player.getHp() == item_player.mMaxHp);

  // Player attack test
  // a- There are no monsters within the Room then the method should  //methodreturn "There are no monsters in this room to fight"
  // b- The player mis-typed the monster name then
  //name"The Monster.mName is not here"
  // c- If damage was dealt to the monster then the message should say
  //should"Monster.mName was dealt X damage"  // d- If no damage was dealt to the monster then the message should say
  //should"Monster.mName dodged the attack"
  string response_a("There are no monsters in this room to fight");
  string response_b("The roll is not here");
  string response_c("troll was dealt 30 damage");
  string response_d("supertroll dodged the attack");

  Item* great_sword = new Item("greatsword", Item::WEAPON, 30, 0, 0);
  Room* arena = new Room("arena", "A large crowd gathers", great_sword);
  Monster* troll = new Monster("troll", 50, 0, 0);

  arena->setItem(great_sword);
  Player* attacker = new Player("Fighter", arena);
  attacker->equip("greatsword");

  assert(response_a == attacker->attack("troll"));

  arena->addMonster(troll);

  assert(response_b == attacker->attack("roll"));
  assert(response_c == attacker->attack("troll"));

  Monster* super_troll = new Monster("supertroll", 8, 0, 999);
  arena->addMonster(super_troll);
  assert(response_d == attacker->attack("supertroll"));

  // Player move test
  // - If the player moves in an invalid direction then  //direction"You traveled nowhere" should be returned
  // - If the direction is valid but no room is connected
  //is"There is nothing in that direction"
  // - If the direction is valid and a room exist
  //room"You traveled directionname\nmLocation->getDescription()"
  Room* moving_room = new Room("Moving room", "You can move from here");
  Room* moving_north = new Room("Moving north",  "North of the moving room");
  Room* moving_south = new Room("Moving south",  "South of the moving room");
  Room* moving_west = new Room("Moving west",
      "West of the moving room");
  Room* moving_east = new Room("Moving east",
      "East of the moving room");

  Player* moving_player = new Player("Jill", moving_room);
  response = "You traveled nowhere";

  assert(response == moving_player->move('p'));

  response = "There is nothing in that direction";

  assert(response == moving_player->move('n'));
  assert(response == moving_player->move('e'));
  assert(response == moving_player->move('w'));
  assert(response == moving_player->move('s'));

  moving_player->mLocation = moving_room;
  response = "You traveled North\n" + moving_north->getDescription();
  moving_room->link('n', *moving_north);
  assert(response == moving_player->move('n'));

  moving_player->mLocation = moving_room;
  response = "You traveled South\n" + moving_south->getDescription();
  moving_room->link('s', *moving_south);
  assert(response == moving_player->move('s'));

  moving_player->mLocation = moving_room;
  response = "You traveled West\n" + moving_west->getDescription();
  moving_room->link('w', *moving_west);
  assert(response == moving_player->move('w'));

  moving_player->mLocation = moving_room;
  response = "You traveled East\n" + moving_east->getDescription();
  moving_room->link('e', *moving_east);
  assert(response == moving_player->move('e'));

  // Player search test
  // Exact same as the string Room::searchResponse( void )  // method so it has already been tested

  // Player death test
  // -Returns true when the player's hp is less than zero
  // -Returns false when the player's hp is greater than zero
  Player* death_test = new Player("Dead guy");

  assert(false == death_test->death());

  death_test->setHp(-1);
  assert(true == death_test->death());
}
```

Now that we have the methods for the player class all set the next thing we have to do is to write out the methods for the player class. To do so open up the file “database.cpp" and add the methods for the player class below.

```c
Player::Player( string name, Room* start )  : mName(name), mLocation(start), mWeapon(NULL), mArmor(NULL),
  mHp(10), mMaxHp(10), mStrength(1), mDefence(0)
{
}

void Player::setHp( int newHp )
{
  mHp = newHp ;
}

int Player::getHp( void ) const
{
  return mHp ;
}

void Player::setStrength( int newStrength )
{
  mStrength = newStrength ;
}

int Player::getStrength( void ) const
{
  return mStrength ;
}

void Player::setDefence( int newDefence )
{
  mDefence = newDefence ;
}

int Player::getDefence( void ) const
{
  return mDefence ;
}

string Player::getLocation( void )
{
  return mLocation->mName ;
}

void Player::setName( string newName )
{
  mName = newName ;
}

string Player::getName( void ) const  {
  return mName ;
}

string Player::attack( string monsterName )
{
  list< Monster* >::iterator iter ;
  int damage = 0 ;
  string response( "The " + monsterName + " is not here" ) ;  stringstream ss ;
  string strDamage ;

  if( mLocation->mMonsters.empty() )
  {
    return "There are no monsters in this room to fight" ;
  }

  for( iter = mLocation->mMonsters.begin() ; iter != mLocation->mMonsters.end() ; ++iter )
  {
    if( (*iter)->getName() == monsterName )
    {
      damage = getStrength() - (*iter)->getDefence() ;
      ss << damage ;
      ss >> strDamage ;
      ss.clear() ;

      if( damage > 0 )
      {
        (*iter)->setHp( (*iter)->getHp() - damage ) ;
        response = (*iter)->getName() + " was dealt " + strDamage + " damage" ;
      }
      else
      {
        response = (*iter)->getName() + " dodged the attack" ;
      }

      break ;
    }
  }

  return response ;
}

string Player::equip( string itemName )
{
  string response ;

  if( mLocation->mItem != NULL && mLocation->mItem->getName() == itemName )
  {
    if( Item::WEAPON == mLocation->mItem->getType() && true == mLocation->mItem->mAvailiable )
    {
      mWeapon = mLocation->mItem ;
      mLocation->itemTaken() ;
      setStrength( mWeapon->getPower() ) ;
      response = "You equipped the " + mWeapon->getName() ;
      return response ;
    }
    else if( Item::ARMOR == mLocation->mItem->getType() && true == mLocation->mItem->mAvailiable )
    {
      mArmor = mLocation->mItem ;
      mLocation->itemTaken() ;
      setDefence( mArmor->getVitality() ) ;
      mMaxHp += mArmor->getHealth() ;
      response = "You equipped the " + mArmor->getName() ;
      return response ;
    }
    else
    {
      setHp( mMaxHp ) ;
      mLocation->itemTaken() ;
      response = "You were healed" ;
      return response ;
    }
  }
  else
  {
    if( mLocation->mItem == NULL )
    {
      return "There is no item to equip in this room" ;
    }
    response = "To equip an item you must type its full name correctly" ;

    return response ;
  }
}

string Player::move( char direction )
{
  string response = "You traveled " ;
  switch( direction )
  {
    case 'n':
    case 'N':
      if( NULL == mLocation->mNorth )
      {
        response = "There is nothing in that direction" ;
        break ;
      }
      mLocation = &(mLocation->north()) ;
      response = response + "North\n" + mLocation->getDescription() ;
      break ;

    case 's':
    case 'S':
      if( NULL == mLocation->mSouth )
      {
        response = "There is nothing in that direction" ;
        break ;
      }
      mLocation = &(mLocation->south()) ;
      response = response + "South\n" + mLocation->getDescription() ;
      break ;

    case 'e':
    case 'E':
      if( NULL == mLocation->mEast )
      {
        response = "There is nothing in that direction" ;
        break ;
      }
      mLocation = &(mLocation->east()) ;
      response = response + "East\n" + mLocation->getDescription() ;
      break ;

    case 'w':
    case 'W':
      if( NULL == mLocation->mWest )
      {
        response = "There is nothing in that direction" ;
        break ;
      }
      mLocation = &(mLocation->west()) ;
      response = response + "West\n" + mLocation->getDescription() ;
      break ;

    default:
      response = response + "nowhere" ;
  }

  return response ;
}

string Player::search( void )
{
  return mLocation->searchResponse() ;
}

Player::dead Player::death( void )
{
  if( getHp() <= 0 )
  {
    return true ;
  }

  return false ;
}
```
Afterwards you can begin to test the Dungeon class, so open up the file “test.h" file and add the following line.

```c
void test_dungeon_class(void);
```

Here are the methods for the dungeon test, it is quite long so you can copy it if you want to but I suggest typing it out and reading through the comments in order to better understand the codebase; the file for the code below is “test.cpp"

```c
void Test::test_dungeon_class(void)
{
  // Dungeon constructor test
  Dungeon* test_dungeon = new Dungeon(1, 1);

  assert(1 == test_dungeon->mMaxPlayers);
  assert(1 == test_dungeon->mMaxRooms);
  assert(true == test_dungeon->mPlayers.empty());
  assert(true == test_dungeon->mRooms.empty());
  // - A dungeon without monsters is considered complete
  assert(true == test_dungeon->isComplete());

  // Dungeon addPlayer test
  // - Successful addition of a new player should display the following
  //the"The player named newPlayer->getName() entered the Dungeon"
  Player* newbie = new Player("Noob");
  string response("The player named Noob entered the Dungeon");

  assert(response == test_dungeon->addPlayer(newbie));
  assert(false == test_dungeon->mPlayers.empty());

  // Dungeon addRoom test
  // - "The room: newRoom->mName was added" will be displayed
  //beif the addition was successful
  Room* main_room = new Room("Main hall", "The main hall");
  response = "The room: Main hall was added";

  assert(response == test_dungeon->addRoom(main_room));
  assert(false == test_dungeon->mRooms.empty());

  // Dungeon removePlayer test
  response = "Noob has left the dungeon";
  assert(response == test_dungeon->removePlayer(newbie->getName()));

  // Dungeon generatePlayerStats test
  // -Sets the players max hp to 10, strength and defence to 2
  test_dungeon->generatePlayerStats(newbie);

  assert(10 == newbie->getHp());
  assert(2 == newbie->getStrength());
  assert(2 == newbie->getDefence());

  // Dungeon combatLoop test
  // - If the hero is stronger than the monster then the monster  //theshould die else the hero should die
  Dungeon* combat_test = new Dungeon(1, 1);
  Room* combat_room = new Room("Battle", "Fight here");
  Item* longsword = new Item("longsword", Item::WEAPON, 100, 0, 0);
  Player* brawler = new Player("brawler", combat_room);
  Monster* ogre = new Monster("ogre", 10, 0, 0);  Monster* superogre = new Monster("superogre", 100, 100, 100);  combat_room->setItem(longsword);
  combat_room->addMonster(ogre);
  combat_room->addMonster(superogre);
  combat_test->addRoom(combat_room);
  combat_test->addPlayer(brawler);
  combat_test->generatePlayerStats(brawler);
  brawler->mLocation = combat_room;
  brawler->equip("longsword");

  combat_test->combatLoop(*brawler, *ogre);
  assert(combat_room->mMonsters.empty() == false);
  assert(combat_test->isComplete() == false);

  Item* badsword = new Item("badsword", Item::WEAPON, 0, 0, 0);
  combat_room->setItem(badsword);
  brawler->equip("badsword");

  combat_test->combatLoop(*brawler, *superogre);
  assert(true == brawler->death());

  // Dungeon playerStatus test
  Dungeon* status_test = new Dungeon(1, 2);
  Room* start_room = new Room("Starting room", "Start here");
  Room* end_room = new Room("Ending room", "End here");
  Player* stats_hero = new Player("Mike", start_room);
  Item* weapon_x = new Item("weaponx", Item::WEAPON, 20, 0, 0);
  Item* armor_x = new Item("armorx", Item::ARMOR, 0, 20, 10);

  start_room->link('e', *end_room);
  end_room->link('w', *start_room);
  start_room->setItem(weapon_x);
  end_room->setItem(armor_x);
  status_test->addRoom(start_room);
  status_test->addRoom(end_room);
  status_test->addPlayer(stats_hero);

  // The stats reported are the following
  /*
     1. Hp
     2. Strength
     3. Defence
     4. Location
     5. Name
     6. Weapon
     7. Armor
   */
  const int stat_total = 7;
  string* status_before_weapon = new string[stat_total];
  string* status_with_weapon = new string[stat_total];
  string* status_with_armor = new string[stat_total];

  status_before_weapon[0] = "Current HP: 10 out of 10";
  status_before_weapon[1] = "Current Strength: 2";
  status_before_weapon[2] = "Current Defence: 2";
  status_before_weapon[3] = "Current Location: Starting room";
  status_before_weapon[4] = "Current Name: Mike";
  status_before_weapon[5] = "Current Weapon: none equipped";
  status_before_weapon[6] = "Current Armor: none equipped";

  assert(status_before_weapon = status_test->playerStatus(*stats_hero));

  stats_hero->equip("weaponx");

  status_with_weapon[0] = "Current HP: 10 out of 10";
  status_with_weapon[1] = "Current Strength: 20";
  status_with_weapon[2] = "Current Defence: 2";
  status_with_weapon[3] = "Current Location: Starting room";
  status_with_weapon[4] = "Current Name: Mike";
  status_with_weapon[5] = "Current Weapon: weaponx";
  status_with_weapon[6] = "Current Armor: none equipped";

  assert(status_with_weapon = status_test->playerStatus(*stats_hero));

  stats_hero->move('e');
  stats_hero->equip("armorx");

  status_with_armor[0] = "Current HP: 10 out of 20";
  status_with_armor[1] = "Current Strength: 20";
  status_with_armor[2] = "Current Defence: 20";
  status_with_armor[3] = "Current Location: Ending room";
  status_with_armor[4] = "Current Name: Mike";
  status_with_armor[5] = "Current Weapon: weaponx";
  status_with_armor[6] = "Current Armor: armorx";

  assert(status_with_armor = status_test->playerStatus(*stats_hero));
}
```
Now we can write out the methods for the dungeon class itself. Go open up the file “database.cpp" and add the lines below to the file, remember to start at the line of code indicated in the margins.

```c
Dungeon::Dungeon( int maxPlayers, int maxRooms )  : mMaxPlayers(maxPlayers), mMaxRooms(maxRooms)
{
  mRooms.reserve( maxRooms ) ;
  mPlayers.reserve( maxPlayers ) ;
}

bool Dungeon::isComplete( void )
{
  bool flag = true ;

  for( unsigned int i = 0 ; i < mRooms.size() ; ++i )
  {
    if( mRooms[i]->mMonsters.empty() )
    {
      continue ;
    }
    else
    {
      flag = false ;
      break ;
    }
  }

  return flag ;
}

string Dungeon::addPlayer( Player *newPlayer )
{
  mPlayers.push_back( newPlayer ) ;
  string response = "The player named " + newPlayer->getName() + " entered the Dungeon" ;

  generatePlayerStats( newPlayer ) ;

  return response ;
}

void Dungeon::generatePlayerStats( Player* newPlayer )
{
  newPlayer->mMaxHp = 10 ;
  newPlayer->setHp( newPlayer->mMaxHp ) ;
  newPlayer->setStrength( 2 ) ;
  newPlayer->setDefence( 2 ) ;
}

string Dungeon::addRoom( Room *newRoom )
{
  mRooms.push_back( newRoom ) ;
  string response = "The room: " + newRoom->mName + " was added" ;

  return response ;
}

string Dungeon::removePlayer( std::string playerName )
{
  string response = playerName + " has left the dungeon" ;

  for( unsigned int i = 0 ; i < mPlayers.size() ; ++i )
  {
    if( playerName == mPlayers[i]->getName() )
    {
      mPlayers.erase( mPlayers.begin() + i ) ;
      break ;
    }
  }

  return response ;
}

//Should change this to have the monstersName as an argument
void Dungeon::combatLoop( Player& hero, Monster& villain )
{
  villain.inCombat = true ;

  while( true )
  {
    cout << hero.attack( villain.getName() ) << endl ;
    if( villain.getHp() <= 0 )
    {
      cout << villain.getName() + " was slain by the valiant " << hero.getName() << endl;
      hero.mLocation->killMonster( villain.getName() ) ;
      return ;
    }
    else
    {
      int damage = 0 ;
      damage = villain.getStrength() - hero.getDefence() ;

      if( damage > 0 )
      {
        hero.setHp( hero.getHp() - damage ) ;
        cout << hero.getName() + " was dealt " << damage << " damage" << endl ;
      }
      else
      {
        cout << hero.getName() + " dodged the attack" << endl ;
      }

      if( hero.death() )
      {
        cout << hero.getName() + " was slain by the horrible " + villain.getName() << endl;
        return ;
      }
    }
  }
}

string* Dungeon::playerStatus( Player& player )
{
  stringstream ss ;
  string temp ;
  const int statusCount = 7 ;
  string* response = new string[statusCount] ;

  ss << player.getHp() ;
  ss >> temp ;
  response[0] = "Current HP: " + temp ;
  ss.clear() ;
  temp.clear() ;
  ss << player.mMaxHp ;
  ss >> temp ;
  response[0] = response[0] + " out of " + temp ;
  temp.clear() ;
  ss.clear() ;

  ss << player.getStrength() ;
  ss >> temp ;
  response[1] = "Current Strength: " + temp ;
  ss.clear() ;
  temp.clear() ;

  ss << player.getDefence() ;
  ss >> temp ;
  response[2] = "Current Defence: " + temp ;
  ss.clear() ;
  temp.clear() ;

  if( NULL == player.mLocation )
  {
    response[3] = "Error: BAD LOCATION" ;
  }
  else
  {
    response[3] = "Current Location: " + player.getLocation() ;
  }

  response[4] = "Current Name: " + player.getName() ;

  if( NULL == player.mWeapon )
  {
    response[5] = "Current Weapon: none equipped" ;
  }
  else
  {
    response[5] = "Current Weapon: " + player.mWeapon->getName() ;
  }

  if( NULL == player.mArmor )
  {
    response[6] = "Current Armor: none equipped" ;
  }
  else
  {
    response[6] = "Current Armor: " + player.mArmor->getName() ;
  }

  return response ;
}

void Dungeon::displayHelp( void )
{
  cout << "////////////////" << endl ;
  cout << "Help menu" << endl ;
  cout << "////////////////" << endl ;
  cout << "Attack a monster type -> a:monster_name_here" << endl ;
  cout << "Move to a new location type -> mv:location_name_here" << endl ;
  cout << "Look for items type -> find:" << endl ;
  cout << "Search the room for exits and monsters type -> loc:" << endl ;
  cout << "Equip new items type -> eq:weapon_or_armor_name" << endl;
  cout << "See your current status type -> you:" << endl;
}
```

The next class we have to test is the filter class, if you recall from previous parts, the filter class’ job is to validate user input to check if it is safe to “dispatch" to the database. You can think of the filter as a sanitizer for bad commands just like you can image a filter swearing words on message boards. Now go open up “test.h" and add the following line.

```c
void test_filter_class(void);
```

You know the drill, create the test methods within the file “test.cpp" for the filter class(don’t worry this class is short).

```c
void Test::test_filter_class(void)
{
  // Filter chat test
  // string Filter::chat() just truncates the command from the  //fromchat message if it was t:message  Filter filter;
  string input("t:Hello world");
  string response("Hello world");

  assert(response == filter.chat(input));

  // Filter validateMessage test
  /*
     The valid commands are the following
    a:
    mv:
    find:
    loc:
    eq:
    you:
    help:
   */
  assert(true == filter.validateMessage("mv:n"));
  assert(true == filter.validateMessage("a:goblin"));
  assert(true == filter.validateMessage("find:"));
  assert(true == filter.validateMessage("loc:"));
  assert(true == filter.validateMessage("eq:weapon"));
  assert(true == filter.validateMessage("you:"));
  assert(true == filter.validateMessage("help:"));

  assert(false == filter.validateMessage("move:north"));
  assert(false == filter.validateMessage("move:south"));
  assert(false == filter.validateMessage("move:east"));
  assert(false == filter.validateMessage("move:west"));
  assert(false == filter.validateMessage("attack:goblin"));
  assert(false == filter.validateMessage("fid:"));
  assert(false == filter.validateMessage("location:"));
  assert(false == filter.validateMessage("eqip:weapon"));
  assert(false == filter.validateMessage("me:"));
  assert(false == filter.validateMessage("zelpeafaf:"));
  assert(false == filter.validateMessage("gg:"));
  assert(false == filter.validateMessage("Pi:affg"));
  assert(false == filter.validateMessage("Eqip:weapon"));
  assert(false == filter.validateMessage("Ye:"));
  assert(false == filter.validateMessage("no command input"));
}
```
There are only two methods for the filter class, chat and validate message. As you can probably guess, chat just sends out the text following the chat command “t:". However validate message a bit more involved. Validate message works by running three distinct test, the “keywordtest" the “commandtest" and the movecommandtest". Keyword just makes sure that the user entered a keyword such as “a:" for attack, “you:" for player status or any of the others. The “commandtest" just checks after the keyword has been validated that the fullname of the command matches the possible command inputs. Lastly the “movecommandtest" ensures that the direction of travel for the move command is north, south, east or west. So go open up “database.cpp" and add the lines below paying attention to which line the code begins on as shown in the margin.
```c
Filter::valid Filter::validateMessage( std::string message )
{
  //Necessary for the std::tolower() method
  locale loc ;

  for( unsigned int i = 0 ; i < message.length() ; ++i )
  {
    message [ i ] = tolower( message[ i ], loc ) ;
  }

  bool keywordTest = false ;  bool commandTest = false ;  bool moveCommandTest = true ; // Checks for a valid direction
  unsigned int inputIndex = 0;

  switch( message[ 0 ] )
  {
    case 'a': //Attack  case 'm': //Move
    case 'f': //Find
    case 'l': //Location
    case 'e': //Equip
    case 'y': //You
    case 't': //Talk
    case 'h': //Help Menu
      keywordTest = true ;
      break ;break

    default:
        keywordTest = false ;
  }

  if( false == keywordTest )
  {
    return false ;
  }

  string subMessage ;

  for( unsigned int i = 0 ; i < message.size() ; ++i )
  {
    if( message[ i ] == ':' )
    {
      inputIndex = i;
      subMessage += message[ i ] ;
      break ;
    }
    else
    {
      subMessage += message[ i ] ;
      continue ;
    }
  }

  if( subMessage == "a:" ||
      subMessage == "mv:" ||
      subMessage == "find:" ||
      subMessage == "loc:" ||
      subMessage == "eq:" ||
      subMessage == "you:" ||
      subMessage == "t:" ||
      subMessage == "help:" )
  {
    commandTest = true ;
  }
  else
  {
    return false;
  }

  if( subMessage == "mv:" )
  {
    //Checks if a direction was entered by the player,
    // accomplishes this by seeing if the mv: command
    // is followed by at most a single character representing
    // the directions 'n' or 'e' or 'w' or 's'
    if( inputIndex + 1 == message.size() )
    {
      moveCommandTest = false;
    }

    while( inputIndex < message.size() )
    {
      if( false == moveCommandTest )
      {
        break ;
      }

      if(message[ inputIndex ] == ' ')
      {
        moveCommandTest = false;
        break ;
      }

      ++inputIndex ;
    }inputIndex
  }

  if( true == commandTest && true == keywordTest && true == moveCommandTest )
  {
    return true ;
  }
  else
  {
    return false ;
  }
}

string Filter::chat( string message )
{
  return message.substr( 2, message.length() ) ;
} 
```
The dispatch class is the last class we need for thesingle player version of the game. Being the dispatchits sole purpose is to separate the value and command fromthe filtered user input and “dispatch" it to the database.Now lets open up “test.h" and add the line below. 
```c
void test_dispatch_class(void);
```
Next we’ll write out the test for the dispatch class within "test.cpp", so go open that file and insert the code below.
```c
void Test::test_dispatch_class()
{
  // Dispatch extractCommand test
  //a Attack  //m Move
  //f Find
  //l Location
  //e Equip
  //y You
  //t Talk
  //h Help Menu
  Dispatch dispatch;

  assert('a' == dispatch.extractCommand("a:"));
  assert('m' == dispatch.extractCommand("mv:"));
  assert('f' == dispatch.extractCommand("find:"));
  assert('l' == dispatch.extractCommand("loc:"));
  assert('e' == dispatch.extractCommand("eq:"));
  assert('y' == dispatch.extractCommand("you:"));
  assert('t' == dispatch.extractCommand("t:"));
  assert('h' == dispatch.extractCommand("help:"));

  // Dispatch extractValue test
  /*
     The only commands that take values.

     attack  move  equip
     talk  */
  assert("goblin" == dispatch.extractValue("a:goblin"));
  assert("north" == dispatch.extractValue("mv:north"));
  assert("armor" == dispatch.extractValue("eq:armor"));
  assert("hello world" == dispatch.extractValue("t:hello world"));
  assert("  s p a c  e  s  " == dispatch.extractValue(
        "t:  s p a c  e  s  "));
} 
```
Now we can add the methods for the dispatch class to our “database.cpp"file. Open up the file “database.cpp" and add the lines below.
```c
char Dispatch::extractCommand(std::string fromFilter)
{
  //a Attack  //m Move
  //f Find
  //l Location
  //e Equip
  //y You
  //t Talk
  //h Help Menu

  return fromFilter[ 0 ] ;
}

string Dispatch::extractValue(std::string fromFilter)
{
  /*
     The value of the string from the filter is all of the text
     that follows the command.

     -Example-
a:goblin

The command is a:
The value is goblin
   */

  // For single character commands such as t:
  if( fromFilter[ 1 ] == ':' )
  {
    return fromFilter.substr( 2, fromFilter.length() ) ;
  }

  return fromFilter.substr( 3, fromFilter.length() ) ;
} 
```
The last thing we have to do before we can call our single player version of the game complete is to make sure all the test pass with flying colors. Beingthat we only implemented unit test, you will be notified when a test failsby the console giving you a “assertion failed at line:XYZ" where XYZ is the line number. So open up “main.cpp" and make sure it looks like the code below. 
```c
//Filename main.cpp
#include "Database.h"
#include"Test.h"

using namespace MUD ;

void run_test(void)
{
  cout << "Ignore the combat printouts from the\n";
  cout << "test_dungeon_class() method\n" << endl;

  Test::get_instance()->test_item_class();
  Test::get_instance()->test_monster_class();
  Test::get_instance()->test_room_class();
  Test::get_instance()->test_player_class();
  Test::get_instance()->test_dungeon_class();
  Test::get_instance()->test_filter_class();
  Test::get_instance()->test_dispatch_class();
}

void run_sample_game(void);

int main(void)
{
  run_test();
  //run_sample_game();
  return 0;
}

void run_sample_game(void)
{
  //Construct Dungeon
  Dungeon caves( 2, 21 ) ;

  //Items power vitality health
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

  //Monsters hp str def
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

  //Rooms name description item
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

  //Link Rooms
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

  //Add monsters to rooms
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

  //Add the rooms to the dungeon
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

  //Create a filter  Filter filter ;

  //Create a dispatch object with a command char and a value string
  Dispatch dispatch ;
  char command ;
  string value ;

  //Simulate a new game
  //Create a new player and add to the dungeon
  string input ;
  cout << "Welcome to the game\nEnter in a new name: " ;
  getline(cin, input, '\n');

  Player* one = new Player( input, mainHall ) ;
  cout << caves.addPlayer( one ) << endl ;

  //Display needed info for the players
  cout << "The objective is to clear the dungeon of all monsters. Good Luck" << endl ;
  cout << "Enter in a new command to start, to display help type the following command" << endl ;
  cout << "help:" << endl ;
  cout << "To quit simply enter \"quit\" without the quotes as a new command" << endl ;
  cout << "New Command" << endl ;
  getline(cin, input, '\n');

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
          if( &(one->mLocation->getMonsterRef( value )) == NULL )
          {
            cout << "There is no " + value + " at this location" << endl ;
            break ;
          }
          //If the monster is there but in combat the player cannot fight it
          if( one->mLocation->getMonsterRef( value ).inCombat == true )
          {
            cout << "The " + value + " is currently fighting" << endl ;
            break ;
          }

          caves.combatLoop( *one, one->mLocation->getMonsterRef( value ) ) ;
          break ;

        case 'm': //Move
          cout << one->move( value[ 0 ] ) ;
          break ;

        case 'f': //Find
          cout << one->search() ;
          break ;

        case 'l': //Location
          cout << one->getLocation() ;
          break ;

        case 'e': //Equip
          cout << one->equip( value ) ;
          break ;

        case 'y': //You
          {
            string* playerStats = new string ;
            playerStats = caves.playerStatus( *one ) ;

            for( int i = 0 ; i < 7 ; ++i )
            {
              cout << playerStats[i] << endl ;
            }endl
          }
          break ;

          //case 't': //Talk

        case 'h': //Help Menu
          caves.displayHelp();
          break ;
      }
    }
    else
    {
      cout << "Invalid command please refer to the help menu.\nhelp:" << endl ;
      cout << "Or type \"quit\" to quit the game" << endl ;
    }

    if( caves.isComplete() )
    {
      cout << "Dungeon Cleared, YOU WIN!" << endl ;
      break ;
    }

    if( one->death() )
    {
      cout << one->getName() + " was slain by the " + one->mLocation->getMonsterRef( value ).getName() << endl ;
      one->mLocation->getMonsterRef( value ).inCombat = false ;
      cout << "*Hint* Secret rooms hidden abound; find them and victory shall be yours" << endl ;
      input = "quit" ;
    }
    else
    {
      //Get the next command
      cout << "\n\nNew Command" << endl ;
      getline(cin, input, '\n');
    }
  }

  caves.removePlayer( one->getName() ) ;
}
```
For reference here are all the files for the project below.If none of the dropbox links are working then mention it in the comments section and I’ll re-upload the files. 
<p>
<a  href="http://dl.dropbox.com/u/22280460/database.cpp">http://dl.dropbox.com/u/22280460/database.cpp</a>
<br />
<a href="http://dl.dropbox.com/u/22280460/database.h">http://dl.dropbox.com/u/22280460/database.h</a>
<br />
<a href="http://dl.dropbox.com/u/22280460/main.cpp">http://dl.dropbox.com/u/22280460/main.cpp</a>
<br />
<a href="http://dl.dropbox.com/u/22280460/Test.cpp">http://dl.dropbox.com/u/22280460/Test.cpp</a>
<br />
<a href="http://dl.dropbox.com/u/22280460/Test.h">http://dl.dropbox.com/u/22280460/Test.h</a>
</p>

[Click here for part VI][link_part_6]

[link_part_4]: /2011/06/11/textbasedrpgpart4
[link_part_6]: /2011/06/16/textbasedrpgpart6
