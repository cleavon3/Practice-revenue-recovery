import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link
} from "@react-pdf/renderer";

import fs from "fs";



const styles = StyleSheet.create({


  page: {

    padding:40,

    fontSize:11,

    fontFamily:"Helvetica"

  },



  logo:{

    width:120,

    marginBottom:20

  },



  title:{

    fontSize:22,

    marginBottom:8,

    fontWeight:"bold"

  },



  subtitle:{

    fontSize:13,

    marginBottom:15

  },



  heading:{

    fontSize:16,

    marginTop:18,

    marginBottom:10,

    fontWeight:"bold"

  },



  text:{

    marginBottom:8,

    lineHeight:1.4

  },



  box:{

    padding:15,

    backgroundColor:"#f3f4f6",

    marginVertical:15

  },



  label:{

    fontSize:11

  },



  number:{

    fontSize:24,

    marginBottom:12,

    fontWeight:"bold"

  },



  practice:{

    fontSize:14,

    marginBottom:15

  },



  bullet:{

    marginBottom:8,

    lineHeight:1.3

  },



  button:{

    marginTop:25,

    backgroundColor:"#111827",

    color:"#ffffff",

    padding:12,

    textAlign:"center"

  },



  footer:{

    marginTop:35,

    fontSize:9,

    lineHeight:1.4

  }



});







function getLogoBase64(){


  const logoPath =

    process.cwd() + "/public/logo.png";



  const logo = fs.readFileSync(

    logoPath

  );



  return (

    `data:image/png;base64,${logo.toString("base64")}`

  );


}








export default function RevenueReportPDF({

  data

}:{

  data:any

}){



  const logo = getLogoBase64();



  const practiceName =

    data.practice_name ||

    "Dental Practice";





  const recoveryMonthly =

    Math.round(

      data.lost_revenue_monthly * 0.5

    );



  const recoveryYearly =

    Math.round(

      data.lost_revenue_yearly * 0.5

    );







return (

<Document>





{/* PAGE 1 */}

<Page size="A4" style={styles.page}>


<Image

src={logo}

style={styles.logo}

/>





<Text style={styles.title}>

Missed-Call Revenue Recovery Audit

</Text>



<Text style={styles.subtitle}>

Dental Practice Revenue Assessment

</Text>





<Text style={styles.practice}>

Prepared for:

{"\n"}

{practiceName}

</Text>







<View style={styles.box}>


<Text style={styles.label}>

Estimated Monthly Revenue Opportunity

</Text>


<Text style={styles.number}>

${data.lost_revenue_monthly.toLocaleString()}

</Text>





<Text style={styles.label}>

Estimated Annual Revenue Opportunity

</Text>


<Text style={styles.number}>

${data.lost_revenue_yearly.toLocaleString()}

</Text>



</View>









<Text style={styles.heading}>

How This Was Calculated

</Text>



<Text style={styles.text}>

This estimate is based on your practice's call volume,
missed-call rate, and average patient value, applied
against dental industry benchmarks.

Approximately 80% of missed calls represent genuine
booking-intent enquiries, and new-patient calls convert
at an average rate of 35% when answered.

These figures are conservative estimates designed to
highlight potential revenue leakage.

</Text>








<Text style={styles.heading}>

Where You Likely Stand

</Text>



<Text style={styles.text}>

Average dental practices convert roughly 50-53% of
answered calls into booked appointments.

Top-performing practices can achieve 75-85%.

When calls are missed, the revenue loss happens
before the conversion process even begins.

</Text>



</Page>








{/* PAGE 2 */}


<Page size="A4" style={styles.page}>


<Image

src={logo}

style={styles.logo}

/>





<Text style={styles.heading}>

Where Revenue Is Being Lost

</Text>




<Text style={styles.bullet}>

• Missed patient enquiries go unanswered and are rarely recovered quickly.

</Text>




<Text style={styles.bullet}>

• Calls outside business hours are lost without a system to capture the enquiry.

</Text>





<Text style={styles.bullet}>

• Slow follow-up reduces the chance of converting potential patients.

</Text>







<Text style={styles.heading}>

What You Could Recover

</Text>





<Text style={styles.text}>

Recovering even half of this revenue gap could represent approximately:

</Text>



<Text style={styles.number}>

${recoveryMonthly.toLocaleString()}/month

</Text>



<Text style={styles.number}>

${recoveryYearly.toLocaleString()}/year

</Text>





<Text style={styles.text}>

This is not guaranteed revenue. It represents a realistic improvement opportunity through better response, coverage, and follow-up systems.

</Text>





</Page>









{/* PAGE 3 */}


<Page size="A4" style={styles.page}>


<Image

src={logo}

style={styles.logo}

/>





<Text style={styles.heading}>

Three Actions Worth Taking This Month

</Text>





<Text style={styles.bullet}>

1. Reduce missed-call response time below 30 seconds.

The longer callers wait, the more likely they are to contact another practice.

</Text>





<Text style={styles.bullet}>

2. Add after-hours call handling.

Capture enquiries that happen outside normal office hours.

</Text>





<Text style={styles.bullet}>

3. Track missed-call callback performance weekly.

Measure how many missed enquiries receive same-day follow-up.

</Text>







</Page>









{/* PAGE 4 */}


<Page size="A4" style={styles.page}>


<Image

src={logo}

style={styles.logo}

/>





<Text style={styles.heading}>

How AI Revenue Recovery Fits

</Text>





<Text style={styles.text}>

An AI receptionist helps address these challenges by answering enquiries instantly, capturing patient information, and reducing lost opportunities from missed calls.

</Text>





<Text style={styles.bullet}>

Patient calls

</Text>



<Text style={styles.bullet}>

↓

</Text>



<Text style={styles.bullet}>

AI receptionist answers instantly

</Text>



<Text style={styles.bullet}>

↓

</Text>



<Text style={styles.bullet}>

Patient details captured

</Text>



<Text style={styles.bullet}>

↓

</Text>



<Text style={styles.bullet}>

Appointment opportunity created

</Text>








<Link

src="/ai-receptionist-demo"

style={styles.button}

>

Watch AI Receptionist Demo

</Link>









<Text style={styles.footer}>

Prepared by

{"\n"}

Cleavon A

{"\n"}

Founder & AI Revenue Recovery Consultant

{"\n"}

Skill Digital Solutions

{"\n\n"}

Helping dental practices recover lost patient revenue through AI-powered call handling and revenue recovery systems.

{"\n\n"}

Questions about your results?

Reply directly to the email that delivered this report.

</Text>





</Page>





</Document>

);


}