---
title: Learning Magento - Starting Out
date: 2013-07-16
tags: [php]
categories: [web, magento]
banner: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/learningmagentopart1.jpg
thumbnail: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/learningmagentopart1.jpg
comments: true
---

A new job has required me to learn as much as possible about the popular E-commerce framework Magento. In this series I'll blog about my entire learning experience; the good the bad and the ugly. Taken from the perspective of a developer who has only really heard of Magento from the PHP rumor mill I hope this series will be useful as a case study for Magento's ease of adoption.

<!-- more -->
### My Thoughts On The Current State Of E-commerce Software

When I think of E-commerce software my mind automatically divides it into distinct categories.

1. Small time E-commerce for low revenue Mom and Pop shops using Shopify
2. Middle tier online companies using some online hosted provider such as Amazon and or Ebay
3. Growing companies who can afford to hire I.T/Software Devs to build a customized platform
4. These companies are usually flooding job boards looking for PHP and or Ruby developers
5. They typically use Magento and or Ruby's well made but lesser known Spree framework
6. Big time million dollar per year companines who have outgrown the base configurations of Magento/Spree
7. At this point is where most large E-commerce companies tend to either make it or break it
8. It's also at this crucial point where the company's success is directly correlated to the strength of their development team
9. When moving beyond the bootstrapped defaults of Magento/Spree I've noticed a lot of fricition between what marketing/sales demands (like engravable products, blowout sales and or wacky often ill-defined store credit discounts) and where E-commerce developers start to enter long death march production support hours and basically begin to burn out.
10. So the question becomes; how can E-commerce software biz-scale to handle complex sales/marketing demands?

### Biz-scale and E-commerce
Ok yes I admit, I might not have a single f-ing clue what I'm trying to describe when I mention biz-scale but if you bear with me I'll try my best to explain. So in short its come to my very narrow perspective that the problem of just scaling out a technology stack to handle increased load and user uptime has been for the most part completely solved. Whether its introducing load balancing, spinning up some additional servers on Amazon EC2, Heroku, Windows Azure and the ever growing list of cloud computing hosts that developers can no longer make excuses for unesscessary downtime. However, on the flip side I have noticed a rather interesting trend... there are development shops which despite being able to scale out technologically speaking absolutely fail hard on their faces when it comes to implementing new features and meeting diverse customer demands. The simplest most apparent example of this is that hypothetical company we've all heard of lets call them X-com whose grey-beard developers looked at possible NoSQL options and threw them under the bus. For various reasons whether X-com developers just don't get that certain business logic can be better represented via graph-databases(Neo4j) or document stores(MongoDB) and that the ability of tools such as Redis to optionally persist caches to disk might actually be worth investing some time into in order to hedge against technical debt. Meanwhile customers are demanding that their product automatically sync with their mobile phones and X-com's marketing team needs informative up to the minute time sensitive reports to present to the board for increasing the bottom line.

So although X-com's servers handle peak load and minimal downtime, whether its through sheer ignorance, sloth and or plain stubborness the development team shudders at the single thought of adding a feature to their bloated platform. In my opinion I believe its not just the tech-stack that I'm addressing which I already believe is fine performant and highly scalable; I think the problem of extending features and building a strong platform boils down to being able to build upon layers of abstraction which algin with the needs of the business. When I see development teams blatantly trying to ape one anothers tech-stack simply because it worked for them misses the point entirely. Perhaps we as software developers are entering the end of the convention-over-configuration era simply because we need to fine tune our products to uniquely serve the interest of our customers and keep them delightled happy and satisfied. Or maybe its just that I've noticed just from casual observation that development tools have been growing more complex and tending towards high degrees of configuration as a direct response of consumer demand who have grown acustomed to more complex software.

To conclude this rant I'm always reminded of a previous job where the manager walks in and demands that we implement a sort of Twitter-esque style following for the user profiles on our website. The company at the time was not suffering from high load and or downtime but somehow our systems and tech-stack were so tailored to cookie-cutter user posts to a comment thread that it took considerable time(many developer hours lost) just to extend the very convention heavy system to handle Twitter style follow logic. I'll have to continue this rant about the need for software companies to handle biz-scale given that software scalabitlity has been solved for another time.

### Some Notes On Setting Up A Magento Development Environment
I've been reading through a fantastic book on Magento development titled [Magento PHP Developer's Guide](http://www.amazon.com/Magento-Developers-Guide-Allan-MacGregor/dp/1782163069) by Allan MacGregor and the first chapter of the book helps you setup a Magento development machine. However, I've noticed some rather odd bits here and there and I was forced to do a lot of Googling in order to properly setup my VM. There is a Vagrant setup included within the chapter but for smaller projects and single deployments Vagrant is overkill and developers looking to improve their devops chops miss out on seeing what those complex Vagrant configurations are actually automating. So this blog post today includes the steps I took to get my Magento development box up and running.

### How I Setup A VirtualBox VM For Magento Development
1. Download a copy of Virtual Box, you can find it here [VirtualBox Homepage](https://www.virtualbox.org/wiki/Downloads).
2. Download Ubuntu 64-bit server disk image [Ubuntu 64-bit ISO](http://www.ubuntu.com/download/server)
3. Install Virtual Box and create a new Ubuntu Server 64-bit machine, be sure to mount the Ubuntu.iso and select the boot order as cd-rom first.
4. Just follow through the on screen instructions until you have a freshly installed Ubuntu Server
5. By this point the instructions in the Magento PHP Developers book are rock solid and pretty much stick to the standard LAMP stack installation instructions such as those you can find at most websites.
6. Install Apache2, PHP5 and MySql [LAMP Stack Setup](http://www.howtoforge.com/installing-apache2-with-php5-and-mysql-support-on-ubuntu-11.04-lamp)
7. Once you have your lamp stack properly setup and you are able to hit the Apache2 dummy page as mentioned within the article the next step is to download and install Magento

### How To Install Magento Community Edition With Sample Data
I believe that its worth mentioning that the Magento version 2.0 code as of the date this blog post appears is currently on hiatus. In addition the official Magento Subversion trunk was unavailable to me and I kept getting connection errors. Being resourceful I performed the alternative steps.

Download Git for Linux via Ubuntu's package manager
```
$ sudo apt-get install git
```
Next we are going to create a directory for our magento development system as mentioned within the book by MacGregor.
```
$ sudo mkdir -p /srv/www/magento_dev/public_html/</br>
$ sudo mkdir -p /srv/www/magento_dev/logs/</br>
$ sudo mkdir -p /srv/www/magento_dev/ssl/</br>
```
Using git we'll want to clone the Magento mirror repo into the `/srv/www/magento_dev/public_html/ directory.`
```
$ sudo git clone http://github.com/LokeyCoding/magento-mirror.git /srv/www/magento_dev/public_html/
```
The above directories are necessary for magento to function properly else you will get strange errors when it tries to write to a non-existant log directory. Furthermore we need to perform some standard devops sys-admin stuff for Magento such as configuring apache2 virtual hosts, chown www-data:www-data and chmod -R 755. There are instructions on the Magento website [Magento File Configuration](http://www.magentocommerce.com/download) under the How to Get Started tab.

Assuming you have a directory with the magento git repo cloned and file/directory permissions setup we need to now need to do just one more thing before running the Magento web installer script. In order to have your Magento test environment filled with useful sample data and images you'll need to head to the Magento site and follow the instructions there. However please be warned that all of the sample data files such as the media directory and the sample data .sql file must be put into your `path_to_magento/public_html/` before running the install script. [Magento Sample Data Install Instructions](http://www.magentocommerce.com/knowledge-base/entry/installing-the-sample-data-for-magento).
</p>

### Working With Magento So Far
As a regular PHP developer without any prior Magento development experience I can say that at first the environment setup and database configuration can be daunting and fustrating due to all the necessary apache2 settings, mysql, memcache and PHP5 but there is plenty of helpful advice scattered about the internet to help guide someone along such as myself. From a pure development perspective the Magento code base is simply HUGE... I've gathered that its configuration over convention and that it uses the Zend framework's modular design so its sort of a MVC within an MVC but overall its exposed me to some interesting new design patterns such as [Observer](http://en.wikipedia.org/wiki/Observer_pattern), [Front Controller](http://en.wikipedia.org/wiki/Front_Controller_pattern) and good ole [Factory](http://en.wikipedia.org/wiki/Factory_method_pattern) but I'm still green and looking to eventually master the popular Magento framework. Anyways, I'm trying some new things out with GitHub and have been looking to start a new C++ project.
