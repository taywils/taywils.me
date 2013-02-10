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
<a href="/static/images/imagescrape2.png"><img src="/static/images/imagescrape2.png" alt="Imagescrape2 New UI" width="700px" /></a>
</p>

<p>
Its been a while but I did get around to updating the code for the latest version of imagescrape.
As you'll notice when you use it the images load asynchronously due to the new AJAX in place and the images usually will display rather nicely due to the use of the masonry javascript library. However, there are some changes that need to be added such as the ability to download all of the images scraped and further improvements to the UI such as making it responsive. In think the biggest challenge will definately be upgrading the UI to be responsive as I don't have much experience in that realm due to various techniques and libraries available to accomplish responsive design. Well anyhow go enjoy your new imagescraper before its too late.
One more thing, I can't seem to get the masonry javascript to display the way I want it to so sometimes images will overlap and basically look like complete shit... I'm going to switch over to <a href="http://www.wookmark.com/jquery-plugin">Wookmark</a>  because it seems more user friendly.
</p>

</div>
