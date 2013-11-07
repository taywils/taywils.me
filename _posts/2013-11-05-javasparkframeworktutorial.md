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

- Lets begin by modifying our Hello world class file to use the Spark framework so we can get started with Java web development

<div align="center">
<a href="http://www.sparkjava.com/index.html"><img src="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_spark_logo.png" alt="Spark A Java MVC micro framework"/></a>
</div>

### Spice it up with some JSON

## Some Persistence Options

### Relational Storage

### NoSQL

### Redis

## Spark CRUD Example

## Homework: Create a checklist application

### Solution *Comming Soon...*
</div>
