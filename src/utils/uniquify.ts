import React from "react";
/**
 * takes an array of JSX elements and returns an array of unique elements (with no duplicate keys)
 */
export default function uniquify(elmnts: JSX.Element[]): JSX.Element[] {
    // create an array to store the keys
    let keys: React.Key[] = [];
    // filter out duplicate keys
    return elmnts.filter((elmnt) => {
        // if the element has a key
        if (elmnt.key) {
            // if the key is in the keys array
            if (keys.indexOf(elmnt.key) >= 0) {
                // remove the element from the array
                return false;
            } else {
                // add the key to the keys array
                keys.push(elmnt.key);
                // keep the element in the array
                return true;
            }
            // if the element does not have a key keep it in the array
        } else return true;
    });
}
