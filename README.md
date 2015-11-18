# demo studio scraper

A script to scrap the MDN demo studio and grab some info about all the projects. This prints some stats in CSV format to stdout:

    $ npm install
    $ ./index.js

    title,author,views,likes
    shekharBCREC,Shekhar,336,0
    bleach,somesh,298,0
    Quizinc Webapp,ShramanaP,518,2
    TrollFie,rabbihossain,323,0
    Bulldozer Survival,pierzxc,1033,2
    color bulb,dj0,1173,13
    GAuth,gbraad,2001,1
    sneak (test some bug ),bxlxd,834,1
    Wish Explorer,Naomi,4236,12
    ...

Use some standard UNIX magicks to write to a file for analysis

    $ ./index.js > 2015-11-17.csv
