import AfricasTalking from "africastalking";

const username = process.env.AFRICASTALKING_USERNAME || "sandbox";
const apiKey = process.env.AFRICASTALKING_API_KEY || "";

const africasTalking = AfricasTalking({
    apiKey,
    username,
});

export const smsClient = africasTalking.SMS;