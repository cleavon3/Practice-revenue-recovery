export default function HeroSection() {
  return (
    <section className="text-center py-12 md:py-16">
      <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        Discover How Much Revenue Your Practice May Be Losing From Missed
        Patient Calls
      </h1>

      <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
        Get your personalised Revenue Recovery Assessment based on your practice
        type, enquiry volume, and missed-call opportunity.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <div className="px-4 py-2 rounded-full bg-gray-100 text-sm">
          ✓ Takes less than 2 minutes
        </div>

        <div className="px-4 py-2 rounded-full bg-gray-100 text-sm">
          ✓ Healthcare benchmarks
        </div>

        <div className="px-4 py-2 rounded-full bg-gray-100 text-sm">
          ✓ Personalised report
        </div>
      </div>

      <a
        href="#assessment"
        className="
          inline-block
          mt-10
          px-8
          py-4
          rounded-xl
          bg-black
          text-white
          font-semibold
        "
      >
        Calculate My Revenue Opportunity
      </a>
    </section>
  );
}
