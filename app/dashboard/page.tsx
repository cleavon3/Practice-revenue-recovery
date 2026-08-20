"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";


const supabase = createClient(

  process.env.NEXT_PUBLIC_SUPABASE_URL!,

  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

);



export default function DashboardPage(){


const router = useRouter();


const [leads,setLeads] = useState<any[]>([]);

const [filteredLeads,setFilteredLeads] = useState<any[]>([]);

const [filter,setFilter] = useState("all");

const [search,setSearch] = useState("");

const [loading,setLoading] = useState(true);






async function logout(){


await supabase.auth.signOut();


router.push("/login");


}








useEffect(()=>{


fetch("/api/dashboard")

.then(res=>res.json())

.then(data=>{


const allLeads=data.leads || [];


setLeads(allLeads);

setFilteredLeads(allLeads);

setLoading(false);


});


},[]);









function applyFilter(

type:string,

searchValue:string = search

){


setFilter(type);



let result=[...leads];




if(type==="paid"){


result=result.filter(

lead=>lead.status==="report_paid"

);


}



if(type==="booked"){


result=result.filter(

lead=>lead.status==="call_booked"

);


}



if(type==="new"){


result=result.filter(

lead=>lead.status==="new"

);


}






if(searchValue){


const text=searchValue.toLowerCase();



result=result.filter(lead=>

lead.email?.toLowerCase().includes(text)

||

lead.industry?.toLowerCase().includes(text)

||

lead.session_id?.toLowerCase().includes(text)

);


}



setFilteredLeads(result);


}








if(loading){


return (

<div style={{padding:40}}>

Loading dashboard...

</div>

);


}







const totalLeads=leads.length;



const paidReports=leads.filter(

lead=>lead.status==="report_paid"

).length;




const bookedCalls=leads.filter(

lead=>lead.status==="call_booked"

).length;




const clients=leads.filter(

lead=>lead.status==="client"

).length;





const revenue=paidReports * 17;





const pipelineValue=leads.reduce(

(total,lead)=>

total+(lead.lost_revenue_yearly || 0),

0

);







const pipeline=[


{

title:"New Leads",

data:leads.filter(

lead=>lead.status==="new"

)

},



{

title:"Report Purchased",

data:leads.filter(

lead=>lead.status==="report_paid"

)

},



{

title:"Call Booked",

data:leads.filter(

lead=>lead.status==="call_booked"

)

},



{

title:"Proposal Sent",

data:leads.filter(

lead=>lead.status==="proposal_sent"

)

},



{

title:"Client Won",

data:leads.filter(

lead=>lead.status==="client"

)

},



{

title:"Lost",

data:leads.filter(

lead=>lead.status==="lost"

)

}


];






return (

<main

style={{

padding:40,

background:"#f8fafc",

minHeight:"100vh"

}}

>


<div

style={{

display:"flex",

justifyContent:"space-between",

alignItems:"center"

}}

>


<h1>

Cleavon Revenue Dashboard

</h1>



<button

onClick={logout}

style={{

background:"#111827",

color:"#fff",

border:"none",

padding:"10px 20px",

borderRadius:8,

cursor:"pointer"

}}

>

Logout

</button>



</div>






<div

style={{

display:"grid",

gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",

gap:20,

marginTop:30

}}

>


<Card

title="Total Leads"

value={totalLeads}

/>



<Card

title="Paid Reports"

value={paidReports}

/>



<Card

title="Revenue"

value={`$${revenue}`}

/>



<Card

title="Pipeline Value"

value={`$${pipelineValue.toLocaleString()}`}

/>



<Card

title="Clients"

value={clients}

/>



</div>






<h2 style={{marginTop:50}}>

Sales Pipeline

</h2>






<div

style={{

display:"flex",

gap:20,

overflowX:"auto",

paddingBottom:20

}}

>


{

pipeline.map(column=>(


<PipelineColumn

key={column.title}

title={column.title}

leads={column.data}

/>


))

}


</div>

<h2 style={{marginTop:50}}>

Lead Database

</h2>





<input

placeholder="Search email, industry or session ID..."

value={search}

onChange={(e)=>{

setSearch(e.target.value);

applyFilter(filter,e.target.value);

}}

style={{

width:"100%",

padding:14,

borderRadius:8,

border:"1px solid #ddd",

marginTop:20

}}

/>







<div

style={{

display:"flex",

gap:10,

marginTop:20,

marginBottom:20

}}

>


<button onClick={()=>applyFilter("all")}>

All

</button>



<button onClick={()=>applyFilter("paid")}>

Paid

</button>



<button onClick={()=>applyFilter("booked")}>

Booked

</button>



<button onClick={()=>applyFilter("new")}>

New

</button>



</div>









<table width="100%">


<thead>

<tr>

<th>Email</th>

<th>Status</th>

<th>Revenue</th>

<th>Report</th>

</tr>

</thead>







<tbody>


{

filteredLeads.map((lead)=>(


<tr key={lead.id}>


<td>


<a

href={`/dashboard/leads/${lead.id}`}

style={{

color:"#2563eb",

textDecoration:"underline",

cursor:"pointer",

fontWeight:500

}}

>

{lead.email || "No email"}

</a>


</td>





<td>

{lead.status || "new"}

</td>





<td>

${lead.lost_revenue_yearly?.toLocaleString()}

</td>





<td>


{

lead.report_url

?

<a

href={lead.report_url}

target="_blank"

style={{

color:"#2563eb",

textDecoration:"underline"

}}

>

View PDF

</a>


:

"No Report"


}


</td>





</tr>


))


}


</tbody>



</table>







</main>

);


}









function Card({

title,

value

}:{

title:string;

value:any;

}){


return (

<div

style={{

background:"#ffffff",

padding:20,

borderRadius:12,

border:"1px solid #ddd"

}}

>


<p>

{title}

</p>



<h2>

{value}

</h2>


</div>

);


}









function PipelineColumn({

title,

leads

}:{

title:string;

leads:any[];

}){


return (

<div

style={{

minWidth:260,

background:"#ffffff",

padding:20,

borderRadius:12,

border:"1px solid #ddd",

minHeight:300

}}

>


<h3>

{title}

</h3>







{

leads.map(lead=>(


<div

key={lead.id}

style={{

background:"#f8fafc",

padding:15,

marginTop:15,

borderRadius:10

}}

>


<strong>

{lead.email || "No email"}

</strong>





<p>

${lead.lost_revenue_yearly?.toLocaleString()}

</p>






<a

href={`/dashboard/leads/${lead.id}`}

style={{

color:"#2563eb",

textDecoration:"underline",

cursor:"pointer"

}}

>

Open Lead

</a>




</div>


))


}




</div>

);


}