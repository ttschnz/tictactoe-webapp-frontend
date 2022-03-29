import { credentialChange } from "../utils/subjects";
import { Credentials } from "../utils/types";
import { api } from "./apiService";
/**
 * Credentials service
 * check if credentials are valid.
 */
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

/**
 * sets the credentials in localStorage. if the credentials are false, it removes them from localStorage
 */
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

/**
 * Add a gameKey to the user's list of gameKeys, identified by the gameId (number format)
 * @param gameKey the game key add
 * @param gameId the game id
 */
export function addGameKey(gameKey: string, gameId: number) {
    let gameKeys = JSON.parse(localStorage.getItem("gameKeys") ?? "{}");
    gameKeys[gameId] = gameKey;
    localStorage.setItem("gameKeys", JSON.stringify(gameKeys));
}

/**
 * Get the game key for a game, undefined if not found
 * @param gameId the game id
 * @returns the game key of the game
 */
export function getGameKey(gameId: number) {
    let gameKeys = JSON.parse(localStorage.getItem("gameKeys") ?? "{}");
    return gameKeys[gameId];
}
