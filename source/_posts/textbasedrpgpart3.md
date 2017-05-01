---
title: Build A Text Based Multiplayer RPG Part III
date: 2011-06-09
categories: [tutorial]
tags: [cpp]
banner: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/textbasedrpgpart3.JPG
thumbnail: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/textbasedrpgpart3.JPG
comments: false
---
After writing the code to support the unit test in part II, beginning in this part we'll look at the code behind the test to verify that our test are sound and correct.
Where we left off we had just implemented the unit test for the Item class. However, before we can even run the test we have to first write out the methods. So create a new C++ file, title it “database.cpp” and add it to your project’s directory. Now go ahead and type in the following.

<!-- more -->
[Click here for part II][link_part_2]
[Click here for part IV][link_part_4]

```c
// Filename database.cpp
#include "Database.h"

using namespace MUD ;
```
For the first method of the Item class we’ll define the method for the Item’s constructor. The Item constructor will just take a single argument for each of its attributes as we defined in the “database.h” file. Here is the Item class definition in the header file again as a refresher.
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
As you’ll notice there are five attributes which have getter and setter methods while the sixth attribute of the Item class “mAvailiable” will not require getter and setter methods. Thus the constructor should allow a new Item to be created given some initial values for each of the five attributes we mentioned.
```c
  Item::Item( string name, Item::TYPE type, int power, int vitality, int health ) 
: mName(name), mType(type), mPower(power), mVitality(vitality), 
  mHealth(health)
{
  mAvailiable = true ;
}
```
Next we’ll overload the assignment operator for the Item class. For this operator overload we just want to the copy one Item’s attributes to another Item’s.  
```c
Item Item::operator=( Item& newItem )
{
  setName( newItem.getName() ) ;
  setType( newItem.getType() ) ;
  setPower( newItem.getPower() ) ;
  setVitality( newItem.getVitality() ) ;
  setHealth( newItem.getHealth() ) ;
  mAvailiable = newItem.mAvailiable ;

  return *this ;
}
```
Afterwards we turn our attention to the Item class’ default constructor. The default constructor for the Item should just create a blank Item that will be completely useless but still available for pickup. In addition since the item will not have a name, we can always check for the condition when a Item was accidently created in our game by seeing if the Item’s name is the empty string.
```c
// The default Item::TYPE doesn't have to be Item::TYPE::WEAPON
// as long as its not NULL its fine.
Item::Item( void )
{
  setName( "" ) ;
  setType( Item::WEAPON ) ;
  setPower( 0 ) ;
  setVitality( 0 ) ;
  setHealth( 0 ) ;
  mAvailiable = true ;
}
```
The remaining methods are the getters and setters for the attributes power, vitality, health, name and type. Getters and setters in general for the C++ language are a pair of methods that allow you to write a value to an attribute or read the current value from an attribute. Anyways here they are below. 
```c
void Item::setPower( int value )
{
  mPower = value ;
}

int Item::getPower( void )
{
  return mPower ;
}

void Item::setVitality( int value )
{
  mVitality = value ;
}

int Item::getVitality( void )
{
  return mVitality ;
}

void Item::setHealth( int value )
{
  mHealth = value ;
}

int Item::getHealth( void )
{
  return mHealth ;
}

void Item::setName( string name )
{
  mName = name ;
}

string Item::getName( void )
{
  return mName ;
}

void Item::setType( Item::TYPE newType )
{
  mType = newType ;
}

Item::TYPE Item::getType( void )
{
  return mType ;
}
```
Lastly we’ll run the test for our Item class; to begin create a new C++ file and title it “main.cpp”. Add the the code below to “main.cpp”. Remember that to use our Test object we have to call the “get_instance()” method since we created Test as a singleton. 
```c
//Filename main.cpp
#include "Database.h"
#include"Test.h"

using namespace MUD ;

int main(void)
{
  Test::get_instance()->test_item_class();
}
```
Ok, that’s it for today.

[link_part_2]: /2011/06/08/textbasedrpgpart2
[link_part_4]: /2011/06/11/textbasedrpgpart4
