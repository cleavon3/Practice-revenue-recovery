import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function POST(request: Request) {


  try {


    const body = await request.json();



    console.log(
      "CAPTURE LEAD BODY:",
      body
    );



    const {

      email,

      sessionId

    } = body;



    const { error } = await supabase

      .from("leads")

      .update({

        email,

        email_captured:true

      })

      .eq(

        "session_id",

        sessionId

      );



    if(error) {


      console.error(
        "EMAIL UPDATE ERROR:",
        error
      );


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



  } catch(error) {


    console.error(error);



    return NextResponse.json(

      {

        success:false,

        error:"Lead capture failed"

      },

      {

        status:500

      }

    );


  }


}