import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
};

export default config;
