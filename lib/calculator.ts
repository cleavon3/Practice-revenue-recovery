export const CALCULATOR_CONSTANTS = {

  BOOKING_INTENT_RATE: 0.80,

  BOOKING_CONVERSION_RATE: 0.35

};



export function calculateLostRevenue(

  callVolume:number,

  missedPercent:number,

  patientValue:number

) {


  const missedCallsPerMonth =

    callVolume *
    (missedPercent / 100);



  const lostBookingsPerMonth =

    missedCallsPerMonth *

    CALCULATOR_CONSTANTS.BOOKING_INTENT_RATE *

    CALCULATOR_CONSTANTS.BOOKING_CONVERSION_RATE;



  const lostRevenuePerMonth =

    lostBookingsPerMonth *

    patientValue;



  return {


    missedCallsPerMonth:
    Math.round(missedCallsPerMonth),


    lostBookingsPerMonth:
    Math.round(lostBookingsPerMonth),


    monthlyLoss:
    Math.round(lostRevenuePerMonth),


    yearlyLoss:
    Math.round(lostRevenuePerMonth * 12)

  };


}