---
title: Build An Application Launcher For Android
date: 2011-07-05
categories: [tutorial]
tags: [java, android, mobile]
---
In this tutorial we'll create an interesting android application which has the ability to launch any other app you have installed on your phone. If you've ever wanted to know how Android applications perform cross app communication you should read on(this tutorial assumes familiarity with the Android API).

To start off create a new Android application project within Eclipse. Whenever I develop Android apps I usually start with the layout of the application and add functionality via Java classes later. Since our app will display the users installed apps within a ListView widget we have to first declare a layout to hold the ListView itself.

Create a new xml layout for the ListView by right clicking the res/layout folder and adding a new android xml file. Title it "applauncher.xml" and then add the code below to it.

```xml
<LinearLayout
xmlns:android="http://schemas.android.com/apk/res/android"
android:id="@+id/applauncher_linearlayout"
android:layout_width="fill_parent"
android:layout_height="fill_parent"
android:orientation="vertical">

<ListView
android:id="@android:id/list"
android:layout_width="fill_parent"
android:layout_height="fill_parent"/>

<TextView
android:id="@android:id/empty"
android:layout_width="fill_parent"
android:layout_height="fill_parent"
android:text="List PlaceHolder"/>

</LinearLayout>
```
When using ListViews we can setup the overall look of each row by creating an xml layout with a skeleton of the widgets that we want to display in each row of our ListView. Think of the row layout as a "row template". If you look at the screenshots of the app you can tell that we only need two widgets within our row layout, an ImageView to hold the apps icon and a TextView to display the apps package name.

Create a new xml layout for the ListView rows by right clicking the res/layout folder and adding a new android xml file. Title it "applauncherrow.xml" and add the code below.
```xml
<LinearLayout
xmlns:android="http://schemas.android.com/apk/res/android"
android:id="@+id/applauncherrow_imagelinearlayout"
android:layout_width="fill_parent"
android:layout_height="?android:attr/listPreferredItemHeight"
android:padding="6dip">

<ImageView
android:id="@+id/applauncherrow_icon"
android:layout_width="wrap_content"
android:layout_height="fill_parent"
android:layout_marginRight="6dip"/>

<LinearLayout
android:id="@+id/applauncherrow_namelinearlayout"
android:orientation="vertical"
android:layout_width="0dip"
android:layout_weight="1"
android:layout_height="fill_parent">

<TextView
android:id="@+id/applauncherrow_appname"
android:layout_width="fill_parent"
android:layout_height="0dip"
android:layout_weight="1"
android:gravity="center_vertical"/>

</LinearLayout>

</LinearLayout>
```
Next we're going to setup the main activity for the launcher app and register the activity in the manifest.

Create a new Java Class and name it "AppLauncher.java".

Next open up the manifest file for your application and make sure it looks like the code below.

```xml
<!-- Your package="" name might differ -->
<manifest 
xmlns:android="http://schemas.android.com/apk/res/android"
package="org.example.hello" 
android:versionCode="1"
android:versionName="1.0">

<!-- Your default android:icon="" name might differ -->
<application 
android:icon="@drawable/icon" 
android:label="AppLauncher" 
android:debuggable="true"
android:description="An Application Launcher">

<activity
android:name="AppLauncher"
android:label="AppLauncher">

<!-- This tag indicates the initial activity -->
<intent-filter>
<action android:name="android.intent.action.MAIN" />
<category android:name="android.intent.category.LAUNCHER" />
</intent-filter>

</activity>

</application>

<uses-sdk android:minSdkVersion="8" />

</manifest> 
```
Ok so now that the layouts are coded up and the activity is registered within the manifest open up AppLauncher.java and lets begin.

Lets start off with importing all the necessary libraries needed for our app.

```java
//Your package name might differ
package org.example.hello;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import android.app.ListActivity;
import android.app.ProgressDialog;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
```

Our app will extend the ListActivity class in order to reduce the boiler plate needed to build a ListView.

```java
public class AppLauncher extends ListActivity{
```

However, due to the structure of the app we'll build the classes needed and stitch them together so just follow along with a text editor for now. To begin we'll need a class to hold all the useful data we can obtain from a given app. We'll call it AppInfo, its very basic so go ahead and type it into your editor.

```java
    public class AppInfo{
      private String appName = "";
      private String packageName = "";
      private String className = "";
      private String versionName = "";
      private Integer versionCode = 0;
      private Drawable icon = null;

      public String getAppName(){
        return appName;
      }

      public String getPackageName(){
        return packageName;
      }

      public String getClassName(){
        return className;
      }

      public String getVersionName(){
        return versionName;
      }

      public Integer getVersionCode(){
        return versionCode;
      }

      public Drawable getIcon(){
        return icon;
      }
    }
```

The next class we need is a class that will be used to obtain the application info for the AppInfo class. This class is the bread and butter of our AppLauncher and it together with the AppInfo class can be ported to any application which needs to access other apps via intents.

```java
    public class Applications{
      private ArrayList<AppInfo> packageList = null;
      private List<ResolveInfo> activityList = null;
      private Intent mainIntent = new Intent(Intent.ACTION_MAIN, null);
      private PackageManager packMan = null;
```

For the Applications constructor we will pass in the all important PackageManager from the main context.

```java
        public Applications(PackageManager packManager){
          packMan = packManager;
          packageList = this.createPackageList(false);
          activityList = this.createActivityList();
          this.addClassNamesToPackageList();
        }
```

Below are some getter methods for the package and activities list. The difference between the two is that the package list contains the info about the apps data and the activity list contains info about the intents the app responds to.

```java
        public ArrayList<AppInfo> getPackageList(){
          return packageList;
        }

      public List<ResolveInfo> getActivityList(){
        return activityList;
      }
```

The next method is the createPackageList method. All it does is simply extract a list of all the installed apps via the PackageManager that we passed into the constructor. Next we iterate over the list and copy the info we need into a AppInfo object and then shove that object into the ArrayList<AppInfo> that will be returned.

```java
        private ArrayList<AppInfo> createPackageList(boolean getSysPackages){
          ArrayList<AppInfo> pList = new ArrayList<AppInfo>();        

          List<PackageInfo> packs = getPackageManager(
              ).getInstalledPackages(0);

          for(int i = 0; i < packs.size(); i++){
            PackageInfo packInfo = packs.get(i);

            if((!getSysPackages) && (packInfo.versionName == null)){
              continue ;
            }

            AppInfo newInfo = new AppInfo();

            newInfo.appName = packInfo.applicationInfo.loadLabel(
                getPackageManager()).toString();
            newInfo.packageName = packInfo.packageName;   
            newInfo.versionName = packInfo.versionName;
            newInfo.versionCode = packInfo.versionCode;
            newInfo.icon = packInfo.applicationInfo.loadIcon(
                getPackageManager());

            pList.add(newInfo);
          }
          return pList; 
        }
```

Similar to the createPakageList method, createActivityList will return a list with all of the apps installed intent data but unlike createPackageList its only 8 lines of code.

```java
        private List<ResolveInfo> createActivityList(){
          List<ResolveInfo> aList = packMan.queryIntentActivities(mainIntent, 0);

          Collections.sort(aList, 
              new ResolveInfo.DisplayNameComparator(packMan)); 

          return aList;
        }
```

The next two methods are purely for dubugging purposes and can actually be left out but we'll include them for completeness or in case you use this class in another application.

```java
        private void packageDebug(){
          if(null == packageList){
            return;
          }

          for(int i = 0; i < packageList.size(); ++i){
            Log.v("PACKINFO: ", "\t" + 
                packageList.get(i).appName + "\t" + 
                packageList.get(i).packageName + "\t" + 
                packageList.get(i).className + "\t" +
                packageList.get(i).versionName + "\t" + 
                packageList.get(i).versionCode);
          }
        }

      private void activityDebug(){
        if(null == activityList){
          return;
        }

        for(int i = 0; i < activityList.size(); i++){ 
          ActivityInfo currentActivity = activityList.get(
              i).activityInfo;
          Log.v("ACTINFO", 
              "pName=" 
              + currentActivity.applicationInfo.packageName +
              " cName=" + currentActivity.name);
        }
      }
```

The next method is needed only because in order to launch an app you need both its package name and its intent name that connects to the main class of the app. However, if you only use the packageList you'll lack the intent data, so the last method of the Application class adds the class name(intent data) to the packageList making it such that client of the class can have everything bundled up nicely in the packageList instead of having to rely on using both the activity and packageList in unison.

For the method addClassNameToPackageList we'll iterate over the packageList and for each packageName we'll find its match within the activityList by packageName and then extract the className from the activityList.

```java
        private void addClassNamesToPackageList(){
          if(null == activityList || null == packageList){
            return;
          }

          String tempName = "";

          for(int i = 0; i < packageList.size(); ++i){
            tempName = packageList.get(i).packageName;

            for(int j = 0; j < activityList.size(); ++j){
              if(tempName.equals(activityList.get(
                      j).activityInfo.applicationInfo.packageName)){
                packageList.get(i).className = activityList.get(
                    j).activityInfo.name;
              }
            }
          }
        }
    }
```

Below is the complete Application class

```java
    public class Applications{
      private ArrayList<AppInfo> packageList = null;
      private List<ResolveInfo> activityList = null;
      private Intent mainIntent = new Intent(Intent.ACTION_MAIN, null);
      private PackageManager packMan = null;

      public Applications(PackageManager packManager){
        packMan = packManager;
        packageList = this.createPackageList(false);
        activityList = this.createActivityList();
        this.addClassNamesToPackageList();
      }

      public ArrayList<AppInfo> getPackageList(){
        return packageList;
      }

      public List<ResolveInfo> getActivityList(){
        return activityList;
      }

      private ArrayList<AppInfo> createPackageList(boolean getSysPackages){
        ArrayList<AppInfo> pList = new ArrayList<AppInfo>();        

        List<PackageInfo> packs = getPackageManager(
            ).getInstalledPackages(0);

        for(int i = 0; i < packs.size(); i++){
          PackageInfo packInfo = packs.get(i);

          if((!getSysPackages) && (packInfo.versionName == null)){
            continue ;
          }

          AppInfo newInfo = new AppInfo();

          newInfo.appName = packInfo.applicationInfo.loadLabel(
              getPackageManager()).toString();
          newInfo.packageName = packInfo.packageName;   
          newInfo.versionName = packInfo.versionName;
          newInfo.versionCode = packInfo.versionCode;
          newInfo.icon = packInfo.applicationInfo.loadIcon(
              getPackageManager());

          pList.add(newInfo);
        }
        return pList; 
      }

      private List<ResolveInfo> createActivityList(){
        List<ResolveInfo> aList = packMan.queryIntentActivities(mainIntent, 0);

        Collections.sort(aList, 
            new ResolveInfo.DisplayNameComparator(packMan)); 

        return aList;
      }

      private void packageDebug(){
        if(null == packageList){
          return;
        }

        for(int i = 0; i < packageList.size(); ++i){
          Log.v("PACKINFO: ", "\t" + 
              packageList.get(i).appName + "\t" + 
              packageList.get(i).packageName + "\t" + 
              packageList.get(i).className + "\t" +
              packageList.get(i).versionName + "\t" + 
              packageList.get(i).versionCode);
        }
      }

      private void activityDebug(){
        if(null == activityList){
          return;
        }

        for(int i = 0; i < activityList.size(); i++){ 
          ActivityInfo currentActivity = activityList.get(
              i).activityInfo;
          Log.v("ACTINFO", 
              "pName=" 
              + currentActivity.applicationInfo.packageName +
              " cName=" + currentActivity.name);
        }
      }

      private void addClassNamesToPackageList(){
        if(null == activityList || null == packageList){
          return;
        }

        String tempName = "";

        for(int i = 0; i < packageList.size(); ++i){
          tempName = packageList.get(i).packageName;

          for(int j = 0; j < activityList.size(); ++j){
            if(tempName.equals(activityList.get(
                    j).activityInfo.applicationInfo.packageName)){
              packageList.get(i).className = activityList.get(
                  j).activityInfo.name;
            }
          }
        }
      }
    }
  ```

Remember the AppInfo class that we made and the applauncherrow.xml layout. Well, now we'll utilize both within the custom ArrayAdapter extension we'll use to populate the data of our List. ArrayAdapters are used to fill in the data fields of a ListView widget by storing a layout(android uses the term inflate) holding data into a single row of the list.

```java
    public class ApplicationAdapter extends ArrayAdapter<AppInfo>{
      private ArrayList<AppInfo> items;
```

The constructor for our ArrayAdapter extension...

```java
        public ApplicationAdapter(Context context, int textViewResourceId, ArrayList<AppInfo> items){
          super(context, textViewResourceId, items);
          this.items = items;
        }
```

Being an ArrayAdapter extension means that we have to override the getView method, this is where the applauncherrow layout is populated with data and is used to represent each row of the ListView. To start we'll reference the applauncherrow layout and inflate it to become a view.

```java
        @Override
        public View getView(int position, View convertView, 
            ViewGroup parent){
          View view = convertView;

          if(view == null){
            LayoutInflater layout = (LayoutInflater)getSystemService(
                Context.LAYOUT_INFLATER_SERVICE);
            view = layout.inflate(R.layout.applauncherrow, null);
          }
```

Now that the view is inflated with the applauncherrow.xml layout we can now match the ImageView and TextView with the contents of a AppInfo object in preparation for moving it into the ListView.

```java
            AppInfo appInfo = items.get(position);
          if(appInfo != null){
            TextView appName = (TextView) view.findViewById(
                R.id.applauncherrow_appname);
            ImageView appIcon = (ImageView) view.findViewById(
                R.id.applauncherrow_icon);

            if(appName != null){
              appName.setText(appInfo.getAppName());
            }
            if(appIcon != null){
              appIcon.setImageDrawable(appInfo.getIcon());
            }
          }

          return view;
        }
    }
```

Here is the complete ApplicationAdapter class, you should add it to your text file.

```java
    public class ApplicationAdapter extends ArrayAdapter<AppInfo>{
      private ArrayList<AppInfo> items;

      public ApplicationAdapter(Context context, int textViewResourceId, 
          ArrayList<AppInfo> items){
        super(context, textViewResourceId, items);
        this.items = items;
      }

      @Override
        public View getView(int position, View convertView, 
            ViewGroup parent){
          View view = convertView;

          if(view == null){
            LayoutInflater layout = (LayoutInflater)getSystemService(
                Context.LAYOUT_INFLATER_SERVICE);
            view = layout.inflate(R.layout.applauncherrow, null);
          }

          AppInfo appInfo = items.get(position);
          if(appInfo != null){
            TextView appName = (TextView) view.findViewById(
                R.id.applauncherrow_appname);
            ImageView appIcon = (ImageView) view.findViewById(
                R.id.applauncherrow_icon);

            if(appName != null){
              appName.setText(appInfo.getAppName());
            }
            if(appIcon != null){
              appIcon.setImageDrawable(appInfo.getIcon());
            }
          }

          return view;
        }
    }
```

We are done with the utility classes so the next step is to add some methods to the AppLauncher class itself. The first one we're going to add is a method called getApps() which stores the pacakageList from an Applications object and passes it off to Java Runnable to be ran on a thread.

```java
    private void getApps(){
      try{
        myApps = new Applications(getPackageManager());
        packageList = myApps.getPackageList();
      }
      catch(Exception exception){
        Log.e("BACKGROUND PROC:", exception.getMessage());
      }
      this.runOnUiThread(returnRes);
    }
```

If you look at the getApps() method the last line before the class ends is a method called this.runOnUiThread(returnRes), now what this means is that the main thread will be locked while we pump AppInfo objects into our ListView via the ArrayAdapter. If you are experienced with concurrent programming you might be wondering why lock the mainUIThread, the answer is because our app can't do anything until all objects have been added to the list. If we by chance were dynamically loading things from the Internet via HTTP requests then we would opt instead for a lazy loader which spawns a thread for each view object pumped into the ListVIew and the list would slowly populate as each item was fetched live from the web. So anyways here is our Runnable method that checks first that the packageList exists and then uses an object from our ApplicationAdapter to fill up our ListView widget.

```java
    private Runnable returnRes = new Runnable(){
      public void run(){
        if(packageList != null && packageList.size() > 0){
          appAdapter.notifyDataSetChanged();

          for(int i = 0; i < packageList.size(); ++i){
            appAdapter.add(packageList.get(i));
          }
        }
        progressDialog.dismiss();
        appAdapter.notifyDataSetChanged();
      }
    };
```

We're almost done so now open up your Eclipse IDE to the AppLauncher project and click on the AppLauncher.java class. If you remember from earlier where we left off go ahead and add the data members below to the AppLauncher class; notice the line numbers for reference.

```java
  ApplicationAdapter appAdapter = null;
  ProgressDialog progressDialog = null; 
  Runnable viewApps = null;
  ArrayList<AppInfo> packageList = null;
  Applications myApps = null;
```

For the onCreate() method there are some things you sould notice. First since AppLauncher is a ListActivity extension it inherits the setListAdapter() method. Second we'll  initialize the viewApps Runnable to call our getApps() within its run(). This means that any thread created with the viewApps as it's runnable will load up our packages into the ListView. In addition since getApps() locks the mainUIThread users of this app won't be able to do anything until the thread finishes.

```java
    public void onCreate(Bundle savedInstanceState){
      super.onCreate(savedInstanceState);

      this.setContentView(R.layout.applauncher);

      packageList = new ArrayList<AppInfo>();
      appAdapter = new ApplicationAdapter(this, R.layout.applauncherrow,
          packageList);

      this.setListAdapter(appAdapter);

      viewApps = new Runnable(){
        public void run(){
          getApps();
        }
      };

      Thread appLoaderThread = new Thread(null, viewApps, 
          "AppLoaderThread");
      appLoaderThread.start();
```

Now that the thread has started and the app has been officially locked, how do we notify the user? The answer is with the android.app.ProgressDialog widget. Remember those loading screen from popular video games, that's all ProgressDialogs do.

```java
        progressDialog = ProgressDialog.show(AppLauncher.this, "Hold on...", "Loading your apps...", true);
    }
```

Right now our app can successfully load up a list of Icons and application names but how then do we launch the apps the user touches from our list? The answer is via starting a new intent by overriding the onListItemClick method. So go open up your text file that contains the utility classes and methods and add the onListItemClick() method to it.

```java
    @Override
    protected void onListItemClick(ListView list, View view, int position, 
        long id){
      super.onListItemClick(list, view, position, id);

      AppInfo rowClicked = (AppInfo)this.getListAdapter().getItem(
          position);

      Intent startApp = new Intent();
      ComponentName component = new ComponentName(
          rowClicked.getPackageName(), 
          rowClicked.getClassName());
      startApp.setComponent(component);
      startApp.setAction(Intent.ACTION_MAIN);

      startActivity(startApp);
    }
```

Before you run the AppLauncher, be sure to copy and paste the classes and methods into the AppLauncher class so it resembles the complete file below.

```java
  package org.example.hello;

  import java.util.ArrayList;
  import java.util.Collections;
  import java.util.List;

  import android.app.ListActivity;
  import android.app.ProgressDialog;
  import android.content.ComponentName;
  import android.content.Context;
  import android.content.Intent;
  import android.content.pm.ActivityInfo;
  import android.content.pm.PackageInfo;
  import android.content.pm.PackageManager;
  import android.content.pm.ResolveInfo;
  import android.graphics.drawable.Drawable;
  import android.os.Bundle;
  import android.util.Log;
  import android.view.LayoutInflater;
  import android.view.View;
  import android.view.ViewGroup;
  import android.widget.ArrayAdapter;
  import android.widget.ImageView;
  import android.widget.ListView;
  import android.widget.TextView;

  public class AppLauncher extends ListActivity{
    ApplicationAdapter appAdapter = null;
    ProgressDialog progressDialog = null; 
    Runnable viewApps = null;
    ArrayList<AppInfo> packageList = null;
    Applications myApps = null;

    public void onCreate(Bundle savedInstanceState){
      super.onCreate(savedInstanceState);

      this.setContentView(R.layout.applauncher);

      packageList = new ArrayList<AppInfo>();
      appAdapter = new ApplicationAdapter(this, R.layout.applauncherrow,
          packageList);

      this.setListAdapter(appAdapter);

      viewApps = new Runnable(){
        public void run(){
          getApps();
        }
      };

      Thread appLoaderThread = new Thread(null, viewApps, 
          "AppLoaderThread");
      appLoaderThread.start();

      progressDialog = ProgressDialog.show(AppLauncher.this, 
          "Hold on...", "Loading your apps...", true);
    }

    public class Applications{
      private ArrayList<AppInfo> packageList = null;
      private List<ResolveInfo> activityList = null;
      private Intent mainIntent = new Intent(Intent.ACTION_MAIN, null);
      private PackageManager packMan = null;

      public Applications(PackageManager packManager){
        packMan = packManager;
        packageList = this.createPackageList(false);
        activityList = this.createActivityList();
        this.addClassNamesToPackageList();
      }

      public ArrayList<AppInfo> getPackageList(){
        return packageList;
      }

      public List<ResolveInfo> getActivityList(){
        return activityList;
      }

      private ArrayList<AppInfo> createPackageList(boolean getSysPackages){
        ArrayList<AppInfo> pList = new ArrayList<AppInfo>();        

        List<PackageInfo> packs = getPackageManager(
            ).getInstalledPackages(0);

        for(int i = 0; i < packs.size(); i++){
          PackageInfo packInfo = packs.get(i);

          if((!getSysPackages) && (packInfo.versionName == null)){
            continue ;
          }

          AppInfo newInfo = new AppInfo();

          newInfo.appName = packInfo.applicationInfo.loadLabel(
              getPackageManager()).toString();
          newInfo.packageName = packInfo.packageName;   
          newInfo.versionName = packInfo.versionName;
          newInfo.versionCode = packInfo.versionCode;
          newInfo.icon = packInfo.applicationInfo.loadIcon(
              getPackageManager());

          pList.add(newInfo);
        }
        return pList; 
      }

      private List<ResolveInfo> createActivityList(){
        List<ResolveInfo> aList = packMan.queryIntentActivities(mainIntent, 0);

        Collections.sort(aList, 
            new ResolveInfo.DisplayNameComparator(packMan)); 

        return aList;
      }

      private void packageDebug(){
        if(null == packageList){
          return;
        }

        for(int i = 0; i < packageList.size(); ++i){
          Log.v("PACKINFO: ", "\t" + 
              packageList.get(i).appName + "\t" + 
              packageList.get(i).packageName + "\t" + 
              packageList.get(i).className + "\t" +
              packageList.get(i).versionName + "\t" + 
              packageList.get(i).versionCode);
        }
      }

      private void activityDebug(){
        if(null == activityList){
          return;
        }

        for(int i = 0; i < activityList.size(); i++){ 
          ActivityInfo currentActivity = activityList.get(
              i).activityInfo;
          Log.v("ACTINFO", 
              "pName=" 
              + currentActivity.applicationInfo.packageName +
              " cName=" + currentActivity.name);
        }
      }

      private void addClassNamesToPackageList(){
        if(null == activityList || null == packageList){
          return;
        }

        String tempName = "";

        for(int i = 0; i < packageList.size(); ++i){
          tempName = packageList.get(i).packageName;

          for(int j = 0; j < activityList.size(); ++j){
            if(tempName.equals(activityList.get(
                    j).activityInfo.applicationInfo.packageName)){
              packageList.get(i).className = activityList.get(
                  j).activityInfo.name;
            }
          }
        }
      }
    }

    public class AppInfo{
      private String appName = "";
      private String packageName = "";
      private String className = "";
      private String versionName = "";
      private Integer versionCode = 0;
      private Drawable icon = null;

      public String getAppName(){
        return appName;
      }

      public String getPackageName(){
        return packageName;
      }

      public String getClassName(){
        return className;
      }

      public String getVersionName(){
        return versionName;
      }

      public Integer getVersionCode(){
        return versionCode;
      }

      public Drawable getIcon(){
        return icon;
      }
    }

    public class ApplicationAdapter extends ArrayAdapter<AppInfo>{
      private ArrayList<AppInfo> items;

      public ApplicationAdapter(Context context, int textViewResourceId, 
          ArrayList<AppInfo> items){
        super(context, textViewResourceId, items);
        this.items = items;
      }

      @Override
        public View getView(int position, View convertView, 
            ViewGroup parent){
          View view = convertView;

          if(view == null){
            LayoutInflater layout = (LayoutInflater)getSystemService(
                Context.LAYOUT_INFLATER_SERVICE);
            view = layout.inflate(R.layout.applauncherrow, null);
          }

          AppInfo appInfo = items.get(position);
          if(appInfo != null){
            TextView appName = (TextView) view.findViewById(
                R.id.applauncherrow_appname);
            ImageView appIcon = (ImageView) view.findViewById(
                R.id.applauncherrow_icon);

            if(appName != null){
              appName.setText(appInfo.getAppName());
            }
            if(appIcon != null){
              appIcon.setImageDrawable(appInfo.getIcon());
            }
          }

          return view;
        }
    }

    private void getApps(){
      try{
        myApps = new Applications(getPackageManager());
        packageList = myApps.getPackageList();
      }
      catch(Exception exception){
        Log.e("BACKGROUND PROC:", exception.getMessage());
      }
      this.runOnUiThread(returnRes);
    }

    private Runnable returnRes = new Runnable(){
      public void run(){
        if(packageList != null && packageList.size() > 0){
          appAdapter.notifyDataSetChanged();

          for(int i = 0; i < packageList.size(); ++i){
            appAdapter.add(packageList.get(i));
          }
        }
        progressDialog.dismiss();
        appAdapter.notifyDataSetChanged();
      }
    };

    @Override
      protected void onListItemClick(ListView list, View view, int position, 
          long id){
        super.onListItemClick(list, view, position, id);

        AppInfo rowClicked = (AppInfo)this.getListAdapter().getItem(
            position);

        Intent startApp = new Intent();
        ComponentName component = new ComponentName(
            rowClicked.getPackageName(), 
            rowClicked.getClassName());
        startApp.setComponent(component);
        startApp.setAction(Intent.ACTION_MAIN);

        startActivity(startApp);
      }
  }

```

Enjoy your AppLauncher.
