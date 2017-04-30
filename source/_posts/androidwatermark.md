---
title: My Experience Publishing My First Android App, Six Things I Learned
date: 2011-06-04
tags: [java, android, mobile]
banner: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/androidwatermark.JPG
thumbnail: https://s3-us-west-2.amazonaws.com/taywils.me.static.files/images/post_banners_thumbnails/androidwatermark.JPG
---
Publishing my first Android app to the Google App store was quite the interesting experience. In this article I'll explain six basic things I learned in the process. Some of the highlights include getting comfortable using version control and how to properly debug Android apps using the free tools provided by Google.

<!-- more -->
Here are some of the things I learned about developing for the [Android][link_android_dev_home] platform from publishing my first app which I hope will useful to others who want to but haven’t started developing for the Android platform.

Its currently in the free beta mode(with ads) right now as I plan on adding more features later such as the ability to design/store your own logos as preferences and an actual user interface that uses the [action bar design pattern][link_android_dev_actionbar] which is so popular nowadays.

### 1) Not knowing Java is not an excuse. 

If you don’t know any Java but you’re proficient in a C-based or C-styled syntax programming language such as C#, C++, PHP  and or any others then you can easily absorb Java as you browse Android tutorials, read Android dev books and begin to poke around with the Android API. I myself only knew C++ but developing for the Android platform quickly allowed me to dive into Java and learn the fundamentals of such things as proper exception handling(ok I admit that I do use exceptions in C++ but I tend to use my own exception class rather than the standard library one); how garbage collected languages differ from non garbage collected ones, the [Eclipse IDE][link_eclipse_ide], the difference between classes and interfaces, how NULL referenced objects are treated by the JVM, lock based synchronization and much more. In short, developing an Android app was a great introduction to the Java programming language.

### 2) Find a great intro level Android development book to supplement online tutorials.

Most of the time when I started out I found that online tutorials and forum posts were often way too specific and narrowly focused to gain much useful knowledge from as a beginning Android dev. What I mean is that comments were often left out(necessary to understand the design choices) and or the solution posted was just a snippet of functionality and not something your could copy and paste into Eclipse and compile (unless you already knew what you were doing). Although there were a few good exceptions, I was only able to actually make sense of many online tutorials and such after I understood the basics of Android development. This also saves you the embarrassment of annoying people online when you ask questions which could be easily answered by a quick Google search or better yet printed in the first chapter of any of the numerous introductory level Android books.

If you want to know which ones I read, I found [Teach Yourself Android Application Development in 24 Hours][link_teach_yourself_android_in_24] to be very useful since each chapter(written to be read in 1 hour intervals) was very succinct and got straight to the point. In addition the Q&A sections at the end of the chapters gave me a chance to practice and try out new things and prevented me from just engaging in passive learning. I also used [APress Pro Android 2][link_apress_android_pro_2] which despite its less than stellar 3 out of 5 star rating(4 stars is my usual minimum) on Amazon.com it was a great source for fully functioning mini apps that you can run on your phone and the entire book covered almost all of the Android API.

### 3) Logcat and the DDMS(Dalvik Debug Monitor Server) are your best friends. 

While developing my first Android app I struggled early on to properly deal with sudden program crashes and JVM out of memory exceptions being triggered. At first I was at lost, until I learned how to properly use the debugging tools which were bundled with the Android SDK installation. This isn’t necessarily a blog post on debugging techniques but here is one great tutorial I found which helped me through some difficult times, or how you should learn to properly 

### 4) Start using version control software if you haven’t been doing so.

I’m going to be honest here but prior to becoming comfortable with version control, I would add new features to my existing app by doing the following.

- Create a new project in Eclipse titled “New feature X”

- Copy all necessary files from the existing project over to the new one

- Implement the feature and debug

- If the feature worked, copy and paste it back extra carefully into the original hoping that no squiggly red underlines would show up in the IDE

- ???

- Compile!!!!

After a while I just grew tired of the fact that adding new features such as trying out multi-touch zooming and or testing out an alternative layout scheme became so immensely difficult and error prone(copy and pasting into the wrong Java class file and or creating variable naming conflicts). So I did a little research and found a neat tool called that was perfectly suited to my needs, a cool piece of software called [Git][link_git_scm]. Go check it out, it runs well on all the popular OSs and you will just plain grow to appreciate version control as much as I now do. Ok I know [Git][link_git_scm] isn’t the only version control software around, [wikipedia][link_wikipedia_scm] has a list of free ones but its incredibly easy to learn and crazy powerful once you get started(no pun intended) using its advanced capabilities such as [cloning][link_git_cloning].

### 5) Whenever possible, debug on a real handset not the emulator.

There really isn’t much to say here but until you can actually run your application on a real handset you may never know if your layouts will display properly out in the wild. In addition if anyone you know has a different Android model ask them to try out your app and get some early feedback.

### 6) Start a code journal or something; become influential.

This might sound a little cheezy or evoke just a “yeah whatever” type of reaction but it pays to set clear deadlines for yourself and to not slack off. Writing an Android application can quickly go from just a weekend hack to a month long ordeal depending on your app. Although you could go to the extreme case and install productivity software to [lock down your web browser during working hours][link_freedom_app], my alternative and the one I highly recommend is to start a code journal. A code journal to me at least is just a real journal(not this blog) where you jot down ideas about features you wish to implement or where you just plain brainstorm new web apps or something.

[link_android_dev_home]: http://developer.android.com/index.html
[link_android_dev_actionbar]: http://developer.android.com/guide/topics/ui/actionbar.html
[link_eclipse_ide]: http://www.eclipse.org
[link_apress_android_pro_2]: http://www.amazon.com/Pro-Android-Sayed-Y-Hashimi/dp/1430226595/ref=sr_1_1?s=books&amp;ie=UTF8&amp;qid=1307061714&amp;sr=1-1
[link_teach_yourself_android_in_24]: http://www.amazon.com/Teach-Yourself-Android-Application-Development/dp/0321673352
[link_git_scm]: http://git-scm.com/
[link_wikipedia_scm]: http://en.wikipedia.org/wiki/List_of_revision_control_software#Free
[link_git_cloning]: http://www.kernel.org/pub/software/scm/git/docs/git-clone.html
[link_freedom_app]: https://freedom.to/
