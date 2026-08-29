export default function AIReceptionistCTA() {
  return (
    <section className="py-12 md:py-16">
      <div
        className="
          max-w-4xl
          mx-auto
          rounded-3xl
          bg-black
          text-white
          p-8
          md:p-12
          text-center
        "
      >
        <h2 className="text-3xl md:text-4xl font-bold">
          Found a Revenue Opportunity?
        </h2>

        <p
          className="
            mt-5
            max-w-2xl
            mx-auto
            text-gray-300
            leading-relaxed
          "
        >
          Your assessment identifies where missed patient enquiries may be
          affecting your practice. The next step is building a system that helps
          capture more conversations and support patient bookings.
        </p>

        <div
          className="
            mt-8
            grid
            md:grid-cols-3
            gap-4
            text-left
          "
        >
          <div
            className="
              bg-white/10
              rounded-xl
              p-4
            "
          >
            <p className="font-semibold">Answer Missed Calls</p>

            <p className="text-sm text-gray-300 mt-2">
              Capture opportunities when your team cannot respond immediately.
            </p>
          </div>

          <div
            className="
              bg-white/10
              rounded-xl
              p-4
            "
          >
            <p className="font-semibold">Capture Patient Details</p>

            <p className="text-sm text-gray-300 mt-2">
              Collect important enquiry information consistently.
            </p>
          </div>

          <div
            className="
              bg-white/10
              rounded-xl
              p-4
            "
          >
            <p className="font-semibold">Improve Booking Conversion</p>

            <p className="text-sm text-gray-300 mt-2">
              Create a faster response process for potential patients.
            </p>
          </div>
        </div>

        <a
          href="/ai-receptionist"
          className="
            inline-block
            mt-10
            px-8
            py-4
            rounded-xl
            bg-white
            text-black
            font-semibold
          "
        >
          See AI Receptionist Solution
        </a>
      </div>
    </section>
  );
}
