---
title: Build A Text Based Multiplayer RPG Part II
date: 2011-06-08
categories: [tutorial]
tags: [cpp]
banner: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/textbasedrpgpart2.JPG 
thumbnail: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/textbasedrpgpart2.JPG
---
In the second part of the series on building a multiplayer console based RPG we look at the unit test structure and create code to test the methods and properties of our Item class as was introduced in the first part.

<!-- more -->
[Click here for part I][link_part_1]
[Click here for part III][link_part_3]

# Intro

In this part of the tutorial we are going to write the methods and implement unit testing for the Item class introduced in part 1.

Using a test driven development style means that we have to think of the class design first as a set of tests which we want it to meet before we begin writing any of the code. However, before any of that we have to first design our test class.

## The Test Singleton

So create a new C++ header file for your project and title it “Test.h” and type the following.

In this part of the tutorial we are going to write the methods and implement unit testing for the Item class introduced in part 1.

Using a test driven development style means that we have to think of the class design first as a set of tests which we want it to meet before we begin writing any of the code. However, before any of that we have to first design our test class.

So create a new C++ header file for your project and title it “Test.h” and type the following.
```c
// Filename Test.h
#pragma once

#include"database.h"

#include<cassert>

using namespace MUD;
```

For the test class we will implement it as a singleton. Singleton in short means that only a single reference to the class can be accessed at any given time during the program’s execution. However, there are some pitfalls to watch out for when using singleton for objects which clearly should not have a single instance, but in this case we only need to run our test cases once so having multiple test objects each running separate tests will only add confusion to our codebase. 

```c
/*
   The Test class uses the singleton design pattern in order to insure 
   that only one Test object will be availiable during program execution.
 */
class Test
{
  public:
    // To call Test methods you have to get the Test instance reference.
    static Test* get_instance();

    // Place additional test methods here.
    void test_item_class(void);

  private:
    // In singleton we have to keep the constuctor private
    // to prevent accidental creation of more than one object.
    Test(void){};
    // Same deal with the copy constructor and the assignment operator,
    // to prevent making duplicates.
    Test(const Test& test_object){}; 
    Test& operator=(const Test& test_object){};

    // This pointer will be the only instance of the Test class.
    static Test* instance;
};
```
Next, create a new C++ file and title it “Test.cpp”, now add the following lines of code.
```c
// Filename Test.cpp
#include"Test.h"
```
In order to utilize singleton we have to rely on a global reference to our Test instance which will only be initialized once as you can see below.
```c
// The only instance of the Test class we allow.
Test* Test::instance = NULL; 

// Must be called in order to use the Test methods.
Test* Test::get_instance()
{
  if(Test::instance == NULL)
  {
    instance = new Test;
  }

  return instance;
}
```

<p>Therefore, whenever we want to run a method from our Test class we have to first get the reference and then call the proper test method.</p> <p>Enter the following code.</p> 

```c
void Test::test_item_class(void)
{
```

<p>If you recall from part 1 of this tutorial, the Item class represents things players can pick up and use to their advantage during the game. Thus we want to make sure that items can be named, have their effects set, their type set and lastly whether or not they are currently available within the dungeon for use. </p> <p>We’ll begin by testing the Item constructor, so enter the code below.</p> 

```c
  // Item constructor test
  Item test_sword("sword", Item::WEAPON, 10, 0, 0);

  assert("sword" == test_sword.getName());
  assert(Item::WEAPON == test_sword.getType());
  assert(10 == test_sword.getPower());
  assert(0 == test_sword.getVitality());
  assert(0 == test_sword.getHealth());
  assert(true == test_sword.mAvailiable);
```
<p>The idea with unit testing is that we check assertions or in other words we test our assumptions about how we believe the code should function. </p><p>There are many other types of testing such as functional testing and integration testing but all we need for this simple game is unit testing so don’t worry about testing becoming overkill we will get back to the game design soon enough.</p> <p>Next we test the assignment operator for the item class. Type the following,</p>

```c
// Item operator= test
Item another_sword = test_sword;

assert("sword" == another_sword.getName());
assert(Item::WEAPON == another_sword.getType());
assert(10 == another_sword.getPower());
assert(0 == another_sword.getVitality());
assert(0 == another_sword.getHealth());
assert(true == another_sword.mAvailiable);
// The weapons shouldn't share the same memory address.
assert(&another_sword != &test_sword);
```

<strong>Pay special attention to the last test.</strong>

```c
// The weapons shouldn't share the same memory address.
assert(&another_sword != &test_sword);
```
One of the reasons why C++ is considered a tough language to learn is that many programmers just want to avoid learning how pointers and references impact the use of C++’s object model. So lets check this out right quick with a short example.

Lets imagine the following scenario<strong><em>(don’t type these in yet since we haven’t implemented the actual methods in database.cpp)</em></strong>

 ```c
Item woodsword = Item("woodsword", Item::WEAPON, 9, 0, 0);
Item barksword = woodsword;

cout << "barksword memory address = " << &barksword << endl;
cout << "woodsword memory address = " << &woodsword << endl;
cout << "woodsword->getName() == " << woodsword.getName() << endl;
cout << "call barksword->setName(\"happysword\")" << endl; 
barksword.setName("happysword");
cout << "woodsword->getName() == " << woodsword.getName() << endl;
```

Note the different memory addresses of the two items. After changing the name of the “barksword” item, the “woodsword” remained intact. However, consider the next example...

 ```c
Item* woodsword = new Item("woodsword", Item::WEAPON, 9, 0, 0);
Item* barksword = woodsword;

cout << "barksword memory address = " << barksword << endl;
cout << "woodsword memory address = " << woodsword << endl;
cout << "woodsword->getName() == " << woodsword->getName() << endl;
cout << "call barksword->setName(\"happysword\")" << endl; 
barksword->setName("happysword");
cout << "woodsword->getName() == " << woodsword->getName() << endl;
```

Did you notice that changing the name of the “barksword” also changed the name of the “woodsword” to “happysword”. In addition look again at the memory address’, they are exactly the same. Here the C++ compiler did exactly what we told it to do and nothing more but we were unaware that the assignment of pointers meant that the bark and wood swords now reference the same item in memory. Here is what we meant to say to the compiler.

 ```c
Item* woodsword = new Item("woodsword", Item::WEAPON, 9, 0, 0);
Item* barksword = new Item(woodsword->getName(), woodsword->getType(),
woodsword->getPower(), woodsword->getVitality(),
woodsword->getHealth());

cout << "barksword memory address = " << barksword << endl;
cout << "woodsword memory address = " << woodsword << endl;
cout << "woodsword->getName() == " << woodsword->getName() << endl;
cout << "call barksword->setName(\"happysword\")" << endl; 
barksword->setName("happysword");
cout << "woodsword->getName() == " << woodsword->getName() << endl;
```

Thus we meant for the attributes of the “woodsword” to be assigned to the “barksword” and for the “barksword” to have its own memory address. Now that we have demonstrated the reasoning behind the reference assertion in the unit test you can finally finish up the Item class test cases for the getter and setter methods.

 ```c
  // Item void constructor test
  Item void_sword;

  assert("" == void_sword.getName());
  assert(Item::WEAPON == void_sword.getType());
  assert(0 == void_sword.getPower());
  assert(0 == void_sword.getVitality());
  assert(0 == void_sword.getHealth());
  assert(true == void_sword.mAvailiable);

  // Item setters and getters test
  void_sword.setPower(99);
  void_sword.setName("steel sword");
  void_sword.setVitality(100);
  void_sword.setType(Item::ARMOR);
  void_sword.setHealth(36);
  void_sword.mAvailiable = false;

  assert("steel sword" == void_sword.getName());
  assert(Item::ARMOR == void_sword.getType());
  assert(99 == void_sword.getPower());
  assert(100 == void_sword.getVitality());
  assert(36 == void_sword.getHealth());
  assert(false == void_sword.mAvailiable);
}
```

That’s it for now. Oh wait, here is the whole source for Test.h and Test.cpp for reference.

```c
// Filename Test.h
#pragma once

#include"database.h"

#include<cassert>

using namespace MUD;

/*
  The Test class uses the singleton design pattern in order to insure 
  that only one Test object will be availiable during program execution.
*/
class Test
{
  public:
    // To call Test methods you have to get the Test instance reference.
    static Test* get_instance();

    // Place additional test methods here.
    void test_item_class(void);

  private:
    // In singleton we have to keep the constuctor private
    // to prevent accidental creation of more than one object.
    Test(void){};
    // Same deal with the copy constructor and the assignment operator,
    // to prevent making duplicates.
    Test(const Test& test_object){}; 
    Test& operator=(const Test& test_object){};

    // This pointer will be the only instance of the Test class.
    static Test* instance;
};
```

## Code Listing

```c
// Filename Test.cpp
#include"Test.h"

// The only instance of the Test class we allow.
Test* Test::instance = NULL; 

// Must be called in order to use the Test methods.
Test* Test::get_instance()
{
  if(Test::instance == NULL)
  {
    instance = new Test;
  }

  return instance;
}

void Test::test_item_class(void)
{
  // Item constructor test
  Item test_sword("sword", Item::WEAPON, 10, 0, 0);

  assert("sword" == test_sword.getName());
  assert(Item::WEAPON == test_sword.getType());
  assert(10 == test_sword.getPower());
  assert(0 == test_sword.getVitality());
  assert(0 == test_sword.getHealth());
  assert(true == test_sword.mAvailiable);

  // Item operator= test
  Item another_sword = test_sword;

  assert("sword" == another_sword.getName());
  assert(Item::WEAPON == another_sword.getType());
  assert(10 == another_sword.getPower());
  assert(0 == another_sword.getVitality());
  assert(0 == another_sword.getHealth());
  assert(true == another_sword.mAvailiable);
  // The weapons shouldn't share the same memory address.
  assert(&another_sword != &test_sword);

  // Item void constructor test
  Item void_sword;

  assert("" == void_sword.getName());
  assert(Item::WEAPON == void_sword.getType());
  assert(0 == void_sword.getPower());
  assert(0 == void_sword.getVitality());
  assert(0 == void_sword.getHealth());
  assert(true == void_sword.mAvailiable);

  // Item setters and getters test
  void_sword.setPower(99);
  void_sword.setName("steel sword");
  void_sword.setVitality(100);
  void_sword.setType(Item::ARMOR);
  void_sword.setHealth(36);
  void_sword.mAvailiable = false;

  assert("steel sword" == void_sword.getName());
  assert(Item::ARMOR == void_sword.getType());
  assert(99 == void_sword.getPower());
  assert(100 == void_sword.getVitality());
  assert(36 == void_sword.getHealth());
  assert(false == void_sword.mAvailiable);
}
```
 
[Click here for part III][link_part_3]

[link_part_1]: /2011/06/05/textbasedrpgpart1
[link_part_3]: /2011/06/09/textbasedrpgpart3
