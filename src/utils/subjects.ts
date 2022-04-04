/**
 * File containing the subjects used in the application.
 * The subjects are used to communicate between the different parts of the application.
 * They can be used to trigger events, to send data to the different parts of the application, and to subscribe to events.
 */

import { Subject } from "rxjs";
import { PostGameInfo } from "./types";

// Define subjects used in the application.
const errorSubject = new Subject();
const errorResolveSubject = new Subject();
const scroll = new Subject();
const credentialChange = new Subject();
const gameChange = new Subject<PostGameInfo>();
// when the document registers a scroll event, the scroll event is sent to the scroll subject
document.addEventListener("scroll", (event) => {
    scroll.next(event);
});

// add proxy to pushState function to broadcast locationChange
const locationChange = new Subject();
window.history.back = new Proxy(window.history.back, {
    apply: (target, thisArg, argArray: []) => {
        console.log("history back");
        target.apply(thisArg, argArray);
        locationChange.next(document.location.pathname);
    },
});
window.history.forward = new Proxy(window.history.forward, {
    apply: (target, thisArg, argArray: []) => {
        console.log("history forward");
        target.apply(thisArg, argArray);
        locationChange.next(document.location.pathname);
    },
});
window.history.pushState = new Proxy(window.history.pushState, {
    apply: (
        target,
        thisArg,
        argArray: [data: any, unused: string, url?: string | URL | null]
    ) => {
        console.log("pushState");
        target.apply(thisArg, argArray);
        locationChange.next(document.location.pathname);
    },
});

// history back and forward are not triggered when the user clicks on the browser's back and forward buttons
// therefore we need to compare the current location with the previous location and trigger the event if they differ
(() => {
    // store previous location
    let lastLocation = document.location.pathname;
    // subscribe to location change to prevent the event from being triggered multiple times
    locationChange.subscribe({
        next: (newLocation) => {
            lastLocation = newLocation as string;
        },
    });
    setInterval(() => {
        // check if the current location is different from the previous location
        let currentLocation = document.location.pathname;
        // if they differ, trigger the event
        if (lastLocation !== currentLocation) {
            lastLocation = currentLocation;
            locationChange.next(currentLocation);
        }
    }, 100);
})();

// export the subjects
export {
    errorSubject,
    credentialChange,
    errorResolveSubject,
    locationChange,
    scroll,
    gameChange,
};
