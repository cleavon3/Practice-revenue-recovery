"use client";

import { useState, useRef } from "react";


export default function EmailCapture({

  result

}: {

  result: {

    monthlyLoss:number;

    yearlyLoss:number;

    sessionId:string;

  };

}) {


  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");


  const offerRef = useRef<HTMLDivElement>(null);




  async function handleSubmit(
    e: React.FormEvent
  ) {


    e.preventDefault();


    try {


      const response = await fetch(

        "/api/capture-lead",

        {

          method:"POST",

          headers:{

            "Content-Type":"application/json"

          },

          body: JSON.stringify({

            email,

            emailCaptured:true,

            sessionId: result.sessionId,

            monthlyLoss: result.monthlyLoss,

            yearlyLoss: result.yearlyLoss,

            industry:"dental"

          })

        }

      );



      const data = await response.json();



      if(data.success) {


        setMessage(
          "Your revenue snapshot has been saved."
        );



        setTimeout(() => {

          offerRef.current?.scrollIntoView({

            behavior:"smooth",

            block:"start"

          });

        },300);



      } else {


        setMessage(
          "Something went wrong. Please try again."
        );


      }


    } catch(error) {


      console.error(error);


      setMessage(
        "Unable to save your email. Please try again."
      );


    }


  }




  return (

    <section className="email-capture">



      <h3>
        Want this estimate sent to your inbox?
      </h3>



      <p>
        Get your free revenue snapshot before reviewing the full recovery report.
      </p>




      <form onSubmit={handleSubmit}>



        <input

          type="email"

          placeholder="Enter your email"

          value={email}

          onChange={(e)=>
            setEmail(e.target.value)
          }

          required

        />





        <button type="submit">

          Send My Free Snapshot

        </button>




      </form>





      {message && (

        <p>

          {message}

        </p>

      )}




      <div ref={offerRef} />



    </section>

  );

}