export const BOOKING_INTENT_RATE = 0.80;

export const BOOKING_CONVERSION_RATE = 0.35;



export function generateRevenueReport({

  callVolume,

  missedPercent,

  patientValue

}: {

  callVolume:number;

  missedPercent:number;

  patientValue:number;

}) {


  const missedCallsPerMonth =

    callVolume *

    (missedPercent / 100);



  const lostBookingsPerMonth =

    missedCallsPerMonth *

    BOOKING_INTENT_RATE *

    BOOKING_CONVERSION_RATE;



  const lostRevenuePerMonth =

    lostBookingsPerMonth *

    patientValue;



  const lostRevenuePerYear =

    lostRevenuePerMonth * 12;



  const recoveryOpportunity =

    lostRevenuePerYear * 0.5;



  return {


    missedCallsPerMonth:

      Math.round(missedCallsPerMonth),



    lostBookingsPerMonth:

      Math.round(lostBookingsPerMonth),



    monthlyLoss:

      Math.round(lostRevenuePerMonth),



    yearlyLoss:

      Math.round(lostRevenuePerYear),



    recoveryOpportunity:

      Math.round(recoveryOpportunity),



    actions:[

      "Reduce missed call response time below 30 seconds",

      "Add after-hours appointment handling",

      "Track missed-call callback performance weekly"

    ]


  };


}