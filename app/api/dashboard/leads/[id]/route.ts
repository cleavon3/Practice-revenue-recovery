import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";


export async function GET(

request: Request,

context: {
  params: Promise<{id:string}>
}

){


const {id} = await context.params;


console.log(
  "FETCHING LEAD:",
  id
);



const {data,error}=await supabaseAdmin

.from("leads")

.select("*")

.eq("id",id)

.single();




if(error){

console.error(
"SUPABASE ERROR:",
error
);


return NextResponse.json(

{
error:"Lead not found"
},

{
status:404
}

);


}



return NextResponse.json({

lead:data

});


}







export async function PATCH(

request:Request,

context:{
params:Promise<{id:string}>
}

){


const {id}=await context.params;


const body=await request.json();


const {status}=body;



const {data,error}=await supabaseAdmin

.from("leads")

.update({

status

})

.eq("id",id)

.select()

.single();




if(error){


return NextResponse.json(

{
error:error.message
},

{
status:500
}

);


}




return NextResponse.json({

success:true,

lead:data

});


}