import { NextResponse } from "next/server";
import Stripe from "stripe";
import path from "path";

import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createReport } from "@/lib/createReport";
import { sendReportEmail } from "@/lib/sendReportEmail";


console.log(
  "SUPABASE URL:",
  process.env.NEXT_PUBLIC_SUPABASE_URL
);



export async function POST(request: Request) {


  const body = await request.text();


  const signature = request.headers.get(
    "stripe-signature"
  );



  if (!signature) {


    return NextResponse.json(

      {
        error: "Missing Stripe signature"
      },

      {
        status: 400
      }

    );

  }




  let event: Stripe.Event;



  try {


    event = stripe.webhooks.constructEvent(

      body,

      signature,

      process.env.STRIPE_WEBHOOK_SECRET!

    );


  } catch(error) {


    console.error(
      "Webhook signature error:",
      error
    );


    return NextResponse.json(

      {
        error: "Invalid webhook"
      },

      {
        status:400
      }

    );


  }




  if(event.type === "checkout.session.completed") {


    const session =

      event.data.object as Stripe.Checkout.Session;



    console.log(
      "CHECKOUT SESSION:",
      session.id
    );



    console.log(
      "SESSION METADATA:",
      session.metadata
    );




    const sessionId =

      session.metadata?.sessionId;



    const customerEmail =

      session.customer_details?.email
      ||
      session.customer_email
      ||
      null;



    console.log(
      "PAID SESSION ID:",
      sessionId
    );


    console.log(
      "CUSTOMER EMAIL:",
      customerEmail
    );





    if(!sessionId) {


      console.error(
        "No sessionId found"
      );


      return NextResponse.json({

        received:true

      });


    }





    // Find lead

    const { data: lead, error: leadError } =

      await supabaseAdmin

      .from("leads")

      .select("*")

      .eq(

        "session_id",

        sessionId

      )

      .single();





    console.log(
      "LEAD FOUND:",
      lead
    );



    console.log(
      "LEAD SEARCH ERROR:",
      leadError
    );





    if(leadError || !lead) {


      console.error(
        "Lead not found"
      );


      return NextResponse.json({

        received:true

      });


    }





    // Create PDF report

    const reportUrl = await createReport({

      sessionId,

      lead

    });





    console.log(
      "REPORT CREATED:",
      reportUrl
    );







    // Update database

    const { data: updatedLead, error:updateError } =

      await supabaseAdmin

      .from("leads")

      .update({

        report_purchased:true,

        email:customerEmail,

        email_captured:

          customerEmail ? true : false,


        report_generated:true,

        report_url:reportUrl,

        report_generated_at:

          new Date().toISOString()

      })

      .eq(

        "session_id",

        sessionId

      )

      .select();





    console.log(
      "UPDATED ROW:",
      updatedLead
    );



    console.log(
      "UPDATE ERROR:",
      updateError
    );






    // Send email with PDF attachment

    if(customerEmail) {


      const pdfPath = path.join(

        process.cwd(),

        "public",

        reportUrl

      );




      await sendReportEmail({

        email:customerEmail,

        reportUrl,


        monthlyLoss:

          lead.lost_revenue_monthly,


        yearlyLoss:

          lead.lost_revenue_yearly,


        pdfPath

      });



      console.log(
        "REPORT EMAIL SENT"
      );


    }


  }




  return NextResponse.json({

    received:true

  });


}