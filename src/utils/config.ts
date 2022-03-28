const config = {
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
      protocol: "http:",
      socketProtocol: "ws:",
      hostname: "localhost",
      port: 80,
      prefix: "/",
      socketPrefix: "/ws",
   },
   environment: "DEV",
};
export default config;
