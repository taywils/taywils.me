---
title: The Projects page, a slidejs tutorial
date: 2012-09-12
tags: [javascript]
categories: [tutorial]
banner: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/newprojectspage.JPG
thumbnail: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/newprojectspage.JPG
comments: true
---
I used some interesting jquery tricks(at least to me) to make the projects page more visually appealing; read on to learn how it was made. This is the beginning of a series on updates to the overall blog that I will post as I continue to learn more about both the Ruby Jekyll gem and web design in general.

<!-- more -->
The projects page was designed using jquery and a neat javascript library called slidesjs<a href="http://slidesjs.com/">(slidesjs.com)</a>.
Slidesjs is a simple yet elegant slideshow library with many special features such as the ability to add captions and various transition effects to your slides.

I choose to use it mainly because I found the documentaion well prepared<a href="http://slidesjs.com/#docs">(slidesjs.com/#doc)</a>, on the site you'll find the rest of the features I won't touch on in this article.This first part of the project page is the underlying html file, in this file you'll notice the structure of the main div tag which holds the sildes_container. From within the slides_container you just add your slides and content as a div tag with the class slide; and from there you can put whatever you want into it.

Below is a copy of an early version of the projects page which was adapted from the "images with captions" example from slidesjs.
The only real change I made(excluding the image sources and caption content) is the last div tag at the bottom, <div id="project-description"> this div tag allows me to swap out the contents of the projects page as you move across the slideshow using jquery which we'll cover after the CSS bit.

```html
<div id="container">
<div id="example">
<div id="slides">
<div class="slides_container">
<div class="slide">
<a href="http://www.flickr.com/photos/jliba/4665625073/" title="145.365 - Happy Bokeh Thursday! | Flickr - Photo Sharing!" target="_blank"><img src="/images/slidesjs/slide-1.jpg" width="570" height="270" alt="Slide 1"></a>
<div class="caption" style="bottom:0">
<b>Project A</b>
<a href="foeafjoljf">Live Demo</a>&nbsp;|&nbsp;<a href="foeafjoljf">GitHub</a>
<p>
This is just a test to check things out.
</p>
</div>
</div>
<div class="slide">
<a href="http://www.flickr.com/photos/stephangeyer/3020487807/" title="Taxi | Flickr - Photo Sharing!" target="_blank"><img src="/images/slidesjs/slide-2.jpg" width="570" height="270" alt="Slide 2"></a>
<div class="caption">
<b>Project B</b>
<a href="foeafjoljf">Buy it on Google Play</a>&nbsp;|&nbsp;<a href="foeafjoljf">GitHub</a>
<p>
It took me a while to build it out but its done now.
</p>
</div>
</div>
<div class="slide">
<a href="http://www.flickr.com/photos/childofwar/2984345060/" title="Happy Bokeh raining Day | Flickr - Photo Sharing!" target="_blank"><img src="/images/slidesjs/slide-3.jpg" width="570" height="270" alt="Slide 3"></a>
<div class="caption">
Happy Bokeh raining Day
</div>
</div>
<div class="slide">
<a href="http://www.flickr.com/photos/b-tal/117037943/" title="We Eat Light | Flickr - Photo Sharing!" target="_blank"><img src="/images/slidesjs/slide-4.jpg" width="570" height="270" alt="Slide 4"></a>
<div class="caption">
We Eat Light
</div>
</div>
<div class="slide">
<a href="http://www.flickr.com/photos/bu7amd/3447416780/" title="&amp;ldquo;I must go down to the sea again, to the lonely sea and the sky; and all I ask is a tall ship and a star to steer her by.&amp;rdquo; | Flickr - Photo Sharing!" target="_blank"><img src="/images/slidesjs/slide-5.jpg" width="570" height="270" alt="Slide 5"></a>
<div class="caption">
&amp;ldquo;I must go down to the sea again, to the lonely sea and the sky...&amp;rdquo;
</div>
</div>
<div class="slide">
<a href="http://www.flickr.com/photos/streetpreacher/2078765853/" title="twelve.inch | Flickr - Photo Sharing!" target="_blank"><img src="/images/slidesjs/slide-6.jpg" width="570" height="270" alt="Slide 6"></a>
<div class="caption">
twelve.inch
</div>
</div>
<div class="slide">
<a href="http://www.flickr.com/photos/aftab/3152515428/" title="Save my love for loneliness | Flickr - Photo Sharing!" target="_blank"><img src="/images/slidesjs/slide-7.jpg" width="570" height="270" alt="Slide 7"></a>
<div class="caption">
Save my love for loneliness
</div>
</div>
</div>
<a href="#" class="prev"><img src="/images/slidesjs/arrow-prev.png" width="24" height="43" alt="Arrow Prev"></a>
<a href="#" class="next"><img src="/images/slidesjs/arrow-next.png" width="24" height="43" alt="Arrow Next"></a>
</div>
<img src="/images/slidesjs/example-frame.png" width="739" height="341" alt="Example Frame" id="frame">
</div>
</div>
<div id="project-description">
</div>
```
The css shown below is very minimal and uses nothing out of the ordinary
```css
#container {
  width:580px;
padding:10px;
margin:0 auto;
position:relative;
         z-index:0;
}

#example {
width:600px;
height:350px;
position:relative;
}

#frame {
position:absolute;
         z-index:0;
width:739px;
height:341px;
top:-3px;
left:-80px;
}

/*
   Slideshow
 */
#slides {
position:absolute;
top:15px;
left:4px;
     z-index:100;
}

/*
   Slides container
Important:
Set the width of your slides container
Set to display none, prevents content flash
 */
.slides_container {
width:570px;
overflow:hidden;
position:relative;
display:none;
}

/*
   Each slide
Important:
Set the width of your slides
If height not specified height will be set by the slide content
Set to display block
 */
.slides_container div.slide {
width:570px;
height:270px;
display:block;
}


/*
   Next/prev buttons
 */
#slides .next,#slides .prev {
position:absolute;
top:107px;
left:-39px;
width:24px;
height:43px;
display:block;
        z-index:101;
}

#slides .next {
left:585px;
}

/*
   Pagination
 */
.pagination {
margin:26px auto 0;
width:100px;
}

.pagination li {
float:left;
margin:0 1px;
       list-style:none;
}

.pagination li a {
display:block;
width:12px;
height:0;
       padding-top:12px;
       background-image:url(/images/slidesjs/pagination.png);
       background-position:0 0;
float:left;
overflow:hidden;
}

.pagination li.current a {
  background-position:0 -12px;
}
```
Finally here is the javascript code for the projects page which calls the slidesjs library animation functions.
The main addition here is the showDescription(), it takes the div tag I mentioned before and extracts the current visible slides' content and displays it on every page transition.
```javascript
$(function(){
    $('#slides').slides({
preload: true,
preloadImage: '/images/slidesjs/loading.gif',
play: 0,
pause: 2500,
hoverPause: true,
animationStart: function(current){
},
animationComplete: function(current){
showDescription();
},
slidesLoaded: function() {
showDescription();
}
});

    function showDescription() {
    //slide content
    var $sc = $('div.slide').filter(function() {
        return this.style.display !== 'none';
        });
    //caption
    var cap = $sc.children('div.caption').html();
    $('div#project-description').html(cap);
    }
});
```
Of particular merit here is the jquery filter function. 
What this allows us to do is to basically only extract the sole visible slide from the div holding the slides by looking at the display property.

In addition the jquery children function lets us run what is basically a sub-query on a given jquery object.
From my perspective I could have easily just included the children search in the original query but I tend to keep queries short and simple to help the code remain easy to read.

Well that about wraps up how I put together the projects page... be sure to visit the projects page every once in a while.
