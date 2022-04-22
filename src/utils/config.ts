// variable to store configuration data
const config = {
    title: "TicTacToe",
    version: "0.0.1",
    refferralBadge: {
        href: "https://www.digitalocean.com/?refcode=5431ada19bb0&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge",
        image: "https://web-platforms.sfo2.digitaloceanspaces.com/WWW/Badge%203.svg",
        alt: "DigitalOcean Referral Badge",
    },
    versionInfo: {
        template: "https://github.com/ttschnz/tictactoe_webapp/tree/",
        default: "https://github.com/ttschnz/tictactoe_webapp/",
    },
    server: {
        // set to true if the api server is the same as the frontend server
        useSameServer: true,
        // which protocol to use to connect to the api (http: or https:)
        protocol: "http:",
        // which protocol to use for the websocket (ws: or wss:)
        socketProtocol: "ws:",
        // the hostname of the api server
        hostname: "localhost",
        // the port to use to connect to the api
        port: 80,
        // the prefix to use to connect to the api (e.g. /api/v1/)
        prefix: "/",
        // the prefix to use to connect to the websocket (e.g. /ws/)
        socketPrefix: "/ws",
    },
    // the environment: development (DEV), staging (STG), production (PROD)
    environment: "PROD",
};
export default config;
