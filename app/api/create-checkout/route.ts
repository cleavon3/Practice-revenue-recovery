import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";


export async function POST(request: Request) {


  console.log(
    "🔥 CREATE CHECKOUT ROUTE HIT"
  );


  try {


    const {
      sessionId
    } = await request.json();



    const checkoutSession = await stripe.checkout.sessions.create({


      mode: "payment",
      customer_creation:"always",



      line_items: [

        {

          price: "price_1U5RJgJI8l6Pu46gM3fPBlPQ",

          quantity: 1

        }

      ],



      metadata: {

        sessionId: sessionId

      },



      success_url:

        `http://localhost:3000/report-success?session_id=${sessionId}`,



      cancel_url:

        "http://localhost:3000"


    });



    console.log(
      "STRIPE CREATED SESSION:",
      checkoutSession.id
    );



    console.log(
      "STRIPE METADATA:",
      checkoutSession.metadata
    );



    return NextResponse.json({

      url: checkoutSession.url

    });



  } catch(error) {


    console.error(

      "Checkout error:",

      error

    );


    return NextResponse.json(

      {

        error: "Checkout failed"

      },

      {

        status:500

      }

    );


  }


}