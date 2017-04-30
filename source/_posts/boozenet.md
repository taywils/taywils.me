---
title: An Introductory Meteor Tutorial, Improving On The Leaderboard Sample App
date: 2012-03-26
categories: [tutorial]
tags: [javascript, nodejs]
banner: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/boozenet.JPG
thumbnail: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/boozenet.JPG
---
In this tutorial I'll discuss my experience developing and launching(and yes you'll see how easy it is to launch with Meteor) a realtime javascript application using the Meteor framework; with its built in MongoDB shell and strong client server architecture Meteor is a powerful framework that should become popular for developers wishing to build fast realtime web applications.

<!-- more -->
- <a href="https://github.com/taywils/Meteor_Tutorial_Code">Grab the code on GitHub</a>

To begin this tutorial the first thing you'll want to do is to install the Meteor framework for NodeJs. 

Due to the nature of the framework under going constant updates, I won't write down specifically how to install Meteor because I'll then be forced to update this tutorial whenever the installation procedure changes. 

However I don't see anything wrong with providing a link to the official Meteor documentation where you'll find the download and installation instructions readily prepared for you. <a href="http://docs.meteor.com/#quickstart">Meteor Installation Guide</a> Once you have Meteor installed on your system you're ready to go. If you're running a Linux variant or Mac OSX then then the installation guide should be sufficient however, Windows users might require extra steps. 

Worry not though because if all else fails for getting Meteor running on Windows I suggest you just download and install a free copy of <a href="http://www.ubuntu.com/">Ubuntu Linux</a> and get it running first and then return to this tutorial.

So now that you have Meteor up and running we're going to start off by downloading the sample application "Leaderboard". To do so go to the Meteor official documentation for the leaderboard sample app and follow the instructions <a href="http://www.meteor.com/examples/leaderboard">Meteor Leaderboard</a>. Once you have read through the instructions go ahead and give the sample application a test drive by changing into the directory of the application and entering "meteor" into you terminal window. 

Next the application should begin most likely on localhost:3000 which you can navigate to from your web browser of choice and view the application running live. 

Ok so far we have installed the Meteor framework; downloaded the sample app, ran the sample app and verified that we can navigate to the application from our browser and see it in action. 
Now we'll begin modifying the leaderboard so we can better understand the framework and take a gander into its design structure. 

From your terminal window open the directory where you placed the sample app; you should see three files leaderboard.css, leaderboard.html and leaderboard.js. 

Based on the file names you can easily tell that the first file we're going to edit is the leaderboard.html since its the file which connects both the css and javascript. 
Go ahead and open up leaderboard.html with your editor of choice.

The re-branded sample application i.e fork of the leaderboard app we're going to create is called Boozenet. Boozenet was the name of this application chosen the team I worked with during a previous Hackathon. 

Boozenet was an application developed for the sole purpose of allowing friends who drink together on nights out to keep track of not only the beer they drank but the total amount of calories. 
This application was developed during a mobile Health themed hackathon so the caloric intake was supposed to be the main feature of the app but the fact that it was realtime and ran on mobile as well as web based clients was the most impressive feature after all. 
Enough background, within leaderboard.html find the <head> and update its contents to appear as below.
```html
<head>
  <title>BoozeNet</title>
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
</head>
```
In addition Meteor also has a custom jquery plugin, from the documentation to use the jquery plugin navigate to the directory of this application and run the following command from the terminal "meteor add jquery".

So far we've updated the title of the application and included jquery... not much but its a good start. 
Moving onto the <body> tag you'll notice the unfamiliar (if you've never used an HTML templating framework before) set of double curly braces. 

What these represent are places where we'll substitute sections of HTML when the content is rendered on the browser once the templating javascript code scans over and updates the sections of the HTML marked with double curly braces when the application is ran. 
Despite the large number of HTML templating engines available (just Google for it and you'll see) the one pre-baked into the Meteor framework is a modern templating engine called Handlebars 

<a href="http://handlebarsjs.com/">Click here for the Handlebarsjs Homepage</a>. 

If you want you can read all about how Handlebarsjs does its magic by browsing the its homepage but for now we'll focus on applying it to extend the leaderboard sample application. 
```html
<body>
  <div id="outer">
  <table>
  <tr>
  <td><img src="beer_vector-200.png" /></td>
  <td>{{> game}}</td>
  </tr>
  </table>
  {{> gallery }}
  <div class="none" />
  {{> leaderboard}}
  </div>
</body>
```
First we're going to explain how the gallery template works; once that is established hopefully the double curly brace syntax won't appear so alien and you'll start reading it as just another HTML element. What the gallery does for our application is showcase the snapshots (in this contrived example they will be hyperlinks to images on the web) of various beers that users of our app have consumed. All this really means is that the gallery template is a placeholder for images to be dynamically inserted at when the page is rendered from image links stored within out database.

```html
<template name="gallery">
<div class="gallery">
{{#each photos}}
{{> photo}}
{{/each}}
</div>
</template>
```
As you can probably already guess the <template> tag will substitute itself where the double braced enclosed word "gallery" appears earlier in the code. 
If you thought it was going to be more complicated than that you were wrong, working with the handlebarsjs template engine is quite easy... although there are way more advanced features we won't need to get into to those at this level of a tutorial. 
The next template we're going to create is the photo template which is to be  placed within the gallery template we just established.

```html
<template name="photo">
<img width="100" height="100" src="{{url}}" />
</template>
```

For those of you with eagle eyes you might have caught that the the template argument url differs slightly from the all previous template arguments we have passed thus far.
What the url lack is the leading > just after the second left-curly brace. 
How the absence of the > affects the code will come into play later when you start writing the javascript code but for now just let it be. 
Next we'll need to template the leaderboard... its similar to the gallery but instead of photos wrapped within a each sub-template we'll have players displayed instead.

```html
<template name="leaderboard">
<div class="leaderboard">
{{#each players}}
{{> player}}
{{/each}}
</div>

{{#if selected_name}}
<div class="details">
<div class="name">Whats Up {{selected_name}}</div>
<input type="button" class="uploadImg" value="Add Photo" />
<input id=&#039;imgUrlText&#039; type=&#039;text&#039; size="80" name=&#039;imageUrl&#039; class=&#039;imageUrl&#039; />
</div>
{{/if}}

{{#unless selected_name}}
<div class="none">Click a player to select</div>
{{/unless}}
</template>
```
Since we have just defined where the players template is going to fit onto the leaderboard we now have to create a template for them as well.
```html
<template name="player">
<div class="player {{selected}}">
<span class="name">{{name}} | {{phone}}</span>
<span class="score">Calories {{score}}</span>
</div>
</template>
```
Another thing you might have noticed is that in the above code the double curly brace appears within the value of the class tag. 
Which means that you can even inject templates within css; pretty cool if I'd say so. 
Moving on notice how the template references whether or not the player has been selected. 
That will become important once we get to the javascript part of this application where we'll actually define the events which take place when those conditionals are satisfied. 
Lastly all we have to do now is define the game template, which is just where we have our input form for new players.
```html
<template name="game">
<div class="newGame">
  <input type="button" class="newGame" value="New Game" />
<br />
<form class="standard_form">
  <label>Enter Phone#:</label><input id=&#039;phoneText&#039; type=&#039;text&#039; name=&#039;phoneNumber&#039; class=&#039;phoneNumber&#039; />
  <label>Enter Name:</label><input id=&#039;nameText&#039; type=&#039;text&#039; name=&#039;newName&#039; class=&#039;newName&#039; />
  <div class="submit_links">
  <input type="button" class="addDrinker" value="Join" />
  </div>
</form>

</div>
</template>
```
Now we are done with leaderboard.html.

Below is the CSS for leaderboard.css there isn't much to the CSS so just read through it if you want. 
Besides that you might just want to flat out replace your leaderboard.css instead of making additions to the file like we did for the html page. 
```css
body {
  font-family: 'Helvetica Neue', Helvetica, Arial, san-serif;
  font-weight: 200;
margin: 50px 0;
padding: 0;
         -webkit-user-select: none;
         -khtml-user-select: none;
         -moz-user-select: none;
         -o-user-select: none;
         user-select: none;
}

#outer {
width: 700px;
margin: 0 auto;    
}

.player {
padding: 5px;
}

.player .name {
display: inline-block;
width: 300px;
       font-size: 1.75em;
}

.player .score {
display: inline-block;
width: 100px;
       text-align: right;
       font-size: 2em;
       font-weight: bold;
color: #777;
}

.player.selected {
  background-color: yellow;
display: inline-block;
}

.player.selected .score {
color: black;
}

.details, .none {
  font-weight: bold;
  font-size: 2em;
  border-style: dashed none none none;
  border-color: #ccc;
  border-width: 4px;
margin: 50px 10px;
padding: 10px 0px;
}

.none {
color: #777;
}

input {
  border-color: #006699;
  border-style: solid;
  border-width: 1px;
color: #006699;
}

.standard_form {
width: 400px;
margin: 0px;
padding: 0px;
}

.standard_form label {
float: left;
width: 190px;
clear: both;
height: 20px;
}

.standard_form input {
float: right;
width: 200px;
height: 20px;
}

.submit_links {
clear: both;
}

.submit_links input {
float: right;
width: auto;
}

.leaderboard .player {
width: 610px;
clear: both;
}

.leaderboard .player .name {
width: 300px;
float: left;
}

.leaderboard .player .score {
width: 300px;
float: right;
}
```
For the final addition and where we get to see the true face of Meteor is within the javascript file.
So open leaderboard.js and we'll begin by taking apart the javascript section by section to make sure we understand what each part does and where we'll make additions to the sample code provided. 

```javascript
Players = new Meteor.Collection("players");
Photos = new Meteor.Collection("photos");
```

The first part is the addition of the Photos MongoDB Collection in addition to the regular Players Collection.
Thats simple enough but the interesting part we see next is how the each of the templates we coded in the HTML connects somehow to a Collection on the MongoDB.
One of the things I appreciate the most about the Meteor framework is how well they managed to make the connections between HTML templates and MongoDB collections crystal clear.
In particular pay attention to the conditional on the first line where we check whether the interaction is from the client.
This will become important later on where we describe what happens when the interation is on the server side.
Which is another cool thing about Meteor that you often don't see in a lot of other frameworks, clean separation between client and server object modeling. 
Often as I've seen before what happens is that the server side code is visibly connected to the database while its up to the developer to string together some sort of process for pushing the data to the client facing side.
```javascript
if (Meteor.is_client) {
  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  };

  Template.gallery.photos = function () {
    return Photos.find({});
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.phone && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };
```
Next fill in the various html events which are triggered based on client input on the page where the app is displayed. 
The first event we'll code describes what happens when a user clicks the Image Upload button.
```javascript
    Template.leaderboard.events = {
      'click input.uploadImg': function() {
        var imgUrl = "";
        imgUrl = $('#imgUrlText').val();
        var imgSrc = imgUrl;

        if( imgUrl != "" ) {
          var player = Players.findOne(Session.get("selected_player"));
          Players.update(Session.get("selected_player"), {$inc: {score: 343}});
          Photos.insert({url: imgSrc, phone: player.phone });
        }
      }
    };
```
The code is pretty self explainatory but in short, we pull the image url, we take the selected player, increment her score and then insert the photo into our DB.
Then we handle what happens when a playername is clicked... it just sets the selected player.
```javascript
    Template.player.events = {
      'click': function () {
        Session.set("selected_player", this._id);
      }
    };
```
Finnally for the game template itself we need to handle two events, one in which a new player is added and the second when a new game is created.

The events for any template as you can tell by now is just a javascript Object so we can separate object member by a comma using a string as the key and function as the value.
```javascript
    Template.game.events = {
      'click input.newGame': function () {
        Players.remove({});
        Photos.remove({});
      },

      'click input.addDrinker': function () {
        var newScore = 0;
        var newName = null;
        var newPhoneNumber = null;

        newPhoneNumber = $('#phoneText').val();
        newName = $('#nameText').val();

        if( $.trim(newName) != "" && $.trim(newPhoneNumber) != "" ) {
          Players.insert({ name: newName, phone: newPhoneNumber, score: newScore });
        }
      }
    };
```
For the final part of the javascript we need to define how the Meteor server gets the data from the DB when the game is started which will then allow the client code to we coded above to behave properly.
```javascript
    if (Meteor.is_server) {
      Meteor.startup(function () {
          if (Players.find().count() === 0) {
            var names = [
            "Click New Game",
            ];

            for (var i = 0; i < names.length; i++) {
              Players.insert({name: names[i], phone: "", score: 0});
            }
          }

          if( Photos.find().count() === 0) {
            var pics = [
            "http://upload.wikimedia.org/wikipedia/commons/e/e5/Pale_Ale.jpg",
            "http://upload.wikimedia.org/wikipedia/commons/3/3e/Weizenbier.jpg",
            "http://upload.wikimedia.org/wikipedia/commons/9/99/Glass_of_K%C3%B6stritzer_Schwarzbier.jpg"
            ];

            for (var i = 0; i < pics.length; i++) {
            Photos.insert({url: pics[i], phone: ""});
            }
          }
      });
    }
```
The last thing you need to do in order to get the full code working together is to visit the github page for this code as this tutorial written here is more of in-depth documentation. So just git clone the project navigate to the main directory and run "meteor" from the terminal and browse to the site on your machine. 

Included within the GitHub code are the necessary image files you'll want as well.

