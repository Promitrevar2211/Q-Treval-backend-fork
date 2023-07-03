import config from "config";

const configVariables = {
  SYS_APP_CNF: config.get("SYS_APP_CNF"),
  PRIVATE_API_KEY: config.get("PRIVATE_API_KEY"),
  DATABASE_CONNECTION_URI_DEV: config.get("DATABASE_CONNECTION_URI_DEV"),
  AWS_ACCESS_KEY_ID: config.get("AWS_ACCESS_KEY_ID"),
  AWS_SECRET_ACCESS_KEY: config.get("AWS_SECRET_ACCESS_KEY"),
  S3_BUCKET_NAME: config.get("S3_BUCKET_NAME"),
  S3_BUCKET_NAME_PROFILE_PICS: config.get("S3_BUCKET_NAME_PROFILE_PICS"),
  TIMEZONE: config.get("TIMEZONE"),
  JWT_SECRET_KEY: config.get("JWT_SECRET_KEY"),
  EMAIL_HOST: config.get("EMAIL_HOST"),
  EMAIL_PORT: config.get("EMAIL_PORT"),
  EMAIL_USER: config.get("EMAIL_USER"),
  EMAIL_PASS: config.get("EMAIL_PASS"),
  EMAIL_FROM: config.get("EMAIL_FROM"),
  FAST2SMS_API_KEY: config.get("FAST2SMS_API_KEY"),
  FAST2SMS_API_ROUTE: config.get("FAST2SMS_API_ROUTE"),
  FAST2SMS_API_SENDER_ID: config.get("FAST2SMS_API_SENDER_ID"),
  FRONT_END_URL: config.get("FRONT_END_URL"),
  EXPIRED_IN: config.get("EXPIRED_IN"),
  REFRESH_EXPIRED_IN: config.get("REFRESH_EXPIRED_IN"),
  STRIPE_PUBLISHABLE_KEY: config.get("STRIPE_PUBLISHABLE_KEY"),
  STRIPE_SECRET_KEY: config.get("STRIPE_SECRET_KEY"),
  STRIPE_WEBHOOK_SECRET: config.get("STRIPE_WEBHOOK_SECRET"),
  BASIC: config.get("BASIC"),
  PREMIUM: config.get("PREMIUM"),
  SSO_SERVER_JWT_URL: config.get("SSO_SERVER_JWT_URL"),
  GOOGLE_SERVICE_ACCOUNT_EMAIL:
    "quantum-travels@quantum-travels-391610.iam.gserviceaccount.com",
  GOOGLE_PRIVATE_KEY: "2abc8a50af15949c1c19f0ae6c2c938971b3e2d4",
  GOOGLE_SHEET_ID: "1cWrS1Xamabj1xd1YKgsGhxAnldKaC06j3zIaH14SIw4",
};

export default configVariables;
