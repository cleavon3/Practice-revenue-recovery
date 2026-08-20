import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createReport } from "@/lib/createReport";
import { sendReportEmail } from "@/lib/sendReportEmail";



export async function POST(request:Request){


const body = await request.text();


const signature = request.headers.get(
"stripe-signature"
);



if(!signature){

return NextResponse.json(
{
error:"Missing signature"
},
{
status:400
}
);

}



let event:Stripe.Event;



try{


event = stripe.webhooks.constructEvent(

body,

signature,

process.env.STRIPE_WEBHOOK_SECRET!

);


}

catch(error){


console.error(
"WEBHOOK ERROR:",
error
);


return NextResponse.json(
{
error:"Invalid webhook"
},
{
status:400
}
);


}






if(event.type !== "checkout.session.completed"){


return NextResponse.json({

received:true

});


}







const session =

event.data.object as Stripe.Checkout.Session;





const sessionId =

session.metadata?.sessionId;




const customerEmail =

session.customer_details?.email ||

session.customer_email ||

null;





console.log(

"SESSION ID:",

sessionId

);



console.log(

"CUSTOMER EMAIL:",

customerEmail

);








if(!sessionId){


return NextResponse.json({

received:true

});


}








const {

data:lead,

error:leadError

}=await supabaseAdmin

.from("leads")

.select("*")

.eq(

"session_id",

sessionId

)

.single();







console.log(

"LEAD:",

lead

);



console.log(

"LEAD ERROR:",

leadError

);







if(leadError || !lead){


return NextResponse.json({

received:true

});


}









const {

pdfBuffer

}=await createReport({

sessionId,

lead

});







console.log(

"PDF CREATED:",

pdfBuffer.length

);









await supabaseAdmin

.from("leads")

.update({

report_purchased:true,

report_generated:true,

email:customerEmail,

email_captured:

customerEmail ? true:false,

report_generated_at:

new Date().toISOString()

})

.eq(

"session_id",

sessionId

);









if(customerEmail){



await sendReportEmail({

email:customerEmail,

monthlyLoss:

lead.lost_revenue_monthly,

yearlyLoss:

lead.lost_revenue_yearly,

pdfBuffer

});



console.log(

"EMAIL SENT"

);


}

else{


console.log(

"NO EMAIL"

);


}







return NextResponse.json({

received:true

});


}