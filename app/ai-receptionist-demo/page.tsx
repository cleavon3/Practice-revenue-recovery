import Image from "next/image";


export default function AIReceptionistDemoPage() {


return (

<main className="demo-page">



{/* HERO */}

<section className="premium-hero">


<Image

src="/logo.png"

alt="Skill Digital Solutions"

width={150}

height={70}

/>



<div className="trust-badges">

<span>
✓ Built For Dental Practices
</span>

<span>
✓ 24/7 Patient Call Handling
</span>

<span>
✓ Appointment Automation
</span>

</div>




<h1>

Recover Lost Dental Revenue
From Every Missed Call

</h1>




<p>

Your AI receptionist answers patient calls,
handles enquiries, books appointments,
and helps your practice capture revenue
that would otherwise go to competitors.

</p>





<h3 className="demo-label">

SEE THE AI RECEPTIONIST IN ACTION

</h3>



<div className="hero-video">


<iframe

src="https://www.youtube.com/embed/D72UWBFhbD4"

title="AI Receptionist Demo"

allowFullScreen

/>

</div>




<a

href="https://calendly.com/cleavondigital/marketing-ai-growth-strategy-session"

className="demo-main-button"

>

Book Your Revenue Recovery Strategy Call

</a>



</section>









{/* PROBLEM */}



<section className="problem-section">


<h2>

Every Missed Call Is A Lost Patient Opportunity

</h2>



<p>

Patients who cannot reach your practice often
move to the next available dental clinic.

</p>





<div className="problem-flow">


<div>

📞

<strong>
Patient Calls
</strong>

</div>



<span>
↓
</span>



<div>

❌

<strong>
Nobody Answers
</strong>

</div>



<span>
↓
</span>



<div>

🏥

<strong>
Competitor Wins Patient
</strong>

</div>


</div>





<div className="revenue-box">

A missed conversation can become
lost patient revenue.

</div>



</section>









{/* AI FEATURES */}


<section className="ai-section">


<h2>

Meet Your 24/7 AI Dental Receptionist

</h2>



<p>

A conversational AI agent that answers calls,
understands patient needs, and helps your practice
convert more opportunities.

</p>





<div className="ai-grid">



<div className="ai-card">

<h3>

01. Never Miss A Patient Call

</h3>


<p>

AI answers instantly, including evenings,
weekends, and busy periods.

</p>

</div>






<div className="ai-card">

<h3>

02. Understand Patient Needs

</h3>


<p>

Natural conversations without frustrating
phone menus.

</p>

</div>







<div className="ai-card">

<h3>

03. Convert Calls Into Appointments

</h3>


<p>

Book, reschedule, cancel appointments,
and collect patient information.

</p>

</div>







<div className="ai-card">

<h3>

04. Complete Patient Follow-Up

</h3>


<p>

Send confirmation emails and keep patients
moving through the booking process.

</p>

</div>



</div>



</section>









{/* CONVERSATION */}



<section className="conversation-section">


<h2>

A Real Patient Conversation

</h2>





<div className="conversation-box">


<div className="patient">

Patient:

<br/>

"I need to book a teeth cleaning appointment."

</div>





<div className="ai-message">

AI Receptionist:

<br/>

"Of course, I can help with that.
What day works best for you?"

</div>






<div className="patient">

Patient:

<br/>

"Next Tuesday afternoon."

</div>






<div className="ai-message">

AI Receptionist:

<br/>

"I have 2:30 PM available.
Would you like me to reserve that appointment?"

</div>



</div>



</section>









{/* WORKFLOW */}



<section className="workflow-section">


<h2>

From Patient Call To Confirmed Appointment

</h2>





<div className="workflow-box">


<div>
Patient Call
</div>


<span>
↓
</span>


<div>
AI Understands Intent
</div>


<span>
↓
</span>


<div>
Book / Reschedule / Cancel
</div>


<span>
↓
</span>


<div>
Google Calendar
</div>


<span>
↓
</span>


<div>
Confirmation Email
</div>



</div>


</section>









{/* REPORT CONNECTION */}



<section className="value-section">


<h2>

Your Revenue Recovery Report Identified The Problem.
AI Helps Solve It.

</h2>




<div className="value-grid">


<div>
Reduce missed calls
</div>


<div>
Capture after-hours enquiries
</div>


<div>
Improve response time
</div>


<div>
Increase appointments
</div>


</div>



</section>









{/* FINAL CTA */}



<section className="final-demo-section">


<h2>

Your Competitors Are Answering
The Calls You Miss

</h2>



<p>

See how AI can help your practice recover
lost patient opportunities.

</p>



<a

href="https://calendly.com/cleavondigital/marketing-ai-growth-strategy-session"

className="final-button"

>

Book My Revenue Recovery Strategy Call

</a>



</section>





</main>


);


}