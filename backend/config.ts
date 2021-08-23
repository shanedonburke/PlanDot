const port = 8080;
const baseUrl = `http://localhost:${port}`;

export const CONFIG = {
  // Secret for jsonwebtoken encryption
  jwtSecret: "mysecret",
  baseUrl,
  port,
  oauth2Credentials: {
    clientId: "50072640495-rsdl91dsmjiqq22b7kn8979vig8rjao1.apps.googleusercontent.com",
    projectId: "plandot-322518", // The name of your project
    authUri: "https://accounts.google.com/o/oauth2/auth",
    tokenUri: "https://oauth2.googleapis.com/token",
    authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
    clientSecret: "UTv0LTm9SA3yb0O4MqxQDlKH",
    redirectUris: [`${baseUrl}/auth_callback`],
    scope: ['openid'],
  },
};
