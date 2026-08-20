"use client";

import { useState } from "react";
import RevenueResult from "./RevenueResult";


type ResultData = {

  monthlyLoss: number;

  yearlyLoss: number;

  sessionId: string;

};




export default function CalculatorForm() {


  const [callVolume, setCallVolume] = useState("");

  const [missedPercent, setMissedPercent] = useState("");

  const [patientValue, setPatientValue] = useState("");

  const [result, setResult] = useState<ResultData | null>(null);

  const [loading, setLoading] = useState(false);





  async function handleSubmit(
    e: React.FormEvent
  ) {


    e.preventDefault();


    setLoading(true);


    setResult(null);




    try {


      const response = await fetch(

        "/api/calculate",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            callVolume,

            missedPercent,

            patientValue

          })

        }

      );





      const data = await response.json();





      console.log(

        "CALCULATOR RESPONSE:",

        data

      );





      if(!response.ok){


        throw new Error(

          data.error || "Calculation failed"

        );


      }







      const formattedResult: ResultData = {


        monthlyLoss:

          Number(data.monthlyLoss || 0),



        yearlyLoss:

          Number(data.yearlyLoss || 0),



        sessionId:

          data.sessionId || ""


      };







      setResult(

        formattedResult

      );







    } catch(error){



      console.error(

        "CALCULATOR ERROR:",

        error

      );



    } finally {


      setLoading(false);


    }


  }







  return (

    <>


      <form

        onSubmit={handleSubmit}

        className="calculator"

      >



        <h2>

          Calculate your missed call revenue loss

        </h2>





        <label>

          Monthly call volume

        </label>



        <input

          type="number"

          placeholder="Example: 1000"

          value={callVolume}

          onChange={(e)=>
            setCallVolume(e.target.value)
          }

          required

        />






        <label>

          Percentage of missed calls

        </label>



        <input

          type="number"

          placeholder="Example: 25"

          value={missedPercent}

          onChange={(e)=>
            setMissedPercent(e.target.value)
          }

          required

        />






        <label>

          Average patient value

        </label>



        <input

          type="number"

          placeholder="Example: 500"

          value={patientValue}

          onChange={(e)=>
            setPatientValue(e.target.value)
          }

          required

        />






        <p className="hint">

          Use first-visit value or estimated lifetime patient value.

        </p>






        <button

          type="submit"

          disabled={loading}

        >

          {loading

            ? "Calculating..."

            : "Calculate My Lost Revenue"

          }


        </button>





      </form>









      {result && (

        <RevenueResult

          monthlyLoss={result.monthlyLoss}

          yearlyLoss={result.yearlyLoss}

          sessionId={result.sessionId}

        />

      )}






    </>

  );

}