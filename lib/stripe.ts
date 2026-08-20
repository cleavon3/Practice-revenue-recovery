import Stripe from "stripe";


console.log(
  "STRIPE KEY EXISTS:",
  !!process.env.STRIPE_SECRET_KEY
);


console.log(
  "STRIPE KEY START:",
  process.env.STRIPE_SECRET_KEY?.substring(0,10)
);



export const stripe = new Stripe(

  process.env.STRIPE_SECRET_KEY!

);