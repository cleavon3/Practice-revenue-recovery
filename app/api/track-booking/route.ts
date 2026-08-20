import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";


export async function POST(request: Request) {


  try {


    const {
      sessionId
    } = await request.json();



    console.log(
      "BOOKING CLICK SESSION:",
      sessionId
    );



    const { data, error } = await supabaseAdmin

      .from("leads")

      .update({

        booking_cta_clicked:true,

        booking_clicked_at:new Date().toISOString()

      })

      .eq(

        "session_id",

        sessionId

      )

      .select();




    console.log(
      "BOOKING UPDATE:",
      data
    );



    console.log(
      "BOOKING ERROR:",
      error
    );




    if(error){

      return NextResponse.json(

        {
          success:false,
          error:error.message
        },

        {
          status:500
        }

      );

    }




    return NextResponse.json({

      success:true

    });



  } catch(error){


    console.error(error);



    return NextResponse.json(

      {
        success:false
      },

      {
        status:500
      }

    );


  }


}