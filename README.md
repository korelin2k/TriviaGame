# TriviaGame

Selected the "Advanced" Assignment which was the timed Trivia Questions. Overall, this was a pretty simple assignment but it allowed me to try out a few additional features.

## Features

1. Foundation CSS instead of Bootstrap.
  * Leveraged the latest GA release of Foundation (6.4).
  * I felt Foundation CSS did not provide the same "quick start" and "ease of use" as Bootstrap. Could have been biased since I'm pretty familiar with Bootstrap 4 and it's capabilities.
  * Examples and other people having similar issues were far and few between - compared to a simple search on stackoverflow for Bootstrap (even version 4) has a lot of hits.
2. Love APIs - used it to generate all my questions
  * API leveraged - Open Trivia Database: https://opentdb.com/
  * Downside being if this endpoint is down while being tested, I'm in trouble... :)
  * Able to provide multiple categories of questions based off this method
  * Since you want to avoid sync API calls, I introduced a "loading" screen - aka the spinning wheel, while the results were populating
3. Leveraged tooltip for the categories - really wish I used Bootstrap at this point, they look so much cleaner there.
4. Transition animations (progress bar) - took a bit to realise the "linear" property with the speed it adjusts with, but it was a remarkably smooth and simple way to do animations.

## Improvement Opportunities

1. Heard feedback from Richard to the class on making sure our variables were named better - cleaned those up
2. Cleaned up my methods, smaller and more manageable
3. No more use of "var" - used "let" and "const", where appropriate

### Linkage
https://korelin2k.github.io/TriviaGame/index.html