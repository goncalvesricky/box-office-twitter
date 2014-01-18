Twitter-driven Box Office Predictions
=============

We call the RottenTomatoes API to find a list of movies opening within a week from today.
We then open a Twitter Stream and filter and count tweets that mention the name
of a movie from that list.
Post-opening weekend, on Mondays, we'll pull revenue information from RT.

Everything will be stored in a local Redis instance.



Hopefully, we'll find a correlation between Twitter activity and b.o. revenue.