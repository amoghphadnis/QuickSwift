// paypalClient.js
import paypal from '@paypal/checkout-server-sdk';
import { config } from "dotenv";

config(); // Load environment variables here as well if used separately

const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_SECRET_KEY
);
const client = new paypal.core.PayPalHttpClient(environment);

export default client;
