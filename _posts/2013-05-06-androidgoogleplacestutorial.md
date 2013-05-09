---
layout: post
title: Android Google Places Tutorial
mydate: May 06 2013
tags: [java]
catagories: [mobile, android, tutorial]
comments: true 
description: I had just installed IntelliJ version 12.1.2 the other day and I saw an old Android project in the recent projects list. Thinking back I was satisfied with the result so I thought I should post it to my blog. It was a proof of concept application I wrote to list nearby restaurants based on your current location.
---
## Android Google Places Tutorial (Incomplete)

<div class="post-content" markdown="1">
### Pre-reqs
1. An Android phone you can debug and test with. Please don't use the Android Emulator its just not fair to end users who might discover UX bugs.
2. Get yourself a Google Places API Key if you don't have one already. [How to get a Google Places API Key](https://developers.google.com/places/documentation/)
3. Download the latest Android SDK or check for updates on your current installation. [developer.android.com](http://developer.android.com/index.html)
4. Setup a new Android Project environment on your favorite IDE or do whatever it is you do to develop for Android
5. You'll need the Android Maps Jar file or map.jar to be within your External Library dependencies. This requires adding the maps.jar file to your classpath... there are many ways to do this  but depending on your environment they may differ. Google is your friend. 
6. Don't yell at me for not being a total hipster and using Scala to write Android like all the other cool kids these days [Android Dev with Scala](https://github.com/pocorall/scaloid)
7. Anyways I don't even know Scala... besides it will probably be another year or so before big enterprise Java code bases start to migrate to it so I have some time to learn.

### What You Will Create
Below is a snapshot of the Android app we're going to develop today. It uses a simple ListView and doesn't support any click events. The reason as I mentioned in the pre-reqs section assuming you read it was that this app was a proof of concept for the Google Places API. Think of it as "Hello World" but using places instead of the TextView GUI widget.

<a href="/static/images/places_api.jpg"><img src="/static/images/places_api.jpg" style="padding: 5%; transform:rotate(90deg); -ms-transform:rotate(90deg); -webkit-transform:rotate(90deg);" alt="Google Places API Demo" width="30%" height="30%"/></a>

In the meantime create a new Android application and name it HttpTestActivity like I did for some odd reason or come up with a better sounding name for your project. On the current topic of boring and dull names I choose the exciting name of com.example for the package... you can use that name if you wish but I warn you to strive for excellence and excitment by chooing demonstrative package names.

### The Android Manifest File

Our Android manifest file will include the usual suspects which are the various uses-permission tags, the application tag and the intent-filter to designate the starting activity. If there was anything noteworthy I would go into further detail but the manifest for this project is slightly boring to be honest. So add the lines you need from the code below to your AndroidManifest.xml file. Don't despair Android Manifest files can become quite complex such as the ones I've written for apps I plan to ship to Google Play but for this tutorial we're stuck with a lame one.

<script src="https://gist.github.com/taywils/5533980.js"> </script>

The manifest xml did reference a string via the @string value so you'll need to include the XML file and replace it with your /res/values/strings.xml 

<script src="https://gist.github.com/taywils/5534449.js"> </script>
### The Main Activity

We'll start off by listing the various packages to import. For the most part I highly reccommend you look up the documentation for the imported packages you are not familiar with such as org.apache.http or many of the other packages not typically used by Android Devs. It would be tough to describe each package in detail but as I explain the source code it should be much clearer to see how each of the packages contribute to the app. So go ahead and add the package imports to your main activity file.

<script src="https://gist.github.com/taywils/5534247.js"> </script>

Start off by extending our main class from the Android Activity. As for class properties you'll want to store things such as the latitude and logitude for obvious reasons and in addition you'll need to encode your Google Places API Key as a string. The property radius can be thought of as the length of the radius of the circle expanding outward from the position of the phone owner when the places API returns results. We're setting the property *String type* to food but if you refer to the Google Places documenation there are other types which you can use but they will of course give you an entirely different set of places. As for the rest of the properties they are given more descriptive names which match their use cases.

<script src="https://gist.github.com/taywils/5543754.js"> </script>

</div>
