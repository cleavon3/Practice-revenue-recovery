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



    const appUrl = process.env.NEXT_PUBLIC_APP_URL;



    if(!appUrl){

      throw new Error(
        "NEXT_PUBLIC_APP_URL is missing"
      );

    }






    const checkoutSession = await stripe.checkout.sessions.create({


      mode:"payment",


      customer_creation:"always",




      line_items:[

        {

          price:"price_1U5RJgJI8l6Pu46gM3fPBlPQ",

          quantity:1

        }

      ],





      metadata:{

        sessionId

      },






      success_url:

        `${appUrl}/report-success?session_id=${sessionId}`,





      cancel_url:

        appUrl




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

      url:checkoutSession.url

    });







  } catch(error){



    console.error(

      "Checkout error:",

      error

    );




    return NextResponse.json(

      {

        error:"Checkout failed"

      },

      {

        status:500

      }

    );


  }


}