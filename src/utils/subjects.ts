import { Subject } from "rxjs";

const errorSubject = new Subject();
const errorResolveSubject = new Subject();
const scroll = new Subject();
document.addEventListener("scroll", (event) => {
   scroll.next(event);
});

// subject to be triggered when the credentials change
const credentialChange = new Subject();

/**
 * add proxy to pushState function to broadcast locationChange
 */
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
(() => {
   let lastLocation = document.location.pathname;
   locationChange.subscribe({
      next: (newLocation) => {
         lastLocation = newLocation as string;
      },
   });
   setInterval(() => {
      let currentLocation = document.location.pathname;
      if (lastLocation !== currentLocation) {
         lastLocation = currentLocation;
         locationChange.next(currentLocation);
      }
   }, 100);
})();

export {
   errorSubject,
   credentialChange,
   errorResolveSubject,
   locationChange,
   scroll,
};
