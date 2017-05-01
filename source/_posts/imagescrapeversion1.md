---
title: Imagescraper Is A Sinatra.rb App That Dumps Images From a Webpage
date: 2011-09-04
categories: []
tags: [javascript, ruby]
banner: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/imagescrapeversion1.JPG
thumbnail: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/imagescrapeversion1.JPG
comments: false
---
Learn about imagescraper, its a small test project I wrote to familiarize myself with the Sinatra microframework. In short you pass it a url and it returns all images from the page.

<!-- more -->
Imagescraper is a small project I built using Ruby together with the Sinatra microframework. If you aren't familiar with Sinatra you can browse the project's main website at <a href="http://www.sinatrarb.com/">http://www.sinatrarb.com/</a>. In a nutshell Sinatra is light weight framework for Ruby that lets you rapidly build web applications using as few lines of code as possible.

To install Sinatra as a Ruby gem, just type

```
$ gem install sinatra
```

into your terminal window assuming that you have Ruby installed on your machine and you can begin bashing out HTTP GET and POST request on your local machine using Ruby and then just run the app using the Sinatra gem. For a quick overview of Sinatra see the documentation <a href="http://www.sinatrarb.com/documentation">http://www.sinatrarb.com/documentation</a>.

Anyways, Imagescraper is a small Sinatra app that fetches and displays all images from a given url. I had planned to to do much more with the scraper such as let a user upload a text file with a list of urls and have it download the files to your machine but the project began to lose focus and the unnecessary feature creep was beginning to bog me down. However, the source code is available on my GitHub account and you can play with Imagescraper at the link below(the app is being hosted on Heroku)

Browse the source code:

<a href="https://github.com/taywils/_Imagescraper_">https://github.com/taywils/_Imagescraper_</a>

Run the app on Heroku:

<a href="http://imagescraper.heroku.com/">http://imagescraper.heroku.com/</a>
