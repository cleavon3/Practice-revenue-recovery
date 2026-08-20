export async function sendReportEmail({

  email,

  monthlyLoss,

  yearlyLoss,

  pdfBuffer

}: {

  email:string;

  monthlyLoss:number;

  yearlyLoss:number;

  pdfBuffer: Buffer;


}) {


  const pdfBase64 = pdfBuffer.toString("base64");



  const response = await fetch(

    "https://api.brevo.com/v3/smtp/email",

    {

      method:"POST",

      headers:{


        "accept":"application/json",


        "api-key":

          process.env.BREVO_API_KEY!,


        "content-type":

          "application/json"


      },


      body:JSON.stringify({


        sender:{


          name:

            process.env.BREVO_SENDER_NAME ||

            "Cleavon Digital",



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


        <div

        style="

        font-family:Arial;

        padding:30px;

        "

        >



        <h2>

        Your Revenue Recovery Report Is Ready

        </h2>




        <p>

        Your personalised missed-call revenue

        recovery analysis has been completed.

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

        Your complete PDF report is attached.

        </p>




        <p>

        Ready to recover missed revenue?

        Book your AI Receptionist Strategy Call.

        </p>



        <a

        href="https://calendly.com/cleavondigital/marketing-ai-growth-strategy-session"

        style="

        display:inline-block;

        padding:12px 20px;

        background:#111827;

        color:white;

        text-decoration:none;

        border-radius:6px;

        "

        >

        Book Strategy Call

        </a>




        </div>


        `,



        attachment:[


          {

            content:

              pdfBase64,


            name:

              "Missed-Call-Revenue-Recovery-Report.pdf"


          }


        ]


      })


    }


  );





  if(!response.ok){


    const errorText = await response.text();



    console.error(

      "BREVO ERROR:",

      errorText

    );



    throw new Error(

      "Brevo email failed"

    );


  }





  const result = await response.json();



  console.log(

    "BREVO EMAIL SENT:",

    result

  );



  return result;


}