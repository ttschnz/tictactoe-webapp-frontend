import { credentialChange } from "../utils/subjects";
import { Credentials } from "../utils/types";
import { api } from "./apiService";
export async function checkCredentials() {
   const credentials = getCredentials();
   if (credentials) {
      let response = await api("/checkCredentials", {}, true);
      if (response.success && response.data === credentials.username)
         return true;
      else {
         setCredentials(false);
         return false;
      }
   } else {
      return false;
   }
}

/**
 * returns the credentials from localStorage, false if not authenticated
 */
export function getCredentials(): Credentials | false {
   // construct an object containing the credentials
   let cred: Credentials = {
      username: localStorage.getItem("username") ?? "",
      token: localStorage.getItem("token") ?? "",
      tokenExpiration: Number(localStorage.getItem("tokenExpiration")),
      inCompetition: JSON.parse(
         localStorage.getItem("inCompetition") ?? '""'
      ) as boolean,
   };
   // if the username, the token, and an expiration date is set, and the token is still valid, return the crendentials. if not, return false
   if (
      cred.username &&
      cred.token &&
      cred.tokenExpiration &&
      cred.tokenExpiration <= new Date().getTime()
   )
      return cred;
   else return false;
}

export function setCredentials(value: Credentials | false) {
   if (!value) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("username");
      localStorage.removeItem("inCompetition");
      credentialChange.next(getCredentials());
   } else {
      localStorage.setItem("token", value.token);
      localStorage.setItem("tokenExpiration", String(value.tokenExpiration));
      localStorage.setItem("username", value.username);
      localStorage.setItem(
         "inCompetition",
         JSON.stringify(value.inCompetition)
      );
      checkCredentials();
   }
}
