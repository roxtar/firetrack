FireTrack: FireTrack is an extension which tracks time spent on
different websites.

# INSTALLATION

1. Download the firetrack.xpi file.
2. Open Firefox
3. Click on "Firefox->New Tab->Open File" and open the xpi file.
4. Click on the "Install Now" button

# USAGE

While on any page, right click and select the "Firetrack" menu option
to open the dashboard.

Alternatively, press "Ctrl + Alt + i" on Windows and Linux to open the
Firetrack dashboard. Pressing the hotkey combination again will hide
the dashboard.

# LICENSE

See file LICENSE or
http://www.opensource.org/licenses/mit-license.php


# DESIGN GOALS

* Let the user easily find out her time spent on each website. 

* She shouldn't need to sign up on any other site to access this
  data.

* The addon should be light and fast.

* The addon should work with all major versions of Firefox.

* The data should be exportable (JSON, XML?)

* The data should be importable (for future versions, or maybe to sync
  across browsers)

* Data should be query*able ideally from within the addon or after
  exporting.

* It should be platform independent (Duh!)

* It should (eventually) also work on mobile.

# IMPLEMENTATION DETAILS

* Every user has multiple timers. Each domain has one timer associated
  with it. 

* Data is stored locally. Yes. It is by design. I am not a fan of
  repeatedly signing in to websites to access my own data.

* The time spent on each domain is logged whenever the browser is
  running, but only stored per day. 

* The time spent is calculated as:
  
     if(!user_idle()) {
 	current_tab_domain = get_current_domain();
 	time_spent[current_tab_domain]++;
     }

* There needs to be a disable button.

* The user should be provided with the following charts:
  1. Website percentage (pie chart) ** Top 5 websites which were used.
  2. Hourly activity (bar graph) per website.
  3. Hourly acitivty per hour per website (multi*colored bar graph)

* Data should be available as a browseable website.

* Custom queries. Expose the table/data to the user and let her
  specify the query.

* The Addon will not record statistics when in private-browsing mode.



