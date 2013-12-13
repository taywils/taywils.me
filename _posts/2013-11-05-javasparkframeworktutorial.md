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
```git clone https://github.com/taywils/java_spark_tutorial.git .``` 
</div>

- In order to follow along with each step of the tutorial we'll want to be able to pull down remote git branches into our local repo

<div align="center">
```git fetch origin```
</div>

- Run the following git command in order to list all remote branches or just browse the Java spark tutorial repo on Github [https://github.com/taywils/java_spark_tutorial](https://github.com/taywils/java_spark_tutorial)

<div align="center">
```git branch -a```
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
``` git checkout -b hello_step_1 origin/hello_step_1 ```
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
``` git checkout -b spark_demo_step_1 origin/spark_demo_step_1```
</div>

- Lets begin by modifying our Hello world class file to use the Spark framework so we can get started with Java web development

<div align="center">
<a href="http://www.sparkjava.com/index.html"><img src="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_spark_logo.png" alt="Spark A Java MVC micro framework"/></a>
</div>

- Maven allows us to include external dependencies within our projects via the _pom.xml_ file. So open up the _pom.xml_ file and add the dependency for Spark.

<script src="https://gist.github.com/taywils/7366389.js"> </script>

- From Intellij when you make a change to a Maven pom.xml file you can set it to "enable auto-import" so it refreshes your Maven dependencies when you update your pom.xml

<div align="center">
``` git checkout -b spark_demo_step_2 origin/spark_demo_step_2```
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
``` git checkout -b spark_demo_step_3 origin/spark_demo_step_3 ```
</div>

<script src="https://gist.github.com/taywils/7366801.js"> </script>

- Next lets introduce the POST request. We're going to use POST to store some data and then display it as a list. This example is very crude and will help us segway into mini blog tutorial further on in the article.

<div align="center">
``` git checkout -b spark_demo_step_4 origin/spark_demo_step_4 ```
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

- Before we start our blog application will need an object representation of an Article. Our article will have title, summary and content for now. Article.java is just plain old Java so there really isn't much to get excited about; the MVC web stuff will follow.

- Within the same package as _HelloSpark.java_ create the file _Article.java_

<div align="center">
<a href="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_spark_blog_project_display.png"><img src="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_spark_blog_project_display.png" alt="Project structure with Article.java"/></a>
</div>

<script src="https://gist.github.com/taywils/7393394.js"> </script>

### Create

- Return to your HelloSpark.java code and delete everything making sure you're starting off with a clean slate

<div align="center">
``` git checkout -b spark_blog_step_1 origin/spark_blog_step_1 ```
</div>

- We'll begin by importing all of the necessary files which include the spark library and the two java.util classes

- As a blog our objective is to Create, Read, Update and Delete new articles which are just bodies of text which we'll also assign a unique identification number and a timestamp of the date when we created the article.

<script src="https://gist.github.com/taywils/7382438.js"> </script>

- When a user hits the root index of the blog we should show the list of articles written ordered by their date of creation else a message that indicates no articles have yet been added. To accomplish this we'll add a conditional statment and create a *StringBuilder* object to render some HTML

<script src="https://gist.github.com/taywils/7382471.js"> </script>

- In order to publish articles we need a way to create them and submit the information to our server side code. Add another GET method which will handle requests made to /article/create

- On the page is a form which accepts a new title, summary and content for the new blog article

<script src="https://gist.github.com/taywils/7393074.js"> </script>

- Right now you may restart the Spark app and note that by clicking the "Write Article" link you are sent over to the form we created...

- However when you click the "Publish" button nothing happens; in order to fix that we need write a method to handle the POST request called from /article/create

- We'll want to persist the article to our storage on the server side code by capturing the form elements _article-title_, _article-summary_ and _article-content_

<script src="https://gist.github.com/taywils/7393125.js"> </script>

### Read

<div align="center">
``` git checkout -b spark_blog_step_2 origin/spark_blog_step_2 ```
</div>

<blockquote class="quote">
The next part of CRUD is actually the easist since it doesn't actually involve modifying data. To do so we'll use the read article link associated with every Article object and use the unique id number of the article to pull its information from our storage when the user requests a GET /article/read/:id from our server
</blockquote>

- To read an article is very simple, just use a for loop until we find the ID of the article. Of course using a straight up iterative search is horrific for very large numbers of articles but we'll look at alternative data persistance later on in this post.

<script src="https://gist.github.com/taywils/7394124.js"> </script>

### Update

<div align="center">
``` git checkout -b spark_blog_step_3 origin/spark_blog_step_3 ```
</div>

- When updating an existing article all we need to do is possibly overwrite the found content, so add a new Route for /article/update/:id 

- The code behind the /article/update/:id will use the same form as the /article/create except the form fields will be pre-populated

<script src="https://gist.github.com/taywils/7403433.js"> </script>

- Now all that is left is to add the POST handler for our update form

<script src="https://gist.github.com/taywils/7403558.js"> </script>

### Delete

<div align="center">
``` git checkout -b spark_blog_step_4 origin/spark_blog_step_4 ```
</div>

<blockquote class="quote">
Along with Read Delete is another rather simple action since it only requires a single method along with a redirect
However if you recall back to when we created the Article Model, we had a boolean value called _deleted_. In this sense any deleted articles are basically marked as deleted and not shown to the UI. Later on when we explore different types of persistence we'll actually delete articles for good but for now this will have to suffice.
</blockquote>

- Within your HelloSpark.java file add the method to handle the delete action /article/delete/:id

<script src="https://gist.github.com/taywils/7404207.js"> </script>

- Lastly we need to go back and edit our Blog homepage to hide deleted articles

<script src="https://gist.github.com/taywils/7404222.js"> </script>

- Congrats!!! You are now a super web developer II turbo

## Putting the V in MVC

<div align="center">
<a href="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_spark_blog_bootstrap.PNG"><img src="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/java_spark_tutorial/java_spark_blog_bootstrap.PNG" alt="blog bootstrap3"/></a>
</div>

<blockquote class="quote">
Recall how in the previous code all of our views or HTML code was simply shoved into our controller routes... this won't work in actual practice and is in fact not a very sane way to structure code. Thus we'll soon work out a method to deal with the fact that our core logic should be separated from what our clients view. This idea is what brings us to the VIEW portion of Model View Controller.
</blockquote>

- In this section we will be using a very powerful Java templating engine called _Freemarker_ which will allow us to separate our Controller logic from our View layer

- Lucky for us the author of the Spark framework has already created a library _spark-template-freemarker_ which provides an interface to using the Freemarker template engine. So open up your pom.xml file and add the following dependency.

<script src="https://gist.github.com/taywils/7461578.js"> </script> 

<blockquote class="quote">
However before we start demonstrating the power of a well made html templating engine its important to not let your templated HTML get out of hand; to the point where your templated HTML substitues for your entire application. A famous blog post titled [Your templating engine sucks and everything you have ever written is spaghetti code](http://www.workingsoftware.com.au/page/Your_templating_engine_sucks_and_everything_you_have_ever_written_is_spaghetti_code_yes_you) takes a critical look at how easy it is to completely and utterly abuse the living crap out of your code by overusing template engines until all of your code basically becomes PHP4... and lets not go back to those days. For the TL;DR the author basically says to avoid heavy use of conditionals and or functions/macros within your templated HTML; think of it as when developing a Java application and how you [rarely ever want to manually invoke the garbage collector.](http://stackoverflow.com/questions/66540/system-gc-in-java)
</blockquote>

- Lets keep moving... for now we'll add a test Route to our application before we go back and refactor the blog code to remove the messy string injected html.

<div align="center">
``` git checkout -b spark_view_step_1 origin/spark_view_step_1 ```
</div>

- In the code below we create a HashMap which will map our Java objects to variables which can be called directly from our View templated HTML files

- The HashMap elements _blogTitle_, _descriptionTitle_, and the two _descriptionBody_ will be reffered to within our freemarker templates and appear exactly as they do within the HelloSpark.java file.

<script src="https://gist.github.com/taywils/7462642.js"> </script>

- Next within your IntelliJ project directory create the folder structure beginning with the _resources_ directory resources/spark/template/freemarker

- Once that is done right click on the newly created directory adn add the file "layout.ftl" the naming here is important since we will be discussing a common pattern in MVC which is to split your Views between layouts and templates. 

<blockquote class="quote">
Layouts are like view container which hold multiple templates. Take my blog for example; it uses a layout which holds the top navigation bar and the disqus comments in the footer and swaps out article templates for each of my blog posts. Intelligent use of templates and layouts means that we can inject different views to our clients depening on the data sent to the view from the controller.
</blockquote>

- *This is not a tutorial on HTML and CSS so for now lets just assume the HTML code is correct.*

- Anyhow the code below is for the file _layout.ftl_ notice where we inject the Java variables we sent to the view using the ``` ${some_variable_name_here} ``` syntax. Don't forget to checkout the documentation for Freemarker or Google for some Freemarker tutorials if you are confused.

<script src="https://gist.github.com/taywils/7462774.js"> </script>

- By the way... don't forget to experiment with Freemarker. Try passing serveral variable to the ftl file and get the hang of templating; its a popular technique that is used in many different programming languages [including the Javascript Framework AngularJS](http://docs.angularjs.org/guide/templates)

### View templates and layouts

<div align="center">
``` git checkout -b spark_view_step_2 origin/spark_view_step_2 ```
</div>

- Given the new Bootstrap 3 powered homepage we just completed, lets now go back and refactor our old code to move the HTML injected strings out of our Controllers and into proper HTML files.

- Create a new file called *articleList.ftl* or just edit the existing one and place it within the directory sparkle/src/main/resources/spark/template/freemarker/articleList.ftl

- Now open up HelloSpark.java and GET method for the "/" url and change it to use the FreeMarkerRoute instead of the regular route. For our refactor we're going to create a HashMap to store the Java Objects we wish to pass onto the view articleList.ftl file.

<blockquote class="quote">
Finnally no more creating String objects to hold our HTML!
</blockquote>

<script src="https://gist.github.com/taywils/7480416.js"> </script>

- With our Controller updated to use the layout.ftl file we now need to update our layout.ftl with the new values provided by the viewObject HashMap

- Layouts allow use to embed child HTML pages within them so pay attention to the code where we inject a template called articleList.ftl via the "include" Freemarker tag. This allows us to separate our head and navigation links from our article View markup.

<script src="https://gist.github.com/taywils/7480455.js"> </script>

- Finnally we'll create another Freemaker template file within the same directory as the layout.ftl called "articleList.ftl"

<blockquote class="quote">
Look at the code snippet for the articleList.ftl file. Pay special attention to how templating engines such as FreeMarker allow us to use conditional statements and loop over enumerable objects such as Arrays and HashMaps. However if you remember the article about why your templating engine sucks then you should agree that conditionals and loops are about all our templating engine should be responsible for... more complex logic should stay server-side within the respective Controller.
</blockquote>

<script src="https://gist.github.com/taywils/7480504.js"> </script>

<div align="center">
``` git checkout -b spark_view_step_3 origin/spark_view_step_3 ```
</div>

- Next we're going to redo the write article form, so open up HelloSpark.java and edit the route /article/create 

<script src="https://gist.github.com/taywils/7668728.js"> </script>

- Notice how simple our form view code became within the controller code because all of our view specific code will now be placed within an actual HTML file instead of nasty string appened spaghetti code

- Create the freemarker template file called *articleForm.ftl*

<script src="https://gist.github.com/taywils/7668761.js"> </script>

<div align="center">
``` git checkout -b spark_view_step_4 origin/spark_view_step_4 ```
</div>

- Lastly we need to update the views for editing and reading articles, so open up HelloSpark.java and change the following routes within your controller code until it matches.

<script src="https://gist.github.com/taywils/7670579.js"> </script>

- First we're going to add a new freemarker template file called *articleRead.ftl*

<script src="https://gist.github.com/taywils/7670586.js"> </script>

- Lastly we need to re-use our existing *articleForm.ftl* but when the user chooses to update an article we need to populate the form with the article content to be edited

- This can be accomplished by using Freemarker conditionals to check for an existing article and if found then place its attritbutes within the form fields

<script src="https://gist.github.com/taywils/7670599.js"> </script>

- Congrats!!! You are now a super web developer IV 3D Edition 

## Some other persistence options

In this section we're going to explore different ways for storing our application data other than stricly within the memory of our java servlet. Being a more pragmatic developer I've chosen to stick with three of the more popular database models (Relational, Document Store and Key-value) for educational purposes.

- [db-engines.com definition of Relational Model](http://db-engines.com/en/article/Relational+DBMS?ref=RDBMS)

- [db-engines.com definition of Document Store Model](http://db-engines.com/en/article/Document+Stores)

- [db-engines.com definition of Key-value Store Model](http://db-engines.com/en/article/Key-value+Stores)

While your at be sure to at least learn a bit about alternative Database Models such as __wide-column stores__, __search optimized databases__, __graph databases__ and lesser known db models such as __content stores__

### Relational Storage via Postgres

There has always been that lingering question in the open-source community about the pros and cons of MySQL vs Postgres(or PostgreSQL but I prefer it by the street name) but over the years Postgres has finnally caught up in terms of features and performance (probably due to Heroku and AWS but thats another topic). As for myself I've never used Postgres before due to all of my professional work using MySQL on a LAMP stack but its always fun to learn new things.

[An article on the rise of Postgres](http://readwrite.com/2013/09/10/postresql-hits-93-new-levels-of-popularity-with-the-cool-kids)

### Getting started with PostgreSQL

- Ok lets start, go to [http://www.postgresql.org/download/](http://www.postgresql.org/download/)

- I'm using Ubuntu Linux but choose whatever platform you need; follow the instructions and continue reading this article when you have Postgres installed.

<div align="center">
``` sudo apt-get install postgresql ```
</div>

- Lets verify that the postgres installer worked type into your console

<div align="center">
``` which psql ```
</div>

- In order to start the postgres command line interface use the command

<div align="center">
``` psql ```
</div>

<blockquote class="quote">
If you encounter the error message __psql: FATAL:  role "$USER" does not exist__ then you probably need to run postgresql as the postgre admin; To do that just run the following command.
</blockquote>

<div align="center">
``` sudo -u postgres psql ```
</div>

- You should get familiar with the postgres command line interface(cli) before continuing; it differs a bit from other database systems in that many admin features are separate terminal commands which are ran from outside the cli

<div align="center">
``` git checkout -b spark_storage_step_1 origin/spark_storage_step_1 ```
</div>

- In order for us to begin using Postgres update our *pom.xml* file and add a new dependency.

- From the command line run the following to create the database which we'll be using

<div align="center">
``` sudo -u postgres createdb sparkledb ```
</div>

- The first thing we'll want to do is build a service class to interact with each of our database types, within your project's java directory create the file *ArticleDbService.java*

<script src="https://gist.github.com/taywils/7866235.js"> </script>

### A Short Intermission: Refactoring The Servlet In-Memory Storage Into A Data Access Object Class

- The ArticleDbService.java file we just created serves as the interface to the persistence storages we will implement; we are currently setup to use a java ArrayList for our storage this will be moved into a new file.

- Create the file *ArticleServletDao.java*

<script src="https://gist.github.com/taywils/7866271.js"> </script>

- The *ArticleServletDao* implements the ArticleDbService methods and as such will allow use to swap it out as the current implmentation for the ArticleDbService object within our Blog application.

- Now lets go back and refactor the *HelloSpark.java* to use the ArticleDbService. The changes are mentioned within the comments so read them so you understand; notice how much simpler our Route methods have become since we moved the DataAccess logic to its own service(s).

<script src="https://gist.github.com/taywils/7866367.js"> </script>

### Building a PostgreSQL DAO for our Blog

<div align="center">
``` git checkout -b spark_storage_step_2 origin/spark_storage_step_2 ```
</div>

- Before we can connect to the database from the Java class we created we need to set a password for the postgres user.

<div align="center">
``` sudo -u postgres psql ```
</div>

- Then from the psql command line interface set the password, to keep the example simple lets use the same name as the password(that way the Java code won't fail to connect)

<div align="center">
``` alter user postgres password 'postgres'; ```
</div>

- Our Data Access Object(DAO) class for Postgres should be created as a new file named *ArticlePostgresDao.java*

- The ArticlePostgreDao SQL code is pretty straight forward as far as the SQL goes since the queries are fairly basic(there are no complex JOINs and or temp tables) so I've left some helpful comments throughout the file.

<script src="https://gist.github.com/taywils/7904757.js"> </script>

- One more quick refactor... add the following constructor to *Article.java* which is used by the ArticlePostgresDao.

<script src="https://gist.github.com/taywils/7904766.js"> </script>

- To use the ArticlePostgresDao just swap its name in place of the ArticleServletDao within the file *HelloSpark.java*. I hope you're starting the see the power of the infamous design pattern [program to interfaces, not implementations](http://stackoverflow.com/questions/2697783/). 

### Document Storage with MongoDB

<div align="center">
``` git checkout -b spark_storage_step_3 origin/spark_storage_step_3 ```
</div>

- Update your *pom.xml* to include the MongoDB Java Driver 

<script src="https://gist.github.com/taywils/7366389.js"> </script>

- The key aspect to using Document stores versus say a traditional relational DB is that we can (optionally)forego schema design and just store our data as freeform documents.

- Begin by [downloading and installing MongoDB](http://www.mongodb.org/downloads), it shouldn't be too much of a hassle. [If you get stuck read the manual](http://docs.mongodb.org/manual/)

- Now that we're done installing MongoDB create a new file within your src/main/java directory called *ArticleMongoDao.java*

<script src="https://gist.github.com/taywils/7952171.js"> </script>

- We're not even skimming the surface as to what MongoDB is fully capable of due to the simplicity of this application but I imagine you're starting to picture the flexibility one obtains by removing the constraint of a rigid schema from the underlying DAO.

## Homework: Create a checklist application

- Use the examples presented in the tutorial to write a Java web app using Spark to let a user create, read, update and delete daily tasks.

</div>
