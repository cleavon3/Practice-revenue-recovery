import fs from "fs/promises";


export async function sendReportEmail({

  email,

  reportUrl,

  monthlyLoss,

  yearlyLoss,

  pdfPath


}: {

  email:string;

  reportUrl:string;

  monthlyLoss:number;

  yearlyLoss:number;

  pdfPath:string;


}) {


  // Read PDF file

  const pdfBuffer = await fs.readFile(pdfPath);


  const pdfBase64 = pdfBuffer.toString("base64");




  const response = await fetch(

    "https://api.brevo.com/v3/smtp/email",

    {

      method:"POST",

      headers:{

        "accept":"application/json",

        "api-key": process.env.BREVO_API_KEY!,

        "content-type":"application/json"

      },


      body: JSON.stringify({


        sender:{

          name:

            process.env.BREVO_SENDER_NAME || "Cleavon Digital",


          email:

            process.env.BREVO_SENDER_EMAIL

        },



        to:[

          {

            email

          }

        ],



        subject:

          "Your Missed-Call Revenue Recovery Report",




        htmlContent:`


        <div style="font-family:Arial;padding:30px">


        <h2>
        Your Revenue Recovery Report Is Ready
        </h2>



        <p>
        Your personalised revenue recovery analysis is complete.
        </p>



        <h2>
        Monthly Opportunity:
        $${monthlyLoss.toLocaleString()}
        </h2>



        <h2>
        Annual Opportunity:
        $${yearlyLoss.toLocaleString()}
        </h2>




        <p>
        Your complete report is attached to this email.
        </p>




        <a

        href="http://localhost:3000${reportUrl}"

        style="
        display:inline-block;
        padding:12px 20px;
        background:#111;
        color:white;
        text-decoration:none;
        border-radius:6px;
        "

        >

        View Online Report

        </a>




        <p style="margin-top:30px">

        Ready to recover missed revenue?

        Book your AI Receptionist Strategy Call.

        </p>



        </div>


        `,



        attachment:[

          {

            content:pdfBase64,

            name:"Missed-Call-Revenue-Recovery-Report.pdf"

          }

        ]


      })

    }

  );





  if(!response.ok){


    const error = await response.text();


    console.error(

      "BREVO STATUS:",

      response.status

    );


    console.error(

      "BREVO ERROR RESPONSE:",

      error

    );


    throw new Error(

      "Brevo email failed"

    );


  }





  const result = await response.json();



  console.log(

    "BREVO EMAIL SUCCESS:",

    result

  );



  return result;


}