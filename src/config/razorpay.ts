import Razorpay from "razorpay";
import { env } from "./env.server";
import { clientEnv } from "./env.client";

export const razorpay = new Razorpay({
  key_id: clientEnv.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

