---
title: A Lightweight SqlLite Android tutorial
date: 2011-06-24
categories: [tutorial]
tags: [java, android]
comments: true
---
In this tutorial we'll step through the process of using the Android's builtin support for SqlLite to store a password and retrive it in a rather interesting attempt at creating a guest dialer application. When I first imagined a guest dialer I had in mind an application that would allow you to let someone use your phone without giving them total access to your incomming messages and other sensitive data. However, a lock-in application basically classifies as a malware when you think about it so whatever... at least I learned about the SqlLite API.

<!-- more -->
Before begining this tutorial make sure you have the following... 

- Java runtime and SDK installed
- Android SDK
- Some IDE which supports Android development such as Eclipse or IntelliJ IDEA(the free community edition can be used for Android Dev)
- Some familiarity at least(not much don't worry) with Android Development

Within your IDE of choice create a new Android project and call it Secure Dialer(actually you can name it whatever but I'll just refer to it as Secure Dialer throughout this tutorial).

Now locate the pre configured file called "AndroidManifest.xml".
The AndroidManifest file is the standard configuration file for Android applications.
Its where you determine which permissions you demand from the phone OS as well as where you setup the various activity screens and many other things.
Just think of the AndroidManifest as the app's system profile if that helps.
To start us off lets declare the permissions we need the end user to accept in order for our application to function correctly.

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest 
xmlns:android="http://schemas.android.com/apk/res/android"
package="org.secure.dialer"
android:versionCode="1"
android:versionName="1.0">

<uses-sdk android:minSdkVersion="8" />

<uses-permission 
android:name="android.permission.CALL_PHONE">
</uses-permission>

<uses-permission 
android:name="android.permission.READ_PHONE_STATE">
</uses-permission>
```

Next we'll fill out the <application> element; this is the element where we can declare 
the activities and setup any intent-filters which we might need as well.

```xml
<application 
android:icon="@drawable/icon" 
android:label="@string/app_name" 
android:debuggable="true">

<activity
android:name=".HomeScreen"
android:label="@string/homescreen_label">

<intent-filter>
<action android:name="android.intent.action.MAIN" />
<category android:name="android.intent.category.LAUNCHER" />
</intent-filter>

</activity>

<activity
android:name=".Dialer"
android:label="@string/dialer_label">
</activity>

<activity
android:name=".NewPassword"
android:label="@string/newpassword_label">
</activity>

<activity
android:name=".ResetPassword"
android:label="@string/resetpassword_label">
</activity>

</application>

</manifest>
```
Now go ahead and save the new AndroidManifest.xml with our changes in place.
Next up is the resource file strings.xml.

strings.xml if you need a refresher is a special resource file that is standard across Androidapps because its the file where you define all of the text strings which will appear throughout your app.

Although is practical to define strings within the .java files its considered good Android development practice to keep as many of the applications strings within the strings.xml.

You might think its crazy but for large applications it makes updating text notfications a piece of cake.
So navigate within your IDE to res/values/strings.xml or create the file if it doesn't exist.
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
<string name="app_name">SecureDialer</string>

<string name="homescreen_label">Homescreen Activity</string>
<string name="homescreen_dialer">Dialer</string>
<string name="homescreen_password">Password</string>
<string name="homescreen_exit">Exit</string>

<string name="newpassword_label">Newpassword Activity</string>
<string name="newpassword_new_text">Enter new password:</string>
<string name="newpassword_confirm_text">Repeat the password:</string>
<string name="newpassword_new_hint">Type new password here</string>
<string name="newpassword_confirm_hint">Repeat password here</string>
<string name="newpassword_back">Back</string>
<string name="newpassword_save">Save</string>

<string name="resetpassword_label">Resetpassword Activity</string>
<string name="resetpassword_old_text">Enter old password:</string>
<string name="resetpassword_old_hint">Type old password here</string>
<string name="resetpassword_new_text">Enter new password:</string>
<string name="resetpassword_new_hint">Type new password here</string>
<string name="resetpassword_confirm_text">Confirm password:</string>
<string name="resetpassword_confirm_hint">Repeat password here</string>

<string name="dialer_label">Dialer Activity</string>
<string name="dialer_dial">Dial</string>
<string name="dialer_clear">Clear</string>
<string name="dialer_done">Done</string>

<string name="dialerpassword_enter">Enter</string>
<string name="dialerpassword_nevermind">Nevermind</string>
</resources>
```
Remember all of those @string/some_name values within the AndroidManifest.xml?
Well that is how we reference the values stored within res/strings.xml.

Moving along next create the Java class file HomeScreen within your applications src folder if you want to follow along with the code I have it under <div>src/org/secure/dialer/HomeScreen.java.</div>
Don't worry about all of those string values you just typed or pasted we'll use them shortly as we introduce each activity screen.

As is normal with Android development we will first create the visual layouts and then once all our buttons and views are setup we then add Java to support the various actions we want to allow our users to make.

Be warned though that this style of visuals first and then application logic might sound strange if you're comming from a web development MVC or MVVM background in which you first design your Models before hooking up controller logic before finnally designing a UI; but don't let it get to you too much because you'll see how its much easier for you to structure your Java code since you basically build application logic on top of objects created from your visual layout.

But enough chit chat, create a new file "homescreen.xml" within <div>/res/layout/</div>

```xml
<?xml version="1.0" encoding="utf-8"?>
<!-- 
A great tutorial on how to design button themes
http://blog.androgames.net/40/custom-button-style-and-theme/
-->
<RelativeLayout 
xmlns:android="http://schemas.android.com/apk/res/android"
android:id="@+id/homescreen_relative_layout"
android:orientation="vertical"
android:layout_width="fill_parent"
android:layout_height="fill_parent">

<Button
android:id="@+id/homescreen_dialer_button"
android:layout_height="wrap_content"
android:layout_width="fill_parent"
android:text="@string/homescreen_dialer"
android:onClick="homescreen_button_click_handler"/>

<Button
android:id="@+id/homescreen_password_button"
android:layout_height="wrap_content"
android:layout_width="fill_parent"
android:layout_below="@id/homescreen_dialer_button"
android:text="@string/homescreen_password"
android:onClick="homescreen_button_click_handler"/>

<Button
android:id="@+id/homescreen_exit_button"
android:layout_height="wrap_content"
android:layout_width="fill_parent"
android:layout_below="@id/homescreen_password_button"
android:text="@string/homescreen_exit"
android:onClick="homescreen_button_click_handler"/>

</RelativeLayout>
```
The homescreen is fairly basic it will just appear as three buttons vertically tiled.
When we get to the code for the homescreen you'll see how easily you hookup code to support the android:onClick= tags from your xml file.

Now create the Java class file "HomeScreen.java" within your project's src/ folder.
Here you'll also notice a class called "PasswordDB" created, that is the object representation of our SQLite database which is the focus of the article and we'll cover it in depth later on.

```java
package com.example;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

public class HomeScreen extends Activity {

  protected PasswordDB password_db;

  /**
   * (non-Javadoc)
   * @see android.app.Activity#onCreate(android.os.Bundle)
   */
  public void onCreate(Bundle saved_instance_state){
    super.onCreate(saved_instance_state);
    this.setContentView(R.layout.homescreen);
    password_db = new PasswordDB(this);
  }

  /**
   * Manages the button click events for the HomeScreen Activity.<br />
   * Clicking exit terminates the app.<br />
   * Clicking password launches either the newpassword or resetpassword
   * activity depending on whether a password is currently stored.<br />
   * Clicking dialer launches the dialer activity.
   * @param button_clicked
   */
  public void homescreen_button_click_handler(View button_clicked){
    switch(button_clicked.getId()){
      Boolean password_found = password_db.is_password();

      case R.id.homescreen_exit_button:
      HomeScreen.this.finish();
      break;

      case R.id.homescreen_password_button:

      if(!password_found){
        Intent new_password_intent = new Intent(this.getApplicationContext(), NewPassword.class);

        this.startActivity(new_password_intent);
        HomeScreen.this.finish();
      }
      else{
        Intent reset_password_intent = new Intent(this.getApplicationContext(), ResetPassword.class);

        this.startActivity(reset_password_intent);
        HomeScreen.this.finish();
      }
      break;

      case R.id.homescreen_dialer_button:
      if(password_found) {
        Intent dialer_intent = new Intent(this.getApplicationContext(), Dialer.class);
        this.startActivity(dialer_intent);
        HomeScreen.this.finish();
      } else {
        display_toast("No password has been set yet.");
      }
      break;
    }
  }

  /**
   * Displays the string passed as a new toast
   * @param message
   */
  protected void display_toast(String message)
  {
    Toast.makeText(getApplicationContext(), message, Toast.LENGTH_SHORT).show();
  }
}
```
Pay attention to the homescreen_button_click_handler. 
Remember inside our Homescreen.xml file where we defined the onClick attribute for each of the three buttons?
Now you see how easy it is within the Java code to look up the button's unique id name and write handler code, it just becomes a switch case on the getId() method of the View which generated the click event.
To think if you tried it the other way around you would have foolishly built up three different button handler events where we have just a single button_handler for the entire Homescreen.

This style of design also makes our code very modular; if you wanted to add another button its as easy as popping in another case statement.
Looking at the button_click_handler code when the user presses the homescreen_dialer_button we launch the Dialer activity screen... lets do that.
</p>

<p>
As before we'll create the dialer layout first, so create the file "dialer.xml" within the layout directory res/layout.

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout
xmlns:android="http://schemas.android.com/apk/res/android"
android:id="@+id/dialer_relative_layout"
android:layout_width="match_parent"
android:layout_height="match_parent">

<EditText
android:id="@+id/dialer_number_edit"
android:layout_width="fill_parent"
android:layout_height="wrap_content"
android:focusable="false"/>

<Button
android:id="@+id/dialer_one"
android:layout_height="wrap_content"
android:layout_width="wrap_content"
android:text="1"
android:layout_below="@id/dialer_number_edit"
android:layout_alignLeft="@id/dialer_number_edit"
android:onClick="dialer_button_click_handler"/>

<Button
android:id="@+id/dialer_two"
android:layout_height="wrap_content"
android:layout_width="wrap_content"
android:text="2"
android:layout_below="@id/dialer_number_edit"
android:layout_toRightOf="@id/dialer_one"
android:onClick="dialer_button_click_handler"/>

<Button
android:id="@+id/dialer_three"
android:layout_height="wrap_content"
android:layout_width="wrap_content"
android:text="3"
android:layout_below="@id/dialer_number_edit"
android:layout_toRightOf="@id/dialer_two"
android:onClick="dialer_button_click_handler"/>

<Button
android:id="@+id/dialer_four"
android:layout_height="wrap_content"
android:layout_width="wrap_content"
android:text="4"
android:layout_below="@id/dialer_one"
android:layout_alignLeft="@id/dialer_one"
android:onClick="dialer_button_click_handler"/>

<Button
android:id="@+id/dialer_five"
android:layout_height="wrap_content"
android:layout_width="wrap_content"
android:text="5"
android:layout_below="@id/dialer_two"
android:layout_toRightOf="@id/dialer_four"
android:onClick="dialer_button_click_handler"/>

<Button
android:id="@+id/dialer_six"
android:layout_height="wrap_content"
android:layout_width="wrap_content"
android:text="6"
android:layout_below="@id/dialer_three"
android:layout_toRightOf="@id/dialer_five"
android:onClick="dialer_button_click_handler"/>

<Button
android:id="@+id/dialer_seven"
android:layout_height="wrap_content"
android:layout_width="wrap_content"
android:text="7"
android:layout_below="@id/dialer_four"
android:layout_alignLeft="@id/dialer_four"
android:onClick="dialer_button_click_handler"/>

<Button
android:id="@+id/dialer_eight"
android:layout_height="wrap_content"
android:layout_width="wrap_content"
android:text="8"
android:layout_below="@id/dialer_five"
android:layout_toRightOf="@id/dialer_seven"
android:onClick="dialer_button_click_handler"/>

<Button
android:id="@+id/dialer_nine"
android:layout_height="wrap_content"
android:layout_width="wrap_content"
android:text="9"
android:layout_below="@id/dialer_six"
android:layout_toRightOf="@id/dialer_eight"
android:onClick="dialer_button_click_handler"/>

<Button
android:id="@+id/dialer_pound"
android:layout_height="wrap_content"
android:layout_width="wrap_content"
android:text="#"
android:layout_below="@id/dialer_seven"
android:layout_alignLeft="@id/dialer_seven"
android:onClick="dialer_button_click_handler"/>

<Button
android:id="@+id/dialer_zero"
android:layout_height="wrap_content"
android:layout_width="wrap_content"
android:text="0"
android:layout_below="@id/dialer_eight"
android:layout_toRightOf="@id/dialer_pound"
android:onClick="dialer_button_click_handler"/>

<Button
android:id="@+id/dialer_star"
android:layout_height="wrap_content"
android:layout_width="wrap_content"
android:text="*"
android:layout_below="@id/dialer_nine"
android:layout_toRightOf="@id/dialer_zero"
android:onClick="dialer_button_click_handler"/>

<Button
android:id="@+id/dialer_dial_button"
android:layout_height="wrap_content"
android:layout_width="wrap_content"
android:text="@string/dialer_dial"
android:layout_below="@id/dialer_pound"
android:layout_alignParentLeft="true"
android:onClick="dialer_button_click_handler"/>

<Button
android:id="@+id/dialer_clear_button"
android:layout_height="wrap_content"
android:layout_width="wrap_content"
android:text="@string/dialer_clear"
android:layout_below="@id/dialer_star"
android:layout_alignParentRight="true"
android:onClick="dialer_button_click_handler"/>

<Button
android:id="@+id/dialer_done_button"
android:layout_height="wrap_content"
android:layout_width="wrap_content"
android:text="@string/dialer_done"
android:layout_below="@id/dialer_dial_button"
android:layout_centerHorizontal="true"
android:onClick="dialer_button_click_handler"/>

</RelativeLayout>
```
As you can guess all of the numerical button are what you should expect from a phone dialer.
Of intrest is the non-focusable editbox where the phonenumber will be displayed as the user types and the three buttons near the bottom; dial, clear and done.
The layout as you can see is rather plain but the interesting bits will come next when we add the Java code.
However before that we need to creat the layout for the password prompt which will display once the guest has finished making a call and might potentially have the chance to muck around with your phone.

Add the file "dialerpassword.xml" to the res/layout folder.

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout
xmlns:android="http://schemas.android.com/apk/res/android"
android:id="@+id/dialerpassword_relative_layout"
android:layout_width="match_parent"
android:layout_height="match_parent">

<EditText
android:id="@+id/dialerpassword_password_edit"
android:layout_width="fill_parent"
android:layout_height="wrap_content"
android:hint="@string/newpassword_confirm_hint"
android:singleLine="true"/>

<Button
android:id="@+id/dialerpassword_enter_button"
android:layout_height="wrap_content"
android:layout_width="wrap_content"
android:text="@string/dialerpassword_enter"
android:layout_below="@id/dialerpassword_password_edit"
android:layout_alignLeft="@id/dialerpassword_password_edit"
android:onClick="dialer_button_click_handler"/>

<Button
android:id="@+id/dialerpassword_nevermind_button"
android:layout_height="wrap_content"
android:layout_width="wrap_content"
android:text="@string/dialerpassword_nevermind"
android:layout_below="@id/dialerpassword_password_edit"
android:layout_alignRight="@id/dialerpassword_password_edit"
android:onClick="dialer_button_click_handler"/>

</RelativeLayout>
```
Finally create the Java class file "Dialer.java" and place it within your src/ folder.
```java
package com.example;

import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.telephony.TelephonyManager;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.telephony.PhoneStateListener;

public class Dialer extends HomeScreen {

  private String current_password = null;
  private EditText dialer_phone_number_field = null;
  private Dialog password_dialog = null;
  private EditText dialog_password_field = null;
  private PhoneStateListener phone_state_listener = null;
  private TelephonyManager telephony_manager = null;

  /*
   * (non-Javadoc)
   * @see android.app.Activity#onCreate(android.os.Bundle)
   */
  public void onCreate(Bundle saved_instance_state){
    // Hides both the title and status bar
    // Must be called calling super.onCreate()
    this.requestWindowFeature(Window.FEATURE_NO_TITLE);
    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
        WindowManager.LayoutParams.FLAG_FULLSCREEN);

    super.onCreate(saved_instance_state);
    this.setContentView(R.layout.dialer);

    current_password = password_db.get_password();
    dialer_phone_number_field = (EditText)findViewById(R.id.dialer_number_edit);
    phone_state_listener = new CallEndedListener();
    telephony_manager = (TelephonyManager) this.getSystemService(TELEPHONY_SERVICE);
  }

  /**
   * Manages the button click events for the HomeScreen Activity.<br />
   * Clicking the numpad adds the number to the dial box<br />
   * Clicking dial calls the number within the dial box<br />
   * Clicking clear erases the dial box<br />
   * Clicking done prompts for the password<br />
   * @param button_clicked
   */
  public void dialer_button_click_handler(View button_clicked){
    StringBuilder phone_number = new StringBuilder();

    switch(button_clicked.getId()){
      case R.id.dialer_one:
        phone_number.append('1');
        dialer_phone_number_field.append(phone_number);
        phone_number.deleteCharAt(0);
        break;

      case R.id.dialer_two:
        phone_number.append('2');
        dialer_phone_number_field.append(phone_number);
        phone_number.deleteCharAt(0);
        break;

      case R.id.dialer_three:
        phone_number.append('3');
        dialer_phone_number_field.append(phone_number);
        phone_number.deleteCharAt(0);
        break;

      case R.id.dialer_four:
        phone_number.append('4');
        dialer_phone_number_field.append(phone_number);
        phone_number.deleteCharAt(0);
        break;

      case R.id.dialer_five:
        phone_number.append('5');
        dialer_phone_number_field.append(phone_number);
        phone_number.deleteCharAt(0);
        break;

      case R.id.dialer_six:
        phone_number.append('6');
        dialer_phone_number_field.append(phone_number);
        phone_number.deleteCharAt(0);
        break;

      case R.id.dialer_seven:
        phone_number.append('7');
        dialer_phone_number_field.append(phone_number);
        phone_number.deleteCharAt(0);
        break;

      case R.id.dialer_eight:
        phone_number.append('8');
        dialer_phone_number_field.append(phone_number);
        phone_number.deleteCharAt(0);
        break;

      case R.id.dialer_nine:
        phone_number.append('9');
        dialer_phone_number_field.append(phone_number);
        phone_number.deleteCharAt(0);
        break;

      case R.id.dialer_zero:
        phone_number.append('0');
        dialer_phone_number_field.append(phone_number);
        phone_number.deleteCharAt(0);
        break;

      case R.id.dialer_star:
        phone_number.append('*');
        dialer_phone_number_field.append(phone_number);
        phone_number.deleteCharAt(0);
        break;

      case R.id.dialer_pound:
        phone_number.append('#');
        dialer_phone_number_field.append(phone_number);
        phone_number.deleteCharAt(0);
        break;

        // Copies the phone_number_field to a StringBuilder,
        // deletes the last digit and dumps the StringBuilder
        // back to the phone_number_field
      case R.id.dialer_clear_button:
        if(!dialer_phone_number_field.getText().toString().equals("")){
          for(int i = 0; i < dialer_phone_number_field.getText().toString().length(); ++i){
            phone_number.append(dialer_phone_number_field.getText().toString().charAt(i));
          }

          phone_number.deleteCharAt(phone_number.length() - 1);
          dialer_phone_number_field.setText(phone_number.toString());
          phone_number.setLength(0);
        }
        break;

        // Launches the dialog box prompting for the new password
      case R.id.dialer_done_button:
        password_dialog = make_password_dialog(this);
        password_dialog.show();
        break;

      case R.id.dialer_dial_button:
        if(dialer_phone_number_field.getText().toString().equals("")){
          display_toast("Enter a phone number to dial");
        }
        else{
          perform_dial();
        }
        break;
    }
  }

  /**
   * Creates a dialog for the password confirmation
   * @param context
   * @return
   */
  public Dialog make_password_dialog(Context context){
    Dialog dialog = new Dialog(context);

    dialog.setContentView(R.layout.dialerpassword);
    dialog.setTitle("Password?");
    dialog.setCancelable(true);

    dialog_password_field = (EditText)dialog.findViewById(R.id.dialerpassword_password_edit);
    Button dialog_enter = (Button)dialog.findViewById(R.id.dialerpassword_enter_button);
    dialog_enter.setOnClickListener(dialog_click_listener);
    Button dialog_nevermind = (Button)dialog.findViewById(R.id.dialerpassword_nevermind_button);
    dialog_nevermind.setOnClickListener(dialog_click_listener);

    return dialog;
  }

  /**
   * Custom View.OnClickListener interface for the password
   * dialog buttons.
   */
  public OnClickListener dialog_click_listener = new View.OnClickListener(){

    /**
     * Clicking nevermind closes the dialog menu<br />
     * Clicking done validates the password entered.
     * (non-Javadoc)
     * @see android.view.View.OnClickListener#onClick(android.view.View)
     */
    @Override
      public void onClick(View button_clicked) {
        switch(button_clicked.getId()){
          case R.id.dialerpassword_nevermind_button:
            password_dialog.dismiss();
            break;

          case R.id.dialerpassword_enter_button:
            if(validate_password(dialog_password_field.getText().toString().trim())){
              password_dialog.dismiss();
              Intent homescreen_intent = new Intent(getApplicationContext(), HomeScreen.class);
              startActivity(homescreen_intent);
              Dialer.this.finish();
            }
            break;
        }
      }
  };

  /**
   * Validates the password typed by the user to check if it
   * matches the current password stored in the database.
   * @param password_value
   * @return true if the password was valid
   */
  private Boolean validate_password(String password_value){
    if(!password_value.equals(current_password)){
      display_toast("Incorrect password!");
      this.dialog_password_field.setText("");
      return false;
    }
    else{
      return true;
    }
  }

  /**
   * A small hack to disable the back button
   * (non-Javadoc)
   * @see android.app.Activity#onBackPressed()
   */
  @Override
    public void onBackPressed() {
      display_toast("The back button is disabled");
      return;
    }

  /**
   * Lets the user call using the dial button
   * (non-Javadoc)
   * @see android.app.Activity#onKeyDown(int, android.view.KeyEvent)
   */
  public boolean onKeyDown(int keyCode, KeyEvent event){
    if(keyCode == KeyEvent.KEYCODE_CALL){
      perform_dial();
      return true;
    }

    return false;
  }

  /**
   * Dials the desired phone number and creates a listener to
   * to capture the state when the phone call has ended.
   */
  public void perform_dial(){
    if(dialer_phone_number_field != null){
      try{
        telephony_manager.listen(phone_state_listener, PhoneStateListener.LISTEN_CALL_STATE);
        Intent phone_call = new Intent(Intent.ACTION_CALL,
            Uri.parse("tel:" + dialer_phone_number_field.getText()));
        startActivity(phone_call);
      }
      catch(Exception error){
        error.printStackTrace();
      }
    }
  }

  /**
   *
   * @author Alex Bredariol Grilo
   * {@link www.umamao.com}
   */
  private class CallEndedListener extends PhoneStateListener {
    boolean called = false;

    /* Waits until the phone call is done and restarts the activity.
     *
     * (non-Javadoc)
     * @see android.telephony.PhoneStateListener#onCallStateChanged(int, java.lang.String)
     */
    @Override
      public void onCallStateChanged(int state, String incoming_number) {
        if(called && state == TelephonyManager.CALL_STATE_IDLE){
          called = false;

          telephony_manager.listen(this,
              PhoneStateListener.LISTEN_NONE);

          try{
            Dialer.this.finish();
            Intent dialer_restart = new Intent(Dialer.this, Dialer.class);
            dialer_restart.setAction(Intent.ACTION_MAIN);
            startActivity(dialer_restart);
          }
          catch(Exception e){
            e.printStackTrace();
          }
        }
        else{
          // When the phone is not in idle mode it is currently
          // in use
          if(state == TelephonyManager.CALL_STATE_OFFHOOK){
            called = true;
          }
        }
      }
  }
}
```
Stepping through the code for the Dialer class you'll notice that its relatively simple.
Since the activity is once again button based the meat of the code involves deciding what we should do once each button handler event is triggered.

A quick thing to notice is that the Dialer class we defined extends the HomeScreen where we intialized the password database object; so all of the password interaction is due to our great use of inheritance.

Anyhow the basic idea for the Dialer activity is the following...

1. Pressing the numeric keys lets the user enter a phonenumber
2. The clear button should delete a numeric character one at a time
3. Dial... makes a phonecall
4. Done should prompt the user for a password, if correct unlocks the app

What you'll notice here is that the prompting for a password is how we make the dialer somewhat secure. If the wrong one is entered the user should theorectically have no other access to your phone meaning they can't touch your apps, peek at your emails or do anything else.
Looking at the code you'll see the function make_password_dialog() which creates the kinda mini embedded activity when the user triggers the dialer_done_button click event.

The remaining code within the Dialer class involves the TelephonyManager which is the Android API's way of letting developers controller the actions of the phone listener and receiver.
Its rather easy to understand after you force yourself to think of the Phone as advancing across as series of states such as IDLE, OFFHOOK, LISTEN_CALL and create a mental map of those states as you normally talk on the phone. Now we'll return back to the Homescreen and add in the code to support the new and reset password buttons. 

Each of the buttons will have a layout and Java class file associated. Lets begin with the NewPassword class, create the file "newpassword.xml" within the res/layout folder of your Android project. The xml rather easy to understand as its just a regular enter password and repeat it once type of layout you've seen all over the place.

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout
xmlns:android="http://schemas.android.com/apk/res/android"
android:id="@+id/newpassword_relative_layout" 
android:layout_width="match_parent"
android:layout_height="match_parent">

<TextView 
android:id="@+id/newpassword_new_password_text" 
android:layout_width="fill_parent" 
android:layout_height="wrap_content" 
android:text="@string/newpassword_new_text"/>

<EditText 
android:id="@+id/newpassword_new_password_edit" 
android:layout_width="fill_parent" 
android:layout_height="wrap_content" 
android:hint="@string/newpassword_new_hint"
android:layout_below="@id/newpassword_new_password_text"
android:singleLine="true"/>

<TextView 
android:id="@+id/newpassword_confirm_password_text" 
android:layout_width="fill_parent" 
android:layout_height="wrap_content" 
android:text="@string/newpassword_confirm_text"
android:layout_below="@id/newpassword_new_password_edit"/>

<EditText 
android:id="@+id/newpassword_confirm_password_edit" 
android:layout_width="fill_parent" 
android:layout_height="wrap_content" 
android:hint="@string/newpassword_confirm_hint"
android:layout_below="@id/newpassword_confirm_password_text"
android:singleLine="true"/>

<Button
android:id="@+id/newpassword_back_button"
android:layout_height="wrap_content"
android:layout_width="wrap_content"
android:text="@string/newpassword_back"
android:layout_below="@id/newpassword_confirm_password_edit"
android:layout_alignLeft="@id/newpassword_confirm_password_edit"
android:onClick="newpassword_button_click_handler"/>

<Button
android:id="@+id/newpassword_save_button"
android:layout_height="wrap_content"
android:layout_width="wrap_content"
android:text="@string/newpassword_save"
android:layout_below="@id/newpassword_confirm_password_edit"
android:layout_alignRight="@id/newpassword_confirm_password_edit"
android:onClick="newpassword_button_click_handler"/>

</RelativeLayout>
```
The Java code should be titled "NewPassword.java" and stored within the src/ folder of your project.
The code consist of letting the user enter a password into the editText box, and validate that the repeated value matches the original.
Once the validation has been accepted we make a DB transaction and store the password.
```java
package com.example;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

public class NewPassword extends HomeScreen {

  private EditText new_password_field = null;
  private EditText confirm_password_field = null;

  /*
   * (non-Javadoc)
   * @see android.app.Activity#onCreate(android.os.Bundle)
   */
  public void onCreate(Bundle saved_instance_state){
    super.onCreate(saved_instance_state);
    this.setContentView(R.layout.newpassword);

    new_password_field = (EditText)findViewById(
        R.id.newpassword_new_password_edit);
    confirm_password_field = (EditText)findViewById(
        R.id.newpassword_confirm_password_edit);
  }

  /**
   * Manages the button click events for the NewPassword Activity.<br />
   * Clicking back returns to the HomeScreen.<br />
   * Clicking save will save the password if it passes the validation
   * check.
   * @param button_clicked
   */
  public void newpassword_button_click_handler(View button_clicked){
    Intent homescreen_intent = new Intent(this.getApplicationContext(),
        HomeScreen.class);

    switch(button_clicked.getId()){
      case R.id.newpassword_back_button:
        this.startActivity(homescreen_intent);
        NewPassword.this.finish();
        break;

      case R.id.newpassword_save_button:
        if(validate_password(
              new_password_field.getText().toString().trim(),
              confirm_password_field.getText().toString().trim()
              )){
          this.startActivity(homescreen_intent);
          NewPassword.this.finish();
        }
        break;
    }
  }

  /**
   * When both the new password and the confirmation password
   * match the new password is saved. Else when the passwords
   * don't match or are empty an error message is displayed.
   * @return true if both password fields match else false
   */
  private Boolean validate_password(String new_password_value,
      String confirm_password_value){

    if(!new_password_value.equals(confirm_password_value)){
      display_toast("Your Passwords do not match");
      return false;
    }
    else if(new_password_value.equals("") &&
        new_password_value.equals("")){
      display_toast("Your Passwords cannot be empty");
      return false;
    }
    else{
      password_db.set_password(new_password_value);
      display_toast("Your new password was saved!");
      return true;
    }
  }
}
```
If you pay enough attention to the newpassword xml and Java code behind you'll have no trouble at all with the resetpassword code as its very similar.
We'll begin with the layout for the resetpassword code, so create the file "resetpassword.xml" within the res/layout/ folder of your project.
```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout
xmlns:android="http://schemas.android.com/apk/res/android"
android:id="@+id/resetpassword_relative_layout" 
android:layout_width="match_parent"
android:layout_height="match_parent">

<TextView 
android:id="@+id/resetpassword_old_password_text" 
android:layout_width="fill_parent" 
android:layout_height="wrap_content" 
android:text="@string/resetpassword_old_text"/>

<EditText 
android:id="@+id/resetpassword_old_password_edit" 
android:hint="@string/resetpassword_old_hint"
android:layout_width="fill_parent" 
android:layout_height="wrap_content" 
android:layout_below="@id/resetpassword_old_password_text"
android:singleLine="true"
android:maxLength="10"/>

<TextView 
android:id="@+id/resetpassword_new_password_text" 
android:layout_width="fill_parent" 
android:layout_height="wrap_content" 
android:text="@string/resetpassword_new_text"
android:layout_below="@id/resetpassword_old_password_edit"/>

<EditText 
android:id="@+id/resetpassword_new_password_edit" 
android:hint="@string/resetpassword_new_hint"
android:layout_width="fill_parent" 
android:layout_height="wrap_content" 
android:layout_below="@id/resetpassword_new_password_text"
android:singleLine="true"
android:maxLength="10"/>

<TextView 
android:id="@+id/resetpassword_confirm_password_text" 
android:layout_width="fill_parent" 
android:layout_height="wrap_content" 
android:text="@string/resetpassword_confirm_text"
android:layout_below="@id/resetpassword_new_password_edit"/>

<EditText 
android:id="@+id/resetpassword_confirm_password_edit" 
android:hint="@string/resetpassword_confirm_hint"
android:layout_width="fill_parent" 
android:layout_height="wrap_content" 
android:layout_below="@id/resetpassword_confirm_password_text"
android:singleLine="true"
android:maxLength="10"/>

<Button
android:id="@+id/resetpassword_back_button"
android:layout_height="wrap_content"
android:layout_width="wrap_content"
android:text="@string/newpassword_back"
android:layout_below="@id/resetpassword_confirm_password_edit"
android:layout_alignLeft="@id/resetpassword_confirm_password_edit"
android:onClick="reset_button_click_handler"/>

<Button
android:id="@+id/resetpassword_save_button"
android:layout_height="wrap_content"
android:layout_width="wrap_content"
android:text="@string/newpassword_save"
android:layout_below="@id/resetpassword_confirm_password_edit"
android:layout_alignRight="@id/resetpassword_confirm_password_edit"
android:onClick="reset_button_click_handler"/>

</RelativeLayout>
```
The addition here for the reset password xml layout is the entry for the current or old password. We going to assert that the value entered there must be found within the database before we can create a new transaction to store the value of a new password. Now create the file within the src/ folder of your project called "ResetPassword.java". I was extra careful to write useful comments within this file so be sure to read them before moving on to the last part.
```java
package com.example;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

/**
 * Resets the applications' password used to escape from the dialer activity
 */
public class ResetPassword extends HomeScreen {

  private String current_password = null;
  private EditText new_password_field = null;
  private EditText confirm_password_field = null;
  private EditText old_password_field = null;

  /*
   * (non-Javadoc)
   * @see android.app.Activity#onCreate(android.os.Bundle)
   */
  public void onCreate(Bundle saved_instance_state){
    super.onCreate(saved_instance_state);
    this.setContentView(R.layout.resetpassword);

    current_password = password_db.get_password();
    new_password_field = (EditText)findViewById(
        R.id.resetpassword_new_password_edit);
    confirm_password_field = (EditText)findViewById(
        R.id.resetpassword_confirm_password_edit);
    old_password_field = (EditText)findViewById(
        R.id.resetpassword_old_password_edit);
  }

  /**
   * Manages the button click events for the NewPassword Activity.<br />
   * Clicking back returns to the HomeScreen.<br />
   * Clicking save will save the password if it passes the validation
   * check.
   * @param button_clicked
   */
  public void reset_button_click_handler(View button_clicked){
    Intent homescreen_intent = new Intent(this.getApplicationContext(),
        HomeScreen.class);

    switch(button_clicked.getId()){
      case R.id.resetpassword_back_button:
        this.startActivity(homescreen_intent);
        ResetPassword.this.finish();
        break;

      case R.id.resetpassword_save_button:
        if(validate_password(
              old_password_field.getText().toString().trim(),
              new_password_field.getText().toString().trim(),
              confirm_password_field.getText().toString().trim()
              )){
          this.startActivity(homescreen_intent);
          ResetPassword.this.finish();
        }
        break;
    }
  }

  /**
   * When the new password equals the confirmation password
   * and the old password equals the current password 
   * then the new password is reset. Else when the passwords
   * don't match or are empty or the old password doesn't match the
   * current password then an error message is displayed.
   * @return true if both password fields match else false
   */
  private Boolean validate_password(String old_password_value,
      String new_password_value, String confirm_password_value){
    if(!old_password_value.equals(current_password)){
      display_toast("Your old password is incorrect");
      return false;
    }
    else if(!new_password_value.equals(confirm_password_value)){
      display_toast("Your Passwords do not match");
      return false;
    }
    else if(new_password_value.equals("") &&
        confirm_password_value.equals("")){
      display_toast("Your Passwords cannot be empty");
      return false;
    }
    else{
      password_db.reset_password(new_password_value);
      display_toast("Your new password was saved!");
      return true;
    }
  }
}
```
We are now ready to explore the basics of the Android SQLite API.
Within the src folder of your project add the file "PasswordDB.java".
```java
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

/**
 * Represents the Password Database
 * @author Demetrious
 *
 */
public class PasswordDB extends SQLiteOpenHelper {

  private static final String db_name = "PasswordDB";
  private static final String password_table = "Passwords";
  private static final String password_col_password_number = "PassNo";
  private static final String password_col_password_value = "PassVal";
```
The static strings we declared above represent the name of our database, table and two columns.
The password number or PassNo will be the primary key and the string value
of the password(this is not a mission critical app so we're not going to encrpyt it) will be its stored value.

Next we'll write the constructor for the database which will create the databasewith the name we gave it within the string db_name.
```java
    /**
     * 
     * @param context
     */
    public PasswordDB(Context context) {
      super(context, db_name, null, 1);
    }
```
With our database in place the next step is to create the Table.
The code below will accomplish just that, look at the JavaDoc I wrote to see the corresponding SQL.
```java
    /**
     * Invokes the SQL statements below.
     *  <p>
     *belowCREATE TABLE IF NOT EXISTS Password( <br />
     *brPassNoINTEGER PRIMARY KEY, <br />
     *brPassValVARCHAR(10) NOT NULL <br />
     *br);
     * </p>
     * (non-Javadoc)
     * @see android.database.sqlite.SQLiteOpenHelper#onCreate(android.database.sqlite.SQLiteDatabase)
     */
    @Override
    public void onCreate(SQLiteDatabase db) {
      db.execSQL("CREATE TABLE IF NOT EXISTS " + password_table + "(" + 
          password_col_password_number + " INTEGER PRIMARY KEY," +
          password_col_password_value + " VARCHAR(10) NOT NULL" +
          ");");
    }
```
The next method onUpgrade() is a required function but we're not going to actually implement it since we don't need it for this example.
```java
    /**
     * (non-Javadoc)
     * @see android.database.sqlite.SQLiteOpenHelper#onUpgrade(android.database.sqlite.SQLiteDatabase, int, int)
     */
    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, 
        int newVersion) {
    }
```
We'll of course need a way to insert a new password into our database.
The method set_password does just that. All its doing is calling a basic SQL insert into query but using the Android API helper method insert();
```java
    /**
     * Inserts a new password into the Password DB via the following SQL.
     * <p>
     * INSERT INTO Password (PassVal)<br />
     * VALUES('new_password');
     * </p>
     * @param new_password
     */
    public void set_password(String new_password){
      SQLiteDatabase db = this.getWritableDatabase();

      ContentValues content_values = new ContentValues();

      content_values.put(password_col_password_value, new_password);

      db.insert(password_table, password_col_password_value, 
          content_values);
      db.close();
    }
```
Much like a Java property we need a getter to accompany the setter.
However here we'll first write a raw query which will place a cursor at the first result row that was found from our SELECT statement.
Database cursors can be though of as table iterators.
The cursor will begin at the result table itself, you must first move it to the  result row to begin reading data.
Once at a result row you have to move the cursor column by column and read the rrow value from each.
Since we are only going to be storing a single password the first row result will always contain the password we want to fetch. 
```java
    /**
     * Returns the existing password assuming that one exists via the 
     * following SQL.
     * <p>
     * SELECT * <br />
     * FROM Passwords <br />
     * WHERE PassNo='1';
     * </p>
     * @return A String with the current password
     */
    public String get_password(){
      SQLiteDatabase db = this.getWritableDatabase();

      Cursor cursor = db.rawQuery(
          "SELECT " + password_col_password_value +
          " FROM " + password_table +
          " WHERE " + password_col_password_number + "=\'1\';", null);

      cursor.moveToFirst();
      Integer column_index = cursor.getColumnIndex(
          password_col_password_value);
      String string_value = cursor.getString(column_index);

      cursor.close();
      db.close();

      return string_value;
    }
```
Now the question becomes how do we update an existing password?
To do so we have to use the update() method which is another Android SQLite API wrapper around the traditional SQL UPDATE WHERE statement.
Looking at the JavaDoc I wrote you can see how we would write this if it were a regular SQL statement.

Despite the Android SQL API being a little verbose(this might change in the future) the parameterized input means that we would be safe from any type of injection attacks since we're not passing a rawQuery from the user input.
In short using the parameterized wrapper methods is more code but it saves you from the potential danger of calling rawQueries which substitute in user values.
```java
    /**
     * Updates the existing password based on the following SQL.
     * <p>
     *  UPDATE Password <br />
     *brSET PassVal='new_password' <br />
     *brWHERE PassVal='old_password';
     * </p>
     * @param new_password
     */
    public void reset_password(String new_password){
      String old_password = get_password();
      SQLiteDatabase db = this.getWritableDatabase();
      ContentValues content_values = new ContentValues();

      content_values.put(password_col_password_value, new_password);

      String where_clause = password_col_password_value + "=?";
      String[] where_args = {old_password};
      db.update(password_table, content_values, where_clause, 
          where_args);

      db.close();
    }
```
Lastly we need a way to verify if a password has been set or not. 
This will allow us to determine when we need to prompt the user for a reset.
Its short and sweet, just run a select query and count the results.
```java
    /**
     * Uses the following SQL.
     * <p>
     * SELECT * <br />
     * FROM Passwords <br />
     * WHERE PassNo='1';
     * </p>
     * @return true if a password exists else false
     */
    public Boolean is_password(){
      SQLiteDatabase db = this.getWritableDatabase();

      Cursor cursor = db.rawQuery(
          "SELECT " + password_col_password_value +
          " FROM " + password_table +
          " WHERE " + password_col_password_number + "=\'1\';", null);

      if(cursor != null && cursor.getCount() > 0 ){
        db.close();
        cursor.close();
        return true;
      }
      else{
        db.close();
        cursor.close();
        return false;
      }
    }
}
```
Perhaps you got lost(its better if you followed along closely) but here is the PasswordDB class in full.
```java
//Add your package name here!

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class PasswordDB extends SQLiteOpenHelper {

  private static final String db_name = "PasswordDB";
  private static final String password_table = "Passwords";
  private static final String password_col_password_number = "PassNo";
  private static final String password_col_password_value = "PassVal";

  /**
   * 
   * @param context
   */
  public PasswordDB(Context context) {
    super(context, db_name, null, 1);
  }

  /**
   * Invokes the SQL statements below.
   *  <p>
   *belowCREATE TABLE IF NOT EXISTS Password( <br />
   *brPassNoINTEGER PRIMARY KEY, <br />
   *brPassValVARCHAR(10) NOT NULL <br />
   *br);
   * </p>
   * (non-Javadoc)
   * @see android.database.sqlite.SQLiteOpenHelper#onCreate(android.database.sqlite.SQLiteDatabase)
   */
  @Override
    public void onCreate(SQLiteDatabase db) {
      db.execSQL("CREATE TABLE IF NOT EXISTS " + password_table + "(" + 
          password_col_password_number + " INTEGER PRIMARY KEY," +
          password_col_password_value + " VARCHAR(10) NOT NULL" +
          ");");
    }

  /**
   * (non-Javadoc)
   * @see android.database.sqlite.SQLiteOpenHelper#onUpgrade(android.database.sqlite.SQLiteDatabase, int, int)
   */
  @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, 
        int newVersion) {
    }

  /**
   * Inserts a new password into the Password DB via the following SQL.
   * <p>
   * INSERT INTO Password (PassVal)<br />
   * VALUES('new_password');
   * </p>
   * @param new_password
   */
  public void set_password(String new_password){
    SQLiteDatabase db = this.getWritableDatabase();

    ContentValues content_values = new ContentValues();

    content_values.put(password_col_password_value, new_password);

    db.insert(password_table, password_col_password_value, 
        content_values);
    db.close();
  }

  /**
   * Returns the existing password assuming that one exists via the 
   * following SQL.
   * <p>
   * SELECT * <br />
   * FROM Passwords <br />
   * WHERE PassNo='1';
   * </p>
   * @return A String with the current password
   */
  public String get_password(){
    SQLiteDatabase db = this.getWritableDatabase();

    Cursor cursor = db.rawQuery(
        "SELECT " + password_col_password_value +
        " FROM " + password_table +
        " WHERE " + password_col_password_number + "=\'1\';", null);

    cursor.moveToFirst();
    Integer column_index = cursor.getColumnIndex(
        password_col_password_value);
    String string_value = cursor.getString(column_index);

    cursor.close();
    db.close();

    return string_value;
  }

  /**
   * Updates the existing password based on the following SQL.
   * <p>
   *  UPDATE Password <br />
   *brSET PassVal='new_password' <br />
   *brWHERE PassVal='old_password';
   * </p>
   * @param new_password
   */
  public void reset_password(String new_password){
    String old_password = get_password();
    SQLiteDatabase db = this.getWritableDatabase();
    ContentValues content_values = new ContentValues();

    content_values.put(password_col_password_value, new_password);

    String where_clause = password_col_password_value + "=?";
    String[] where_args = {old_password};
    db.update(password_table, content_values, where_clause, 
        where_args);

    db.close();
  }

  /**
   * Uses the following SQL.
   * <p>
   * SELECT * <br />
   * FROM Passwords <br />
   * WHERE PassNo='1';
   * </p>
   * @return true if a password exists else false
   */
  public Boolean is_password(){
    SQLiteDatabase db = this.getWritableDatabase();

    Cursor cursor = db.rawQuery(
        "SELECT " + password_col_password_value +
        " FROM " + password_table +
        " WHERE " + password_col_password_number + "=\'1\';", null);

    if(cursor != null && cursor.getCount() > 0 ){
      db.close();
      cursor.close();
      return true;
    }
    else{
      db.close();
      cursor.close();
      return false;
    }
  }
}
```
So there you go, an Android application that makes use of the SQLite API. Perhaps you can extend this application or something.

Anyways... enjoy your guestDialer app. 
