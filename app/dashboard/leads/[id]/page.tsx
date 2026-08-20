"use client";


import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";



export default function LeadDetailsPage(){


  const params = useParams();

  const router = useRouter();

  const id = params.id as string;



  const [lead,setLead] = useState<any>(null);

  const [loading,setLoading] = useState(true);

  const [status,setStatus] = useState("");

  const [saving,setSaving] = useState(false);

  const [message,setMessage] = useState("");






  useEffect(()=>{


    fetch(`/api/dashboard/leads/${id}`)

    .then(res=>res.json())

    .then(data=>{


      setLead(data.lead);

      setStatus(data.lead?.status || "new");

      setLoading(false);


    });


  },[id]);








  async function updateStatus(){


    setSaving(true);

    setMessage("");



    const response = await fetch(

      `/api/dashboard/leads/${id}`,

      {

        method:"PATCH",

        headers:{

          "Content-Type":"application/json"

        },

        body:JSON.stringify({

          status

        })

      }

    );




    if(response.ok){


      setMessage(

        "Status updated successfully"

      );


      setLead({

        ...lead,

        status

      });


    }


    else{


      setMessage(

        "Update failed"

      );


    }



    setSaving(false);


  }








  if(loading){


    return (

      <main style={page}>

        Loading lead...

      </main>

    );


  }







  if(!lead){


    return (

      <main style={page}>

        Lead not found

      </main>

    );


  }







  return (

    <main style={page}>




      <button

      onClick={()=>router.push("/dashboard")}

      style={backButton}

      >

        ← Back Dashboard

      </button>









      <section style={card}>


        <h1>

          Dental Practice Lead

        </h1>




        <h2>

          {lead.email || "No email"}

        </h2>



        <p>

          Industry:

          {" "}

          {lead.industry}

        </p>





        <div>


          <label>

            CRM Status

          </label>



          <br />


          <select

          value={status}

          onChange={(e)=>setStatus(e.target.value)}

          style={select}

          >


            <option value="new">

              New Lead

            </option>


            <option value="report_paid">

              Report Purchased

            </option>



            <option value="call_booked">

              Call Booked

            </option>



            <option value="proposal_sent">

              Proposal Sent

            </option>



            <option value="client">

              Client Won

            </option>



            <option value="lost">

              Lost

            </option>


          </select>





          <button

          onClick={updateStatus}

          style={button}

          >

            {

              saving

              ?

              "Saving..."

              :

              "Save Status"

            }


          </button>




          {

            message &&

            <p>

              {message}

            </p>

          }



        </div>



      </section>









      <section style={grid}>


        <Metric

        title="Monthly Opportunity"

        value={`$${lead.lost_revenue_monthly?.toLocaleString()}`}

        />


        <Metric

        title="Annual Opportunity"

        value={`$${lead.lost_revenue_yearly?.toLocaleString()}`}

        />



        <Metric

        title="Call Volume"

        value={lead.call_volume}

        />



        <Metric

        title="Patient Value"

        value={`$${lead.avg_patient_value}`}

        />



      </section>









      <section style={card}>


        <h2>

          Customer Journey

        </h2>



        <Journey

        done={lead.calculator_completed}

        text="Calculator Completed"

        />



        <Journey

        done={lead.report_purchased}

        text="Report Purchased"

        />



        <Journey

        done={lead.report_generated}

        text="PDF Generated"

        />



        <Journey

        done={lead.booking_cta_clicked}

        text="Strategy Call Booked"

        />



      </section>









      <section style={card}>


        <h2>

          Actions

        </h2>




        {

          lead.report_url &&


          <a

          href={lead.report_url}

          target="_blank"

          style={button}

          >

            View PDF Report

          </a>


        }



      </section>








    </main>

  );


}









function Metric({

title,

value

}:{

title:string;

value:any;

}){


return (

<div style={metric}>


<p>

{title}

</p>


<h2>

{value}

</h2>


</div>

);


}








function Journey({

done,

text

}:{

done:boolean;

text:string;

}){


return (

<p>

{

done

?

"✅"

:

"⭕"

}

{" "}

{text}

</p>

);


}









const page = {

padding:40,

background:"#f8fafc",

minHeight:"100vh"

};





const card = {

background:"#ffffff",

padding:30,

borderRadius:16,

border:"1px solid #e5e7eb",

marginBottom:30

};





const grid = {

display:"grid",

gridTemplateColumns:"repeat(4,1fr)",

gap:20

};





const metric = {

background:"#ffffff",

padding:20,

borderRadius:12,

border:"1px solid #e5e7eb"

};





const select = {

padding:12,

marginTop:10,

marginBottom:15,

width:250

};





const button = {

display:"inline-block",

padding:"12px 20px",

background:"#111827",

color:"#ffffff",

borderRadius:8,

textDecoration:"none",

border:"none",

cursor:"pointer",

marginLeft:10

};





const backButton = {

padding:"10px 15px",

marginBottom:20,

cursor:"pointer"

};