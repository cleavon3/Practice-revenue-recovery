import { pdf } from "@react-pdf/renderer";
import fs from "fs/promises";
import path from "path";
import RevenueReportPDF from "@/components/RevenueReportPDF";



export async function createReport({

  sessionId,

  lead

}: {

  sessionId:string;

  lead:any;

}) {


  try {


    const document = RevenueReportPDF({

      data: lead

    });



    const buffer = await pdf(

      document

    ).toBuffer();





    const fileName =

      `report-${sessionId}.pdf`;





    const reportsFolder = path.join(

      process.cwd(),

      "public",

      "reports"

    );





    await fs.mkdir(

      reportsFolder,

      {

        recursive:true

      }

    );





    const filePath = path.join(

      reportsFolder,

      fileName

    );





    await fs.writeFile(

      filePath,

      buffer

    );





    const reportUrl =

      `/reports/${fileName}`;





    console.log(

      "PDF REPORT CREATED:",

      reportUrl

    );





    return reportUrl;



  } catch(error) {


    console.error(

      "PDF CREATION ERROR:",

      error

    );


    throw new Error(

      "Could not create PDF report"

    );


  }


}