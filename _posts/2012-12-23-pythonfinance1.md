---
layout: post
title: Install Python, Numpy and Pandas on Windows 7 
mydate: Dec 23 2012
tags: [python]
catagories: [tutorial, numpy, pandas]
comments: true
description: In this tutorial we'll setup a Python development environment on Windows 7. After finishing this tutorial you will be ready to start writing numerical applications, data analysis algorithmns and implement various machine learning methods. I've always wanted to get back into numerical computing and Python seems like the way to go.
---
### Install Python, Numpy and Pandas on Windows 7

1. Visit [http://www.python.org](http://www.python.org) and search for Python version 3.2.x

	- [http://www.python.org/download/releases/3.2.3/](http://www.python.org/download/releases/3.2.3/)

	- The 64-bit version currently doesn't support NumPy and or SciPy so grab the 32-bit version

	<a href="/static/images/win_py_tutorial/1.PNG"> <img src="/static/images/win_py_tutorial/1.PNG" alt="Windows x86 32bit Python" width="700px" height="300px"/></a>

2. Double click the Microsoft Installer file from Windows Explorer

	- Special thanks to [http://www.andrewsturges.com/2012/05/installing-numpy-for-python-3-in.html](http://www.andrewsturges.com/2012/05/installing-numpy-for-python-3-in.html)

	- <a href="/static/images/win_py_tutorial/2.PNG"><img src="/static/images/win_py_tutorial/2.PNG" alt="Windows x86 32bit Python" width="505px" height="435px"/></a>

	- According to Andrew we have to select the option "Install just for me"

	- Click "Next"

	- Install Python to the root directory of your hard disk mine was "C:\Python32\"

	- On the page "Customize Python 3.2.x" enable the option "Add python.exe to Path"

	- While still on the page "Customize Python 3.2.x" click "Advanced" this will open a new window

	- <a href="/static/images/win_py_tutorial/3.PNG"><img src="/static/images/win_py_tutorial/3.PNG" alt="Windows x86 32bit Python" width="505px" height="435px"/></a>

	- Check the option on that page; for a discussion for why this option is used see the post on Stackoverflow

		[http://stackoverflow.com/questions/12376188/should-i-compile-py-files-to-byte-code-after-installation](http://stackoverflow.com/questions/12376188/should-i-compile-py-files-to-byte-code-after-installation)

3. Verify that python installed correctly

	- Press the window key or click the start menu and type "python" and the search results should include 

	- "Python (command line)" that is the one we want so click it.

	- You should be able to run a small Hello world program from the python interactive terminal

4. Go install numpy

	- [http://sourceforge.net/projects/numpy/files/NumPy/1.6.2/numpy-1.6.2-win32-superpack-python3.2.exe/download](http://sourceforge.net/projects/numpy/files/NumPy/1.6.2/numpy-1.6.2-win32-superpack-python3.2.exe/download)

	- Once downloading is completed run the installer

	- <a href="/static/images/win_py_tutorial/4.PNG"><img src="/static/images/win_py_tutorial/4.PNG" alt="Windows x86 32bit Python" width="600px" height="397px"/></a>

	- Verify that numpy was successfully installed by opening a command prompt and running the following code

	- <a href="/static/images/win_py_tutorial/5.PNG"><img src="/static/images/win_py_tutorial/5.PNG" alt="Windows x86 32bit Python" width="600px" height="124px"/></a>

5. Go grab a copy of Visual Studio 2012 if you don't already have a copy (don't worry you can use the free express edition)

	- I'm using the express version for desktop [http://www.microsoft.com/visualstudio/eng/downloads](http://www.microsoft.com/visualstudio/eng/downloads)

6. Install the Visual Studio 2012 Isolated Shell the download link is found on the same page

7. Install the Visual Studio 2012 Integrated Shell (same as step 6)

	- NOTICE! At this point if you went the free route and installed Visual Studio Express you will actually have two programs, Visual Studio 2012 in addition to Visual Studio Express

	- <a href="/static/images/win_py_tutorial/e.png"><img src="/static/images/win_py_tutorial/e.png" width="262px" height="469px"/></a>

	- To use Python you will have to use Visual Studio 2012

	- To use regular C#, C++, VB etc you will need to run the Visual Studio Express version

8. Install the Python Tools for Visual Studio

	- [http://pytools.codeplex.com/](http://pytools.codeplex.com/)

	- Once you have installed the application you should be able to open Visual Studio 2012 and start a new Python application project

	- <a href="/static/images/win_py_tutorial/b.PNG"><img src="/static/images/win_py_tutorial/b.PNG" width="475px" height="306px"/></a>

9. Within Visual Studio 2012 click Tools >> Options >> Python Tools and change the default version of python to 3.2

	- <a href="/static/images/win_py_tutorial/a.PNG"><img src="/static/images/win_py_tutorial/a.PNG" width="375px" height="220px"/></a>

	- As you remember from the earlier instructions Numpy currently does not support python 3.3 on Windows

	- If avaliable regenerate the intellisense database, this is what allows Visual Studio to perform autocomplete

	- <a href="/static/images/win_py_tutorial/f.png"><img src="/static/images/win_py_tutorial/f.png" width="375px" height="220px"/></a>

	- Next make sure you can get your visual studio 2012 to resemble the screenshots

	- <a href="/static/images/win_py_tutorial/d.png"><img src="/static/images/win_py_tutorial/d.png" width="656px" height="380px"/></a>

	- Numpy will show up in the autocomplete if you have been doing everything correctly

	- <a href="/static/images/win_py_tutorial/c.png"><img src="/static/images/win_py_tutorial/c.png" width="450px" height="450px"/></a>

10. Setting up Pandas

	- Go get the latest version of Pandas [http://pandas.pydata.org/index.html](http://pandas.pydata.org/index.html)

	- Since we're using 32-bit Python 3.2 make sure you download the version that supports it

	- <a href="/static/images/win_py_tutorial/g.PNG"><img src="/static/images/win_py_tutorial/g.PNG" width="334px" height="565px"/></a>

	- Download and install it

11. Download the dateutil package from [http://pypi.python.org/pypi/python-dateutil](http://pypi.python.org/pypi/python-dateutil)

	- From within the python-dateutil 2.1 folder copy the folder "dateutil" to "C:\Python32\Lib\site-packages"

	- The "C:\Python32\Lib\site-packages" folder is where 3rd party packages are to be installed

	- You will need this for pandas to work properly

12. Download the package called "six" from pypi [http://pypi.python.org/pypi/six/1.2.0](http://pypi.python.org/pypi/six/1.2.0)

	- Unlike dateutil "six" actually needs to be installed from the command line

	- Extract the zipped folder and then copy the contents to "C:\Python32\Lib\site-packages"

	- Go into the six folder and run the following command

	- "setup.py install"

	- <a href="/static/images/win_py_tutorial/h.PNG"><img src="/static/images/win_py_tutorial/h.PNG" width="450px" height="38px"/></a>

13. Verify that pandas is working

	- Open Visual Studio 2012 and either start a new Python application or open an existing one

	- Start the Python Interactive shell and enter the code that appears within the screenshot below

	- <a href="/static/images/win_py_tutorial/i.png"><img src="/static/images/win_py_tutorial/i.png" width="473px" height="230px"/></a>
