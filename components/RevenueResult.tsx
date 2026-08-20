import ReportOffer from "./ReportOffer";
import EmailCapture from "./EmailCapture";


type RevenueResultProps = {

  monthlyLoss:number;

  yearlyLoss:number;

  sessionId:string;

};



export default function RevenueResult({

  monthlyLoss,

  yearlyLoss,

  sessionId

}: RevenueResultProps) {



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