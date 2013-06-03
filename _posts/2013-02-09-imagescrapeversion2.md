---
layout: post
title: Imagescrape Version 2
mydate: Feb 09 2013
tags: [ruby, javascript]
catagories: [sinatra, github, heroku]
comments: true
description: After over a year I've finally made some changes to my old imagescraper Ruby project. I re-wrote the entire code from the ground up and replaced the old session based form with a new AJAX powered one. It was interesting to see just how bad of a developer I once was and how much my skills have improved since I first began the project.
---
### Imagescrape Version 2

<div class="post-content">
<p style="text-align: center;">
<a href="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/imagescrape2.png"><img src="https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/imagescrape2.png" alt="Imagescrape2 New UI" width="300px" /></a>
</p>

Click here to see the new version of Imagescrape in action <a href="http://imagescraper.heroku.com/">http://www.imagescrape.heroku.com</a>
<p>
Its been a while but I did get around to updating the code for the latest version of imagescrape.
As you'll notice when you use it the images load without storing huge amounts of data within the session due to the new AJAX in place and the images usually will display rather nicely due to the use of the masonry javascript library. However, there are some changes that need to be added such as the ability to download all of the images scraped and further improvements to the UI.
I eventually want to turn this small app into something much larger but as of now I can't think of how it will ever be useful for anything more than just a toy app.
</p>
</div>
