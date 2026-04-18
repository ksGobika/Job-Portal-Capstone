import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-5xl font-extrabold text-blue-800 mb-6">
        Connect with Top Employers
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        The ultimate platform for job seekers to find opportunities and for employers to hire the best talent.
      </p>
      
      <div className="flex gap-4">
        <Link href="/jobs" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700">
          Browse Jobs
        </Link>
        <Link href="/login" className="bg-white border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50">
          Post a Job
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="p-6 bg-blue shadow rounded-xl">
          <h3 className="text-xl font-bold mb-2 text-gray-900">800k+ Jobs</h3>
          <p className="text-gray-500">Explore roles across all industries.</p>
        </div>
        <div className="p-6 bg-blue shadow rounded-xl">
          <h3 className="text-xl font-bold mb-2 text-gray-900">Verified Companies</h3>
          <p className="text-gray-500">Apply to trusted organizations.</p>
        </div>
        <div className="p-6 bg-blue shadow rounded-xl">
          <h3 className="text-xl font-bold mb-2 text-gray-900">Instant Alerts</h3>
          <p className="text-gray-500">Get notified about new openings.</p>
        </div>
      </div>
    </div>

    /*<div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
  

  <div className="p-8 bg-white shadow-xl rounded-2xl border border-gray-100 flex flex-col items-center">
    <div className="text-4xl mb-4">💼</div>
    <h3 className="text-2xl font-bold mb-2 text-gray-900">800k+ Jobs</h3>
    <p className="text-gray-600 font-medium">Explore roles across all industries and locations.</p>
  </div>


  <div className="p-8 bg-white shadow-xl rounded-2xl border border-gray-100 flex flex-col items-center">
    <div className="text-4xl mb-4">🏢</div>
    <h3 className="text-2xl font-bold mb-2 text-gray-900">Verified Companies</h3>
    <p className="text-gray-600 font-medium">Apply to trusted organizations and top startups.</p>
  </div>


  <div className="p-8 bg-white shadow-xl rounded-2xl border border-gray-100 flex flex-col items-center">
    <div className="text-4xl mb-4">🔔</div>
    <h3 className="text-2xl font-bold mb-2 text-gray-900">Instant Alerts</h3>
    <p className="text-gray-600 font-medium">Get notified immediately about new openings.</p>
  </div>

</div>*/
  );
}

