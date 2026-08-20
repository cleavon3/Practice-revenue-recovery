import { Suspense } from "react";


type Props = {

  searchParams: Promise<{

    session_id?: string;

  }>;

};



export default async function ReportSuccessPage({

  searchParams

}: Props) {


  const params = await searchParams;


  const sessionId = params.session_id || "";



  return (

    <Suspense>

      <ReportSuccessContent sessionId={sessionId} />

    </Suspense>

  );


}







function ReportSuccessContent({

sessionId

}:{

sessionId:string;

}) {



async function handleBookingClick(){


"use server";


await fetch(

`${process.env.NEXT_PUBLIC_APP_URL}/api/track-booking`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

sessionId

})

}

);



}





return (

<main>


<div className="container">


<section className="report-success">



<div className="success-badge">

Payment Successful

</div>





<h1>

Your Missed-Call Revenue Recovery Report

</h1>





<p className="subtitle">

Your personalised revenue recovery analysis is ready.
Review the opportunities your practice may be missing
and the actions you can take to recover them.

</p>





<div className="report-box">


<h2>

Your report includes:

</h2>



<ul>


<li>
Full annual missed-call revenue projection
</li>


<li>
Industry benchmark comparison
</li>


<li>
Three specific recovery actions for your practice
</li>


<li>
Revenue recovery scenario showing potential upside
</li>


<li>
AI receptionist opportunity assessment
</li>


</ul>


</div>





<div className="cta-box">


<h2>

Ready to recover the missed revenue?

</h2>




<p>

Book a free strategy call to see how an AI receptionist
can help your practice capture missed patient enquiries
and convert more opportunities.

</p>




<form action={handleBookingClick}>


<button

className="button-link"

>

Book Your Free Call

</button>


</form>



</div>




</section>


</div>


</main>

);


}