---
layout: post
title: Java Spark Framework Tutorial
mydate: Nov 05 2013
tags: [java]
catagories: [web, mvc, tutorial]
comments: true 
description: Some friends and I want build a large project in Java beginning early next year so in the meantime we all need to brush up on web development with Java. Although I've used Spring(which is awesome by the way) I wanted to explore some alternatives for building some lightweight MVC apps that can be rapidly developed without having to worry about the overhead of learning the Spring framework in depth. Thus I discovered Spark; a micro framework for Java.
---
## Java Spark Framework Tutorial

<div class="post-content" markdown="1">
## Setting up Java for web development

### Before you begin download and install Git

- [Download and install git](http://git-scm.com/)

- The main GitRepo for this tutorial is [https://github.com/taywils/java_spark_tutorial](https://github.com/taywils/java_spark_tutorial)

- So create a new directory on your machine, then change directory into it and run the following code

<div align="center">
```git clone https://github.com/taywils/java_spark_tutorial.git``` 
</div>

### Downloading the JRE and JDK

- Check to see if you already have Java 7 installed on your machine by opening either terminal or command prompt and typing **java --version**

<div align="center">
<a href="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_version_snap.png"><img src="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_version_snap.png" alt="java version"/></a>
</div>

<blockquote class="quote">
If you see a similiar result then you can skip this section and go to "Configuring your IDE" since you already have a working Java runtime.
</blockquote>

- Go to Java downloads page and follow the instructions [click here to dowload Java](https://java.com/en/download/index.jsp)

- If you're still having trouble try adding the Java install directory to your environment HOME path or just Google how to install Java 7

### Configuring your IDE
As for the choice of IDE, we have quite a few but I prefer to use IntelliJ IDEA by JetBrains. It supports Java and many other programming languages and it has superb documentation and a large community of developers who write amazing plugins.

- [Download the community edition of IntelliJ for free](http://www.jetbrains.com/idea/free_java_ide.html)

- If you plan on using Java professionally or are just frustrated by the lack of features on the community edition then you can purchase the professional edition as well.

- Otherwise there is always [Eclipse](http://www.eclipse.org/) and [NetBeans](https://netbeans.org/)

### Get Hello World running and configure Maven
Assuming you chose to install the community edition of IntelliJ IDEA we'll get Hello World running just to make sure you have your Java Runtime and SDK setup correctly.

- Open IntelliJ

- From the main menu click the "Configure" icon, we are going to check to see if we have "Maven" configured as it will be used later.

<div align="center">
<a href="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_spark_intellij_create_new_project.png"><img src="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_spark_intellij_create_new_project.png" alt="create project"/></a>
</div>

- On the configure screen click "Plugins"

<div align="center">
<a href="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_spark_intellij_configure_menu.png"><img src="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_spark_intellij_configure_menu.png" alt="plugins"/></a>
</div>

- Verify that Maven is checked along with the Maven Integration Extension

<div align="center">
<a href="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_spark_intellij_configure_maven_checked.png"><img src="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_spark_intellij_configure_maven_checked.png" alt="maven checked"/></a>
</div>

### Install Maven onto your machine

- Open a web browser and [Download Apache Maven](http://maven.apache.org/download.cgi)

- If you're using a Mac I recommend using Homebrew ```brew install maven```

- Follow the instructions on how to test that you have it installed properly [Apache Maven in 5 Minutes](http://maven.apache.org/guides/getting-started/maven-in-five-minutes.html)

<blockquote class="quote">
Apache Maven is wonderfully complex and powerful tool used by Java developers for everything from build automation to project package installation and versioning to running your JUnit tests. For the most part we'll be using it as a package manager similar to Ruby gem, PHP composer and or C# NuGet.
</blockquote>

### Setup Maven for IntelliJ 

- So far so good, now go back to the IntelliJ home screen click "Create New Project"

- On create project screen you might see a bunch of options on the leftmost sidebar but the one we want to select is *Maven Module* under the "Java" heading

- IntelliJ will then create a new project for us alredy setup for using Maven to manage our external dependencies.

<div align="center">
<a href="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_spark_new_project_select.png"><img src="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_spark_new_project_select.png" alt="new maven project"/></a>
</div>

- Once the new project has been created I named mine "Sparkle" figure out how to open "Project Settings" for your project, you should see "Maven" from the list of Settings and your screen will resemble the images below.

- For Windows users you'll want to set your "M2 HOME" by adding the Maven install folder path to the system environment variables. You'll then not have to explicitly set a M2 Home from the settings screen

<div align="center">
<a href="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_spark_maven_settings_windows.png"><img src="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_spark_maven_settings_windows.png" alt="windows maven settings"/></a>
</div>

- For Linux users it will be some variation of /usr/share or whatever your distribution did with the Maven install but the below is my setup for Ubuntu 12 

<div align="center">
<a href="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_spark_maven_settings_linux.png"><img src="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_spark_maven_settings_linux.png" alt="linux maven settings"/></a>
</div>

- On Mac OSX it will probably be very similar to Linux

<blockquote class="quote">
Do not think for one second that just because IntelliJ can manage your Maven that you shouldn't learn how to use the Maven command line interface.
The Maven cli is pretty robust and is what your IDE calls in the background anyways so don't be lazy... actually I take that back... be lazy
</blockquote>

### Hello World...
<div align="center">
``` git checkout hello_step_1 ```
</div>

- Now that we've setup Maven we're just going to create a quick hello world program. From the Project sidebar click src -> main and then right click the "java" folder

- Create a new class file and name it "HelloSpark"

- Now enter the code

<script src="https://gist.github.com/taywils/7332503.js"> </script>

- Next from the top toolbar click Build -> Make Project

- Then right next to Build on the toolbar click Run -> Run 'Hello Spark'

- If you don't get something like shown in the image below then you probably misconfigured your Java or IntelliJ settings. Please seek advanced troubleshooting on StackOverflow or the IntelliJ documentation.

<div align="center">
<a href="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_spark_hellospark_hello_world.png"><img src="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_spark_hellospark_hello_world.png" alt="Hello World"/></a>
</div>

## Running the Spark demo app

<div align="center">
``` git checkout spark_demo_step_1 ```
</div>

- Lets begin by modifying our Hello world class file to use the Spark framework so we can get started with Java web development

<div align="center">
<a href="http://www.sparkjava.com/index.html"><img src="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_spark_logo.png" alt="Spark A Java MVC micro framework"/></a>
</div>

- Maven allows us to include external dependencies within our projects via the _pom.xml_ file. So open up the _pom.xml_ file and add the dependency for Spark.

<script src="https://gist.github.com/taywils/7366389.js"> </script>

- From Intellij when you make a change to a Maven pom.xml file you can set it to "enable auto-import" so it refreshes your Maven dependencies when you update your pom.xml

<div align="center">
``` git checkout spark_demo_step_2 ```
</div>

- Next open up HelloSpark.java and remove all the existing code... replace it with the snippet below

<script src="https://gist.github.com/taywils/7366522.js"> </script>

<blockquote class="quote">
Just in case you were curious you'll note that the Spark documentation uses "import static" so [here is a brief explaination of import static](http://stackoverflow.com/questions/162187/what-does-the-static-modifier-after-import-mean). In short you can uses a class' static methods without explicitly typing the classname; beware of its pitfalls though.
</blockquote>

- Now from within IntelliJ click Run -> "run 'HelloSpark' from the top menu, the code will startup and then it will let you know that Spark is currently running on some port most likely localhost:4567

- Launch a new web browser window and goto [http://localhost:4567/hello](http://localhost:4567/hello)

- Congrats!!! You are now a super web developer!

<blockquote class="quote">
So how does that work? Like many MVC applications Spark provides us a basic router to let our app respond to HTTP requests. Of the four most commonly used are GET PUT POST DELETE. Those four HTTP request types when used in conjunction with the HTTP Header(s) for the request such as Content-type: application/json and or application/x-www-form-urlencoded allow us to capture and handle all sorts of browser request. For a good [introduction to HTTP and REST see the article on net.tutsplus](http://net.tutsplus.com/tutorials/other/a-beginners-introduction-to-http-and-rest/)
</blockquote>

- For some more fun play around with some of the basic features you can do with Route such as capturing user supplied parameters and or adding new routes

<div align="center">
``` git checkout spark_demo_step_3 ```
</div>

<script src="https://gist.github.com/taywils/7366801.js"> </script>

- Next lets introduce the POST request. We're going to use POST to store some data and then display it as a list. This example is very crude and will help us segway into mini blog tutorial further on in the article.

<div align="center">
``` git checkout spark_demo_step_4 ```
</div>

- In the snippet of code below we use a POST request on the route _/add/:item_ to add things to our list and then use GET on the route _/list_ to display them

<script src="https://gist.github.com/taywils/7367126.js"> </script>

- So update your HelloSpark.java file, press build and then run the code. Launch your web browser and goto [http://localhost:4567/list](http://localhost:4567/list)

- You should be greeted by our message "Try adding some things to your list"

- Now you might be tempted to try navigating to [http://localhost:4567/add/bananas](http://localhost:4567/add/bananas) or something 

<blockquote class="quote">
__BUT THAT WON'T WORK AT ALL!__
</blockquote>

- When we visit urls from our web browser we by default use the GET request so http://www.google.com calls the GET request on some google webserver somewhere.

<blockquote class="quote">
If you're puzzled as to why you hit a 404 page when we clearly defined a POST route to /add/ you've just discovered that our application will only route POST request to a post handler method. To fix this we should actually send a HTTP POST request instead of using GET.
</blockquote>

- To send a POST request open a terminal window and use _curl_ or if you're on a windows machine use PowerShell _yes I said PowerShell please stop using command prompt_

<div align="center">
<p>
``` curl -X POST http://localhost:4567/add/apples ```
</p>
<p>
``` Invoke-RestMethod -Uri "http://localhost:4567/add/apples" -Method POST ```
</p>
</div>

- Try making a few POST request and thing go back to [http://localhost:4567/list](http://localhost:4567/list) and be amazed

- Congrats!!! You are now a web developer ex-plus &alpha;

## CRUD Example: A Blog

<blockquote class="quote">
Within this section we'll be creating a basic blog application that will eventually grow more complex as we add more features. Its important to start off slow so the first iteration of the blog will be very concise and perform just the bare minium in order to function. Being a CRUD app each aspect of CRUD will be explored.
</blockquote>

### __C__reate

- Return to your HelloSpark.java code and delete everything making sure you're starting off with a clean slate

<div align="center">
``` git checkout spark_blog_step_1 ```
</div>

- We'll begin by importing all of the necessary files which include the spark library and the two java.util classes

- As a blog our objective is to Create, Read, Update and Delete new articles which are just bodies of text which we'll also assign a unique identification number and a timestamp of the date when we created the article.

<script src="https://gist.github.com/taywils/7382438.js"> </script>

- When a user hits the root index of the blog we should show the list of articles written ordered by their date of creation else a message that indicates no articles have yet been added. To accomplish this we'll add a conditional statment and create a *StringBuilder* object to render some HTML

<script src="https://gist.github.com/taywils/7382471.js"> </script>

## Some other persistence options

*Comming Soon...*

### Relational Storage

*Comming Soon...*

### NoSQL

*Comming Soon...*

### Redis

*Comming Soon...*

## Homework: Create a checklist application

### Solution 

*Comming Soon...*
</div>
