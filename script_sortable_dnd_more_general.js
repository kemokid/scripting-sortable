// Originally from https://ghostinspector.com/blog/simulate-drag-and-drop-javascript-casperjs/
// trimmed down and modified by @kemokid (Martin Baker) to work with Sortable.js
///
// Probably not going to work with dragging from one list to another

// This has been made more general, to work with other drag-and-drop elements besides a
// Sortable list, but is not as complete as the Casper example above.

// Call with DOM selectors, eg `triggerDragAndDrop('#drag', '#drop');`

// Returns false if unable to start.
// callback, if present, will be called with true if able to finish, false if not.
// If you receive "false" on the callback, the list is likely not in the beginning state.
var triggerDragAndDrop = function (selectorDrag, selectorDrop, callback) {
  var DELAY_INTERVAL_MS = 10;
  var MAX_TRIES = 10;
  var dragStartEvent;

  // fetch target elements
  var elemDrag = document.querySelector(selectorDrag);
  var elemDrop = document.querySelector(selectorDrop);

  if (!elemDrag || !elemDrop) {
    console.log("can't get elements");
    return false;
  }

  var startingDropRect = elemDrop.getBoundingClientRect();

  function rectsEqual(r1, r2) {
    return r1.top === r2.top && r1.right === r2.right && r1.bottom === r2.bottom && r1.left === r2.left;
  }

  // function for triggering mouse events
  function fireMouseEvent(type, elem, dataTransfer) {
    var evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(type, true, true, window, 1, 1, 1, 0, 0, false, false, false, false, 0, elem);
    if (/^dr/i.test(type)) {
      evt.dataTransfer = dataTransfer || createNewDataTransfer();
    }

    elem.dispatchEvent(evt);
    return evt;
  };

  function createNewDataTransfer() {
    var data = {};
    return {
      clearData: function(key) {
        if (key === undefined) {
          data = {};
        } else {
          delete data[key];
        }
      },
      getData: function(key) {
        return data[key];
      },
      setData: function(key, value) {
        data[key] = value;
      },
      setDragImage: function() {},
      dropEffect: 'none',
      files: [],
      items: [],
      types: [],
      // also effectAllowed      
    }
  };

  // trigger dragging process on top of drop target
  // We sometimes need to do this multiple times due to the vagaries of
  // how Sortable manages the list re-arrangement
  var counter = 0;
  function dragover() {
    counter++;
    console.log('DRAGOVER #' + counter);

    var currentDropRect = elemDrop.getBoundingClientRect();
    if (rectsEqual(startingDropRect, currentDropRect) && counter < MAX_TRIES) {
      if (counter != 1) console.log("drop target rect hasn't changed, trying again");

      // mouseover / mouseout etc events not necessary
      // dragenter / dragleave events not necessary either
      fireMouseEvent('dragover', elemDrop, dragStartEvent.dataTransfer);

      setTimeout(dragover, DELAY_INTERVAL_MS);
    } else {
      if (rectsEqual(startingDropRect, currentDropRect)) {
        console.log("wasn't able to budge drop target after " + MAX_TRIES + " tries, aborting");
        fireMouseEvent('drop', elemDrop, dragStartEvent.dataTransfer);
        if (callback) callback(false);
      } else {
        setTimeout(drop, DELAY_INTERVAL_MS);
      }
    }
  }

  function drop() {
    console.log('DROP');
    // release dragged element on top of drop target
    fireMouseEvent('drop', elemDrop, dragStartEvent.dataTransfer);
    fireMouseEvent('mouseup', elemDrop);    // not strictly necessary but I like the symmetry
    if (callback) callback(true);
  }

  // start dragging process
  console.log('DRAGSTART');
  fireMouseEvent('mousedown', elemDrag);
  dragStartEvent = fireMouseEvent('dragstart', elemDrag);

  // after a delay, do the first dragover; this will run up to MAX_TRIES times
  // (with a delay between each run) and finally run drop() with a delay:
  setTimeout(dragover, DELAY_INTERVAL_MS);
  return true;
};
