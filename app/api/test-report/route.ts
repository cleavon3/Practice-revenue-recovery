import { NextResponse } from "next/server";
import { createReport } from "@/lib/createReport";


export async function GET() {


  try {


    const result = await createReport({

      sessionId:"test-12345",

      lead:{

        lost_revenue_monthly:7000,

        lost_revenue_yearly:84000

      }

    });



    console.log(

      "CREATE REPORT RESULT:",

      result

    );



    return NextResponse.json({

      success:true,

      resultType:typeof result,

      result

    });



  } catch(error) {


    console.error(

      "PDF TEST ERROR:",

      error

    );



    return NextResponse.json(

      {

        success:false,

        error:String(error)

      },

      {

        status:500

      }

    );


  }


}