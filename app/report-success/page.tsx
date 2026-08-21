"use client";

import { useEffect, useState } from "react";


declare global {

  interface Window {

    fbq?: (...args:any[]) => void;

    gtag?: (...args:any[]) => void;

  }

}



export default function ReportSuccessPage(){


  const [sessionId,setSessionId] = useState("");




  useEffect(()=>{


    const params = new URLSearchParams(

      window.location.search

    );


    const id = params.get("session_id");


    setSessionId(id || "");




    if(!id){

      console.log(
        "NO SESSION ID"
      );

      return;

    }





    const alreadyTracked = sessionStorage.getItem(

      `purchase_tracked_${id}`

    );



    if(alreadyTracked){

      console.log(
        "PURCHASE ALREADY TRACKED"
      );

      return;

    }





    if(window.fbq){


      window.fbq(

        "track",

        "Purchase",

        {

          value:17.00,

          currency:"USD"

        },

        {

          eventID:id

        }

      );


      console.log(
        "META PURCHASE FIRED"
      );


    }





    if(window.gtag){


      window.gtag(

        "event",

        "conversion",

        {

          send_to:
          "AW-10984592761/7728258379",

          value:17.00,

          currency:"USD",

          transaction_id:id

        }

      );


      console.log(
        "GOOGLE PURCHASE FIRED"
      );


    }





    sessionStorage.setItem(

      `purchase_tracked_${id}`,

      "true"

    );




  },[]);









  function handleDemoClick(){


    window.location.href =
      "/ai-receptionist-demo";


  }







return (

<main>


<div className="container">


<section className="report-success premium-success">





<div className="success-badge">

✓ Payment Successful

</div>






<h1>

Your Revenue Recovery Report Is Ready

</h1>







<p className="subtitle">


Your personalised dental revenue assessment has been completed.

Inside your report you will discover where missed calls may be costing your practice revenue and how these opportunities can be recovered.


</p>









<div className="report-box">


<h2>

Your Report Includes

</h2>



<ul>


<li>
Missed-call revenue opportunity analysis
</li>


<li>
Dental industry benchmark comparison
</li>


<li>
Revenue recovery opportunities
</li>


<li>
Practical actions to improve patient capture
</li>


<li>
AI receptionist solution assessment
</li>


</ul>



</div>









<div className="cta-box demo-next-box">


<h2>

Your Next Step: See The AI Receptionist In Action

</h2>





<p>


Your report identified the missed revenue opportunity.

Now see how an AI receptionist answers calls, handles patient enquiries, books appointments, and helps dental practices recover lost opportunities.


</p>








<button

onClick={handleDemoClick}

className="demo-next-button"

>

Watch AI Receptionist Demo

</button>





</div>






</section>


</div>


</main>


);


}