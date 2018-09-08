TC-06.js
========

For Ludum Dare 42, CliffracerX made a game called Senbir, and released it
[on itch.io] with [source code on gitlab] (under the LGPLv3 license).

[on itch.io]: https://cliffracerx.itch.io/senbir
[source code on gitlab]: https://gitlab.com/CliffracerX/Senbir

That game is all about playing around with a virtual computer based on the
fictional TC-06 processor, with a few basic peripherals and some pretty tight
limitations (depending on the game mode), which are part of the challenge.

The game actually emulates that computer, processor and all, which means it's
essentially a sandbox that you can put any program you want into (as long as
you can create it within the limits), and it will actually run that program.

*This* project is a reimplementation of that virtual computer in JavaScript,
enabling you to run those same programs in a web browser.

It is a less pretty version of that computer, without the 3D environment of
the game, but aims to be compatible with it while also being flexible enough
to support variant modes (as in a PC that is related but not quite the same).

Most of the code for this project was originally written without referencing
the code of the game, so this is not directly derivative of its code (just
observed behavior and docs given to players as necessary to play effectively),
but I have since started looking at the game's code for other reasons - so it
is probably not really a clean room design per se anymore. So, it was decided
to use the same LGPL license here, to avoid complications with copyright.
