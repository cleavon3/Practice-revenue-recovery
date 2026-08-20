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

        "❌ NO SESSION ID — SKIPPING TRACKING"

      );

      return;

    }




    // DUPLICATE-FIRE GUARD — prevents double-counting the same
    // purchase if the page reloads or Stripe redirects twice
    const alreadyTracked = sessionStorage.getItem(

      `purchase_tracked_${id}`

    );



    if(alreadyTracked){


      console.log(

        "⏭️ PURCHASE ALREADY TRACKED FOR THIS SESSION"

      );



      return;


    }







    // META PURCHASE EVENT

    if(window.fbq){


      console.log(

        "🔥 META PURCHASE FIRED"

      );



      window.fbq(

        "track",

        "Purchase",

        {

          value:17.00,

          currency:"USD"

        },

        {

          eventID: id

        }

      );


    } else {


      console.log(

        "❌ META PIXEL NOT AVAILABLE"

      );


    }








    // GOOGLE ADS PURCHASE EVENT

    if(window.gtag){


      console.log(

        "🔥 GOOGLE PURCHASE FIRED"

      );



      window.gtag(

        "event",

        "conversion",

        {

          send_to:

            "AW-10984592761/7728258379",


          value:17.00,


          currency:"USD",


          transaction_id: id


        }

      );


    } else {


      console.log(

        "❌ GOOGLE TAG NOT AVAILABLE"

      );


    }






    sessionStorage.setItem(

      `purchase_tracked_${id}`,

      "true"

    );




  },[]);









  async function handleBookingClick(){



    try {



      await fetch(

        "/api/track-booking",

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



    } catch(error){



      console.error(

        "Booking tracking error:",

        error

      );



    }





    window.open(

      "https://calendly.com/cleavondigital/marketing-ai-growth-strategy-session",

      "_blank"

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
            and the actions you can take.

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







            <button

              onClick={handleBookingClick}

              className="button-link"

            >

              Book Your Free Call


            </button>





          </div>





        </section>



      </div>



    </main>


  );



}