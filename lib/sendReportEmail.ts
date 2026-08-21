export async function sendReportEmail({

  email,

  practiceName,

  monthlyLoss,

  yearlyLoss,

  pdfBuffer


}: {

  email:string;

  practiceName:string;

  monthlyLoss:number;

  yearlyLoss:number;

  pdfBuffer:Buffer;


}) {



  const pdfBase64 =

    pdfBuffer.toString("base64");






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

            "Skill Digital Solutions",



          email:

            process.env.BREVO_SENDER_EMAIL


        },





        to:[

          {

            email

          }

        ],





        subject:


          "Your Dental Revenue Recovery Audit Is Ready",






        htmlContent:`



<div

style="

font-family:Arial,Helvetica,sans-serif;

padding:30px;

color:#111827;

"

>



<h2>

Your Revenue Recovery Audit Is Ready

</h2>



<p>

Hello,

</p>



<p>

Your personalised missed-call revenue recovery audit for

<strong>

${practiceName}

</strong>

has been completed.

</p>





<p>

Your assessment identified a potential revenue opportunity of:

</p>





<h2>

$${monthlyLoss.toLocaleString()}

per month

</h2>



<h2>

$${yearlyLoss.toLocaleString()}

per year

</h2>





<p>

Your detailed report explains:

</p>



<ul>

<li>

Where revenue opportunities may be getting lost

</li>


<li>

How your practice compares with industry benchmarks

</li>


<li>

Actions you can take to improve patient conversion

</li>


<li>

How AI-powered call handling can support recovery

</li>


</ul>





<p>

Your Revenue Recovery Audit is attached to this email.

</p>





<p>

After reviewing your report, see how an AI receptionist can help capture missed patient opportunities:

</p>





<a

href="https://YOUR-DOMAIN.com/ai-receptionist-demo"

style="

display:inline-block;

padding:12px 20px;

background:#111827;

color:#ffffff;

text-decoration:none;

border-radius:6px;

"

>

Watch AI Receptionist Demo

</a>





<p

style="margin-top:30px"

>

Prepared by:

<br/>

<strong>

Cleavon A

</strong>

<br/>

Founder & AI Revenue Recovery Consultant

<br/>

Skill Digital Solutions

</p>





</div>



`,





        attachment:[


          {

            content:

              pdfBase64,


            name:

              "Dental-Revenue-Recovery-Audit.pdf"


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