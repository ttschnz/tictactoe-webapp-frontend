import React from "react";
export default function uniquify(elmnts: JSX.Element[]): JSX.Element[] {
   let keys: React.Key[] = [];
   return elmnts.filter((elmnt) => {
      if (elmnt.key) {
         if (keys.indexOf(elmnt.key) >= 0) {
            return false;
         } else {
            keys.push(elmnt.key);
            return true;
         }
      } else return true;
   });
}
