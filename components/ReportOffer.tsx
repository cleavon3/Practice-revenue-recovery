"use client";

import { useState } from "react";


export default function ReportOffer({

  sessionId

}: {

  sessionId:string;

}) {


  const [loading, setLoading] = useState(false);



  async function handleCheckout() {


    console.log(
      "REPORT OFFER SESSION ID:",
      sessionId
    );


    setLoading(true);



    try {


      const response = await fetch(

        "/api/create-checkout",

        {

          method:"POST",

          headers:{

            "Content-Type":"application/json"

          },

          body: JSON.stringify({

            sessionId

          })

        }

      );



      console.log(
        "CHECKOUT RESPONSE STATUS:",
        response.status
      );



      const data = await response.json();



      console.log(
        "CHECKOUT RESPONSE DATA:",
        data
      );



      if(data.url) {


        window.location.href = data.url;


      } else {


        console.error(
          "No Stripe checkout URL returned"
        );


      }



    } catch(error) {


      console.error(
        "Checkout error:",
        error
      );


    } finally {


      setLoading(false);


    }


  }



  return (

    <section className="offer">


      <h2>
        Get your complete missed-call revenue recovery report.
      </h2>



      <p>
        Your $17 report includes:
      </p>



      <ul>

        <li>
          Full annual revenue projection
        </li>


        <li>
          Industry benchmark comparison
        </li>


        <li>
          Three specific recovery actions
        </li>


        <li>
          Revenue recovery scenario
        </li>


      </ul>



      <button

        onClick={handleCheckout}

        disabled={loading}

      >

        {loading

          ? "Opening Checkout..."

          : "Unlock My $17 Report"

        }


      </button>



    </section>

  );

}