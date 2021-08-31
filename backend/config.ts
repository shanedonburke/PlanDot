const fs = require('fs')

export const config = {
  jwtSecret: "mysecret",
  baseUrl: `http://localhost:8080`,
  port: 8080,
  oauth2Credentials: {
    clientId: "50072640495-rsdl91dsmjiqq22b7kn8979vig8rjao1.apps.googleusercontent.com",
    projectId: "plan0-322518",
    authUri: "https://accounts.google.com/o/oauth2/auth",
    tokenUri: "https://oauth2.googleapis.com/token",
    authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
    clientSecret: "UTv0LTm9SA3yb0O4MqxQDlKH",
    redirectUris: [`http://localhost:8080/auth_callback`],
    scope: ['openid'],
  },
};
