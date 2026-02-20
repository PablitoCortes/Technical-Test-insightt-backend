import { auth } from "express-oauth2-jwt-bearer";

export const authMiddleware = auth({
  audience: "https://task-api",
  issuerBaseURL: "https://dev-f4qf7cywllrjeu3m.us.auth0.com",
  tokenSigningAlg: "RS256"
});