export default function TrustSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Understand Where Your Practice May Be Losing Patient Opportunities
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Your Revenue Recovery Assessment analyses your enquiry process and
          estimates the potential impact of missed patient conversations.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        <div
          className="
            border rounded-2xl
            p-6
            text-center
          "
        >
          <div className="text-3xl mb-4">📊</div>

          <h3 className="font-semibold text-lg">
            Revenue Opportunity Analysis
          </h3>

          <p className="mt-3 text-sm text-gray-600">
            Understand the potential revenue impact of missed patient enquiries.
          </p>
        </div>

        <div
          className="
            border rounded-2xl
            p-6
            text-center
          "
        >
          <div className="text-3xl mb-4">📈</div>

          <h3 className="font-semibold text-lg">Healthcare Benchmarking</h3>

          <p className="mt-3 text-sm text-gray-600">
            Compare your practice performance against relevant industry
            benchmarks.
          </p>
        </div>

        <div
          className="
            border rounded-2xl
            p-6
            text-center
          "
        >
          <div className="text-3xl mb-4">🚀</div>

          <h3 className="font-semibold text-lg">Recovery Recommendations</h3>

          <p className="mt-3 text-sm text-gray-600">
            Receive practical actions to improve enquiry response and
            conversion.
          </p>
        </div>
      </div>
    </section>
  );
}
