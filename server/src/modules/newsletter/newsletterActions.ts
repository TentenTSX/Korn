import ActionError from "../ActionError";
import { sendNewsletterWelcomeEmail } from "../email/emailService";
import newsletterRepository from "./newsletterRepository";

const subscribeAction = async (emailInput: unknown) => {
  if (
    typeof emailInput !== "string" ||
    !/^\S+@\S+\.\S+$/.test(emailInput.trim())
  ) {
    throw new ActionError("BAD_REQUEST", "Adresse email invalide.");
  }
  const email = emailInput.trim().toLowerCase();
  const isNewSubscriber = await newsletterRepository.subscribe(email);

  if (isNewSubscriber) {
    try {
      await sendNewsletterWelcomeEmail(email);
    } catch (error) {
      console.error("Failed to send newsletter welcome email.", error);
    }
  }
};

export default { subscribeAction };
