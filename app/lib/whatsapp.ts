import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function sendWhatsAppMessage(
  to: string,
  message: string
) {
  return client.messages.create({ 
    from: "whatsapp:+14155238886", // número do Twilio
    to: `whatsapp:${to}`,
    body: message,
  });
}