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

    const priceId = process.env.STRIPE_PRICE_ID;





    console.log(
      "PRICE ID FROM ENV:",
      priceId
    );



    console.log(
      "APP URL:",
      appUrl
    );





    if(!appUrl){

      throw new Error(
        "NEXT_PUBLIC_APP_URL is missing"
      );

    }




    if(!priceId){

      throw new Error(
        "STRIPE_PRICE_ID is missing"
      );

    }








    const checkoutSession = await stripe.checkout.sessions.create({


      mode:"payment",



      customer_creation:"always",





      line_items:[

        {

          price: priceId,

          quantity:1

        }

      ],





      metadata:{


        sessionId: sessionId || ""


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

      url: checkoutSession.url

    });







  } catch(error:any){



    console.error(

      "CHECKOUT ERROR MESSAGE:",

      error?.message

    );



    console.error(

      "CHECKOUT ERROR FULL:",

      error

    );





    return NextResponse.json(

      {

        error:"Checkout failed",

        message:error?.message

      },

      {

        status:500

      }

    );


  }


}