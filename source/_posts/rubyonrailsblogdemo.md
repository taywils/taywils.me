---
title: Ruby On Rails Blog Project Live Demo
date: 2011-06-10
categories: [ruby-on-rails]
tags: [ruby, javascript]
comments: true
---
A while ago I decided to get my feet wet with the awesome Ruby On Rails MVC framework for developing dynamic databased backed web applications. In this article you can see a short project I developed that highlights a typical blog you can create using the Ruby On Rails framework.

<!-- more -->
<p>Last winter I began playing around with the Ruby programming language and seeing whether or not I would like to begin building software in it as opposed to Python or PHP. Well after going through various online tutorials and a spending about 2 months(while I was still in college) reading through a well <a href="http://www.amazon.com/Beginning-Ruby-Novice-Professional-Experts/dp/1590597664">rounded intro book on the Ruby</a> language I decided that it would be best to start learning about the Rails web development framework. So I headed over to the Rails homepage <a href="http://rubyonrails.org/">rubyonrails.org</a> and began going through some more tutorials and finally decided to try out a demo project just to get a more well rounded feeling of the framework that goes beyond simple Rails scaffolds and or 30 minute View-Controller applications that don’t require databases. So without boring you to death the link below is the demo application I built using the Ruby on Rails framework over the course of about eight weeks or so(during my senior year of college and mostly on weekends) at the link below.</p> <p>Click here to see my Rails demo. <b>No longer available</b></a></p> <p><strong><u>The Ruby On Rails Blog is hosted on a server running Apache; so how the heck did I embed a Rails application on an Apache server?</u></strong></p> <p>The answer to this question is <a href="http://www.modrails.com/">a well known Ruby gem called passenger a.k.a mod_rails</a> developed by <a href="http://www.phusion.nl/">Phusion</a>. In short it allows you to deploy a Rails application onto an Apache server with very little additional configuration(only a single file needs to be added along with a symbolic link to the rails/public directory).</p>
