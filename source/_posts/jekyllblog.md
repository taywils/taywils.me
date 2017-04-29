---
title: Why I switched over to Jekyll from WordPress
date: 2012-07-25
tags: [ruby, javascript]
categories: []
---
Although it wasn't easy I finally migrated my blog over to Jekyll. Personally I have nothing against the fantastic work of software that is WordPress it really helped a lot of people all across the world get into blogging and sharing their thoughts but WordPress is at its heart a CMS. Although commonly used to host blogs WordPress is greatly under-utilized as a blogging platform and many of its features become rather obtrusive from a single users perspective.

- <a href="https://github.com/taywils/taywils.me">Grab the code on GitHub</a>

Quite some time ago(early 2010) when I just began programming I had learned that it was a fairly common practice amongst programmers to keep an update code blog.
Not knowing anything at all about web development or even what PHP stood for I did what most people assumed when they heard the word blog and jumped on WordPress.
Although there is nothing wrong with using WordPress for a blogging platform, as a developer I quickly realized that I was not the targeted audience.

However I would later learn that many developers do in fact build various plugins and themes for WordPress such as code syntax highlighters and site search engines.On the flipside of it though just being a passive end user of premade tools and widgets didn't allow me to actually gain any insight into the working internals of how to develop a site to host my coding progress.Yes there were times when I had to edit snippets of PHP and or change some Javascript every now and then but I was mostly just blindly following instructions out of ebooks and help forums.

My old programming blog morphed into a nasty mashup of copy pasted code and I used all sorts of weird blog publishing software and quirky online editors just to update a single post on my site.
I could remember it taking me several hours just to go from writing new content to finnally displaying on my code blog just because I knew nothing about how content was actually served on the web.
I can't exactly remember when it was that I was browsing online one day for WordPress tutorials when I spotted a comment on a blog post that said something along the lines of "Do you really need a database connection just to fetch blog post which probably won't ever be updated after you've written it?". 

Something about that kinda pissed me off... I was thinking to myself "You know... why the heck do I need user auth and an entire content management system which I probably only use about 2% of its entire features anyways just to render some damn static html on a screen?"
However given my skillset at the time(all I knew was C++ and a tiny sliver of HTML) I couldn't imagine writting every single line of HTML by hand and having to go through and update every single link on the site; not only would it be absurd but the sheer amount of wasted time could have been invested into just paying someone to build a site for me.

In the meantime I had just discovered the wonders of version control and Git in particular when I came across an article about how GitHub.com handles its myraid number of web pages.
It was something called Jekyll, a blog aware static site generator.

The basics of Jekyll are easy enough to figure out, you design a layout and run some ruby code to render all of your post which fit neatly into the<div>_post</div>directory of your app.
From there you run the command "Jekyll" at the terminal at the root directory of your application and the _site folder is generated.

Next you copy the<div>_site</div> directory to a web server and you're done.
The overall no nonsense just write some markup or markdown, add css throw in some javascript and let Jekyll do the rest really made writing a blog a chore.
As you can see from the github source for this blog the main layout is where all parts of the Jekyll app come together.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en-us">
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<title>Taywils.me | {{ page.title }}</title>

<!-- CSS libraries -->
<link rel="stylesheet" href="/css/gcp/prettify.css" type="text/css"/> 
<link rel="stylesheet" href="/css/gcp/sons-of-obsidian.css" type="text/css"/> 
<link rel="stylesheet" href="/css/slides.css" type="text/css"/>

<!-- My CSS -->
<link rel="stylesheet/less" href="/css/style.less" type="text/css"/>

<!-- Javscript Libraries -->
<script type="text/javascript" src="/javascript/less-1.3.0.min.js"></script>
<script type="text/javascript" src="/javascript/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="/javascript/coffee-script-1.3.3.min.js"></script>
<script type="text/javascript" src="/javascript/gcp/prettify.js"></script>
<script type="text/javascript" src="/javascript/slides.min.jquery.js"></script>

<!-- My Javascript -->
<script type="text/coffeescript" src="/javascript/page.coffee"></script>
<script type="text/coffeescript" src="/javascript/about.coffee"></script>
<script type="text/javascript" src="/javascript/projects.js"></script>
</head>
<body onload="prettyPrint();">
<div id="header" align="center">
<table>
<tr>
<td class="header-space">
<h1>
<a class="page-fade" href="/index.html">Blog</a>
</h1>
</td>
<td class="header-space">
<h2>
<a class="page-fade" href="/projects.html">Projects</a>
</h2>
</td>
<td class="header-space">
<h2>
<a class="page-fade" href="/about.html">About</a>
</h2>
</td>
</tr>
</table>
</div>

<div id="left-sidebar">
</div>

<div id="right-sidebar">
</div>

<div id="content">
{{ content }}
</div>

<div id="footer">
<p>
<div class="copyright" align="center">
Copyright &amp;copy; 2012 Demetrious Taylor Wilson.  All rights reserved.
</div>
</p>
</div>
</body>
</html>
```
When you yield for the content you then tell your individual pages which layout to use.
Once selected within the page yaml as you can see below you use Jekyll's builtin post macro for accessing the yaml you describe inside of each post.
In addition you can add your own custom post yaml such as the post.mydate which formats the post's date a bit differently from the default post.date.
```html
---
layout: default
title: Homepage
permalink: /index.html
---
{% for post in site.posts %}
<table class="article-table" align="center">
<tbody>
<tr>
<td class="article-title">
<a href="{{ post.url }}">{{ post.mydate }} | {{ post.title }}</a>
</td>
</tr>
<tr>
<td class="article-description">
<a href="{{ post.url }}">{{ post.description }}</a>
</td>
</tr>
<tr>
<td class="article-tags">
{% for tag in post.tags %}
<img src="/images/{{ tag }}.png" title="{{ tag }}"/>
{% endfor %}
<div class="article-catagories">
{% for catagory in post.catagories %}
[{{ catagory }}]
{% endfor %}
</div>
</td>
<div style="clear: both;"></div>
</tr>
</tbody>
</table>
{% endfor %}
```
From my perspective at least, getting up and running with Jekyll was simple and easy compared to having to learn about an entire database query language(MySQL) before you can access your posts.
Despite all of my cheerleading and praise I admit Jekyll was a bit confusing at times due to the usage of the liquid templating engine.
I had to sit down for a few hours and did through some documentation and browse source code of existing Jekyll blogs in order to understand the finer points of how pages are rendered from templates.
Even more confusing was that since HTML is readily generated when the <div>_site</div> directory is created you don't need to place inline javascript within the post itself(although there is nothing stopping you from doing so) all of your javascript can go in the layout and access DOM from posts as they are shown.

Anyhow I've talked way too much in this post already... enjoy your static site produced with Jekyll.

(NOTE: I realize that you can't compare an entire CMS to a static site generator but I'm only comparing them from a blogger's point of view)
