# scripting-sortable
Code and examples for scripting drag-and-drop in lists run by Sortable.js

## Contents

This repo contains a script for automating drag-and-drop in lists run by Sortable.js. This is not straightforward, and should enable scripting and testing of UI elements that were not possible before.

[script_sortable_dnd.js](./script_sortable_dnd.js) contains the key code. Run `triggerSortableDragAndDrop('#drag', '#drop');` to drag element with id `drag` to the element with id `drop`.

### Examples

There's a simple example of scripting a Sortable list in [sortable_example.html](./sortable_example.html).

A simple, non-Sortable example is [non_sortable_example.html](./non_sortable_example.html), which is an adaption of [W3School's example code](https://www.w3schools.com/html/tryit.asp?filename=tryhtml5_draganddrop). This requires a more general version of the script, which is in [script_sortable_dnd_more_general.js](./script_sortable_dnd_more_general.js).

## History

One recent day, I was trying to script drag-and-drop actions on a Sortable list (that is, one controlled by [Sortable.js library](https://github.com/RubaXa/Sortable), as it happened as part of the [Angular Sortable library](https://github.com/a5hik/ng-sortable)).

Due to a [bug in Selenium's support for Google Chrome](https://github.com/seleniumhq/selenium-google-code-issue-archive/issues/3604) which the developers do not seem at all inclined to fix, I could not use the simple method of sending an HTML5 drag-and-drop event to the page.

After much searching I found some useful links and scripts for mimicking drag-and-drop with individual browser events. One of these is [drag_and_drop_helper.js](https://storage.googleapis.com/google-code-attachments/selenium/issue-3604/comment-4/drag_and_drop_helper.js) provided by rcorreia@blurb.com. Another useful resource was a script for [drag-and-drop for Casper](https://ghostinspector.com/blog/simulate-drag-and-drop-javascript-casperjs/) which I used as the starting point for the script included here.

I removed many of the events and introduced two key changes to get Sortable.js to respond properly:

* I put delays in between important groups of events.
* I added a check to see if the target element has moved; if not, the script retries a few times. This is necessary because Sortable does some funky stuff in terms of adding a "ghost" element into the list, and also because, unlike most drag-and-drop actions, the target may move (in fact, that's the point).

## Hints if you run into trouble

The script is very hacky. If it's not working for your browser / page / Sortable.js version, you may want to add in some additional events or delays, or just increase DELAY_INTERVAL_MS or MAX_TRIES. For debugging, you can increase DELAY_INTERVAL_MS and watch the DOM elements change to understand what Sortable is doing. That code is ... let's say not easy to grok.

One thing you'll want to check is that the script works both for an element dragged to an element *above* it on the list and as well as to an element *below* it on the list.

## Other notes

I found this page on [scripting in Protractor](http://labs.criteo.com/2016/06/1315-2/) to be helpful early in my process of working this out.
