# obsSrlInfo

Attempting to make a thing for an OBS Overlay that displays current races (eventually that only you're currently in)

# HOW TO USE

1. In OBS, download the CLR Browser plugin found at https://obsproject.com/forum/resources/clr-browser-source-plugin.22/
2. Once installed, create a new layer in your scene using the CLR Browser
3. Use the following url: http://sillypears.github.io/obsSrlInfo/
4. If you'd like to only display the game you are playing, add '?game=< srl game abbreviation >' to the end. If you would also like to display races are currently in, you can add '&player=<srl_name>'. Your SRL name is case sensitive.
  1. IE http://sillypears.github.io/obsSrlInfo/?game=isaacafterbirth
  2. IE http://sillypears.github.io/obsSrlInfo/?game=isaacafterbirth&player=sillypears
5. Give the window some dimensions as you'd like it to show on screen
6. Click OK and move/place the layer where you want it
7. You can also change default colors/fonts within OBS by enabling the hijack feature and stealing the css from here:
  1. http://sillypears.github.io/obsSrlInfo/style.css

