import { NextResponse } from "next/server";
import { createReport } from "@/lib/createReport";
import fs from "fs";
import path from "path";


export async function GET() {


  try {


    const result = await createReport({

      sessionId:"test-12345",

      lead:{

        practice_name:"Bright Smile Dental",

        lost_revenue_monthly:28000,

        lost_revenue_yearly:336000

      }

    });




    const reportsFolder = path.join(

      process.cwd(),

      "public",

      "reports"

    );



    if(!fs.existsSync(reportsFolder)){

      fs.mkdirSync(

        reportsFolder,

        {
          recursive:true
        }

      );

    }




    const filePath = path.join(

      reportsFolder,

      "report-test-12345.pdf"

    );



    fs.writeFileSync(

      filePath,

      result.pdfBuffer

    );





    console.log(

      "PDF SAVED:",

      filePath

    );





    return NextResponse.json({

      success:true,

      file:

        "/reports/report-test-12345.pdf"

    });




  } catch(error){


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