---
title: Android Google Places Tutorial
date: 2013-05-06
tags: [java]
categories: [mobile, android, tutorial]
---
I had just installed IntelliJ version 12.1.2 the other day and I saw an old Android project in the recent projects list. Thinking back I was satisfied with the result so I thought I should post it to my blog. It was a proof of concept application I wrote to list nearby restaurants based on your current location.

### __FOR READERS IN A HURRY__
The entire Java class files themselves are located at the end of this post just before the comments.

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

<a href="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/places_api.jpg"><img src="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/places_api.jpg" width="30%" height="30%" alt="Google Places API Demo"/></a>

In the meantime create a new Android application and name it HttpTestActivity like I did for some odd reason or come up with a better sounding name for your project. On the current topic of boring and dull names I choose the exciting name of com.example for the package... you can use that name if you wish but I warn you to strive for excellence and excitment by chooing demonstrative package names.

### The Android Manifest File

Our Android manifest file will include the usual suspects which are the various uses-permission tags, the application tag and the intent-filter to designate the starting activity. If there was anything noteworthy I would go into further detail but the manifest for this project is slightly boring to be honest. So add the lines you need from the code below to your AndroidManifest.xml file. Don't despair Android Manifest files can become quite complex such as the ones I've written for apps I plan to ship to Google Play but for this tutorial we're stuck with a lame one.

<script src="https://gist.github.com/taywils/5533980.js"> </script>

The manifest xml did reference a string via the @string value so you'll need to include the XML file listed below and replace it with your /res/values/strings.xml 

<script src="https://gist.github.com/taywils/5534449.js"> </script>

### The Main Activity

We'll start off by listing the various packages to import. For the most part I highly reccommend you look up the documentation for the imported packages you are not familiar with such as org.apache.http or many of the other packages not typically used by Android Devs. It would be tough to describe each package in detail but as I explain the source code it should be much clearer to see how each of the packages contribute to the app. So go ahead and add the package imports to your main activity file.

<script src="https://gist.github.com/taywils/5534247.js"> </script>

Start off by extending our main class from the Android Activity. As for class properties you'll want to store things such as the latitude and logitude for obvious reasons and in addition you'll need to encode your Google Places API Key as a string. The property radius can be thought of as the length of the radius of the circle expanding outward from the position of the phone owner when the places API returns results. We're setting the property *String type* to food but if you refer to the Google Places documenation there are other types which you can use but they will of course give you an entirely different set of places. As for the rest of the properties they are given more descriptive names which match their use cases.

<script src="https://gist.github.com/taywils/5543754.js"> </script>

### onCreate And Other Initialization Stuff

As with most typical Android apps the onCreate method needs to load starting view taken from one of the XML files within your Layout folder.
Once we set the content view to the httptestlist layout we'll need to start listnening for our current location.
We represent the action of listening for a location by creating a new instance of the MyLocation class and overriding the gotLocation method.
Any code we add within the gotLocation method will be immediately called just after the location has been determined by the GPS.
Note how we don't explicitly tell the application within the onCreate method to start listening for the current location.
We actually defer the task of acquiring the current location to a Java Runnable object and stall the main activity thread using a progress spinner(progressDialog).
This is the reason why there is a line of code within the gotLocation method to dismiss the progressDialog.
<script src="https://gist.github.com/taywils/5633124.js"> </script>

### A Utility Method To Pre-Parse XML And An AsyncTask To Ping Google's API

We need a utility method to take an XML file represented by a String object and parse it into a Java Document object which we can then use to actually parse the data.
The loadXMLFromString method is rather straight forward if you are familiar with how Java uses the Factory Design pattern.
Next we define an inner class called GetCurrentLocation. Do you recall the gotLocation() method from the onCreate? Here is the async task we create which does two things.
First it checks if the latitude and longitude have been properly set; and second it constructs a valid Google Places API query and sends it off to get a XML result.
The minor assertion line of code within the onPostExecute method is me just being paranoid; it assures that we don't waste Google's resources by trying to call the API before we are ready. If you carefully analyze the onPostExecute method you'll see that the last line which creates a new QueryGooglePlaces object is deferring the HTTP GET
call to yet another AsyncTask. I'm not too confident that this style of chained AsyncTask calls is a best practice but I've been using it for a while in my Android Applications and it has yet to fail me. If you have experience with chained AsyncTasks let me know; I'm only using because I need to synchronize the call to Google's Places API such that it will only be made once we have correctly set our request string. I wonder if the newest Android API has jumped on the coroutine bandwagon... hey don't blame me its just that the Go programming language made coroutines all fancy again.
<script src="https://gist.github.com/taywils/5633146.js"> </script>

### Restful Call To Google Places API... This Is The Only Actual Code The Rest Is Bloat... 100% Serious
Our wonderful QueryGooglePlaces async task must make a HTTP GET request to Google and return some XML. Sounds simple enough but remember that we need to handle possible 
thrown exceptions and properly turn the HTTP response from an array of bytes only meant to be understood by your processor to a nice String object meant for human consumption. I took time to think of useful variable names so when reading pay attention to the obvious names such as httpclient and or responseString; they indicate what they were created to contain. Other than that the background task part of the QueryGooglePlaces class makes sure to close HttpResponse object if the status code is not HTTP:200.<script src="https://gist.github.com/taywils/5633162.js"> </script> Ok I have to admit, the onPostExecute method here could be simplified a great deal using because all its doing is going through each XML element and taking only the values we need to full in the data members of an instance of a Place class. In short, we got the XML from Google so for each restuarant returned lets create a Place object and fill in its data. I didn't use any external XML jars such as the famous JAXB(Jackson XML Binding) which any sane Java developer would do but its only because I didn't know about Jackson until I did some more research into parsing XML with Android. Enough with my personal issues and back to article; the for loop which traverses the XML file is the primary focus.

XML files and constructed of elements which contain tags, attributes and values. As such we look for a node element and check for all of the attributes which correspond to the data members of the Place object based on tag name alone. Once all of the place nodes have been parsed the view or what you see on your Android device is only updated PlaceAdapter has taken our collection of places and inflated a layout file with each of the place object's data members. We'll go onto the code for the Place class before showing how the PlaceAdapater was designed. 
<script src="https://gist.github.com/taywils/5633166.js"> </script>

### The Place Class
About 98% of the code in the place class was auto-generated, I wrote the lovely comments.
Now if only IntelliJ could just build Apps... wait then I would need to find a new occupation.
<script src="https://gist.github.com/taywils/5633170.js"> </script>

### ArrayAdapters, Are Not Fun But You Should Learn To Use Them Regardless
ArrayAdapters in my opinion are the glue objects that bind views together with a Java class. For instance in this app we are trying to display a list of for the user to look at and scroll through. We managed to build a HTTP GET request, parse the returned XML and store it within a collection of Place objects so now comes the time to let the layout know that we are ready to display the list of places. In fact we are actually alerting two different layouts(the httptestrow and the httptestlist) of our intentions. Remember from the QueryGooglePlaces AsyncTask where we had a line of code that created a new PlaceAdapter. Go look at that line again and see how we passed both the layout resource and the collection of places as an array. Next before you glance over the code for the PlaceAdapter take a look at the XML layout file for the httptestrow. It contains TextView tags for both name and vicinity. Since name and vicinity are both data memebers of our Place class you can guess that the PlaceAdapter will generate a listing of all our Places by both name and distance from the app user.

The meat of any class extending ArrayAdapter is the getView override. What you have to do within the getView override is create a LayoutInflater object and bind its layout resource to a row object. Then for each row, we treat it just as we would any view resource and use the good ole findViewById to select only the parts of the layout we're actrually interested in so we can populate them with some data. It sounds nice until you realize that the getView method returns the row and you have to do strange ritual code such as checking for null rows else the entire view explodes in your face. Its not that I hate ArrayAdapters but I would much rather have the Android API introduce finer tuned XML tags that represent data bindings directly to classes but then I thought to myself that such a thing would be possible only if Android used a templating engine such as Apache Velocity instead of just using vanilla XML for layouts. Ok ok.... Scala for Android(The Scaloid Project) solves this by using a custom DSL instead of vanilla XML... why the heck has Google not hired the project lead for Scaloid yet?
<script src="https://gist.github.com/taywils/5633177.js"> </script>

### Implementing The LocationListener Interface
Aside from the complexities of writing methods for classes that extend from ArrayAdapters, implementing the LocationListener interface is much less headache 
For the simplicity of this demonstration code we're only going to handle the event when the physical location of the user has changed.
<script src="https://gist.github.com/taywils/5633181.js"> </script>

### Remember When We Needed To Load The Location Data In A Thread?
Here is the class that implements the Runnable interface to be ran on a thread.
<script src="https://gist.github.com/taywils/5633183.js"> </script>

### A Class To Figure Out MyLocation 
The MyLocation class was wonderfully designed by a fellow who provided it as an answer to a stackoverflow.com question.
I've modified it slightly to fit the needs of this application but for the most part it remains the same. See the stackoverflow link to learn more about the class itself.
<script src="https://gist.github.com/taywils/5633195.js"> </script>

### Layout Files
Listed below are the layout files you'll need, just be sure to place them within the correct folder of your Android project directory.
<script src="https://gist.github.com/taywils/5633207.js"> </script>
<script src="https://gist.github.com/taywils/5633216.js"> </script>

### Summary
We've covered quite a bit of intermediate Android development topics with the useage of AsyncTask and LocationListener interfaces. There is always much more to learn about Android development and as you can probably tell Google will continue to make working with the API
much easier in the future so we can rely upon less confusing base classes such as ArrayAdapters(did I tell you how much I find these things overly complex) and focus more on creating wonderful experiences to delight our users. I might continue to write some more Android articles if I buy a Kindle Fire HD  but I've been tempted to start learning iOS development. However, if Scala gains more popularity Android development could become rather interesting  when you consider all the benefits of using Scala.

Anyways, write comments, ask questions and enjoy your Google places API demo.

### Java class file dumps
The HttpTestActivity.java file.
<script src="https://gist.github.com/taywils/5689259.js"> </script>

The MyLocation.java file.
<script src="https://gist.github.com/taywils/5689262.js"> </script>
