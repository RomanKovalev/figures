# Example Django Rest Framework, React project.

The browser window contains work area and 2 buttons. Click to "Add" button creates random sized and random positioned 4-square (90 degrees) figure. All parameters (x,y,width,height) save to database (SQLite). 

User can add another figure, which will save to database too. Also user can drag and drop figure inside browser window and change dimension sizes by dragging figure corners. All changes immediately saving to the database.

If a user re-open browser he will see the figures which were before window closed.

Based on: 
React, Apollo
Django channels, GraphQl
AWS Route53, EC2, Github Actions, Docker containers