import { NextResponse } from "next/server";
import { generateRevenueReport } from "@/lib/reportGenerator";
import { createSessionId } from "@/lib/session";
import { supabase } from "@/lib/supabase";


export async function POST(request: Request) {


  try {


    const body = await request.json();



    const {

      callVolume,

      missedPercent,

      patientValue

    } = body;




    const report = generateRevenueReport({

      callVolume: Number(callVolume),

      missedPercent: Number(missedPercent),

      patientValue: Number(patientValue)

    });




    const sessionId = createSessionId();




    const { error } = await supabase

      .from("leads")

      .insert({

        session_id: sessionId,

        call_volume: Number(callVolume),

        missed_percent: Number(missedPercent),

        avg_patient_value: Number(patientValue),

        lost_revenue_monthly: report.monthlyLoss,

        lost_revenue_yearly: report.yearlyLoss,

        calculator_completed: true,

        report_purchased: false,

        email_captured: false,

        booking_cta_clicked: false,

        industry: "dental"

      });




    if (error) {


      console.error(

        "LEAD CREATION ERROR:",

        error

      );


      return NextResponse.json(

        {

          error:"Could not save calculator result"

        },

        {

          status:500

        }

      );


    }





    console.log(

      "LEAD CREATED:",

      sessionId

    );



    console.log(

      "CALCULATE SAVED LEAD:",

      sessionId

    );




    return NextResponse.json({

      ...report,

      sessionId

    });




  } catch(error) {


    console.error(

      "CALCULATION ERROR:",

      error

    );



    return NextResponse.json(

      {

        error:"Calculation failed"

      },

      {

        status:500

      }

    );


  }


}