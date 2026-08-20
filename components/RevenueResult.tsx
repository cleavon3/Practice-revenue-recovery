"use client";


import { useEffect } from "react";

import ReportOffer from "./ReportOffer";

import EmailCapture from "./EmailCapture";




type RevenueResultProps = {

  monthlyLoss:number;

  yearlyLoss:number;

  sessionId:string;

};




declare global {

  interface Window {

    fbq?: (...args:any[]) => void;

    gtag?: (...args:any[]) => void;

  }

}





export default function RevenueResult({

  monthlyLoss,

  yearlyLoss,

  sessionId

}: RevenueResultProps) { console.log(
  "🔥 REVENUE RESULT RENDERED",
  {
    monthlyLoss,
    yearlyLoss,
    sessionId
  }
);



  useEffect(() => {


    console.log(
      "Revenue result displayed"
    );



    // META PIXEL

    if(window.fbq){


      window.fbq(

        "trackCustom",

        "calculator_completed",

        {

          monthly_loss: monthlyLoss,

          yearly_loss: yearlyLoss

        }

      );


      console.log(
        "Meta calculator_completed fired"
      );


    }





    // GOOGLE ADS

    if(window.gtag){


      window.gtag(

        "event",

        "calculator_completed",

        {

          monthly_loss: monthlyLoss,

          yearly_loss: yearlyLoss

        }

      );


      console.log(
        "Google calculator_completed fired"
      );


    }



  }, [

    monthlyLoss,

    yearlyLoss,

    sessionId

  ]);







  return (

    <section className="result">


      <h2>
        Your practice may be losing approximately:
      </h2>



      <h3>
        ${monthlyLoss.toLocaleString()}/month
      </h3>



      <p>
        Estimated annual revenue loss:
      </p>



      <strong>
        ${yearlyLoss.toLocaleString()}
      </strong>



      <p>
        Estimated using industry-average call-handling data.
      </p>





      <EmailCapture

        result={{

          monthlyLoss,

          yearlyLoss,

          sessionId

        }}

      />





      <ReportOffer

        sessionId={sessionId}

      />



    </section>

  );

}