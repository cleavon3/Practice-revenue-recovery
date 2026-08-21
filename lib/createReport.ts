import { pdf } from "@react-pdf/renderer";
import RevenueReportPDF from "@/components/RevenueReportPDF";


export async function createReport({

  sessionId,

  lead

}: {

  sessionId:string;

  lead:any;

}) {


  try {

    console.log(
  "PDF DATA RECEIVED:",
  lead
);


    console.log(
  "PDF DATA RECEIVED:",
  lead
);

    const document = RevenueReportPDF({

      data: lead

    });



    const stream = await pdf(document).toBuffer();



    const chunks:any[] = [];



    for await (const chunk of stream as any) {

      chunks.push(chunk);

    }



    const pdfBuffer = Buffer.concat(chunks);



    console.log(

      "PDF BUFFER CREATED:",

      pdfBuffer.length

    );



    return {

      pdfBuffer

    };


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