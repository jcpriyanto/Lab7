// script.js

import { router } from './router.js'; // Router imported so you can use it to manipulate your SPA app here
const setState = router.setState;

// Make sure you register your service worker here too
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/Lab7/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

let entryNum = 0;
document.addEventListener('DOMContentLoaded', () => {
  fetch('https://cse110lab6.herokuapp.com/entries')
    .then(response => response.json())
    .then(entries => {
      entries.forEach(entry => {
        let newPost = document.createElement('journal-entry');
        entryNum += 1;
        let currentEntryNum = entryNum;
        newPost.addEventListener('click', () => {
          history.pushState({currentState: 2, entryNumber: currentEntryNum, entryItem: entry}, "entries", "/#entry" + currentEntryNum);
          router.setState(2, currentEntryNum, entry);
        });
        newPost.entry = entry;
        document.querySelector('main').appendChild(newPost);
      });
    });
});

const settingsIcon = document.getElementsByTagName('header')[0].children[1];

settingsIcon.addEventListener("click", () => {
  window.history.pushState({currentState: 3, entryNumber: 0, entryItem: null}, "settings", "/#settings"); //TODO: TEST THIS
  router.setState(3, 0, null);
});

const headingTag = document.getElementsByTagName('h1')[0];
headingTag.addEventListener("click", () => {
  window.history.pushState({currentState: 1, entryNumber: 0, entryItem: null}, "home", "/Lab7/"); //TODO: TEST THIS
  router.setState(1, 0, null);
});

window.onpopstate = function(event) {
  if(event.state != null) { 
    if(event.state.currentState === 2){
      router.setState(2, event.state.entryNumber, event.state.entryItem);
    } else if (event.state.currentState === 3) {
      router.setState(3, 0, null);
    }
  } else {
    router.setState(1, 0, null);
  }
}