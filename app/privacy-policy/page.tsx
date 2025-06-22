import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - TrendifyTube",
  robots: {
    index: false,
    follow: false,
  },
}

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

      <p className="mb-4">
        At TrendifyTube, accessible from https://trendifyhub.vercel.app, one of our main priorities is the privacy of
        our visitors. This Privacy Policy document outlines the types of information that are collected and recorded by
        TrendifyTube and how we use it.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <p className="mb-4">
        We do not collect personally identifiable information unless you voluntarily provide it to us, such as through
        subscription or contact forms. We may collect data like:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Device and browser type</li>
        <li>IP address and general location</li>
        <li>Pages visited and interaction behavior</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <p className="mb-4">Information collected may be used for:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Improving user experience</li>
        <li>Analyzing website traffic via Google Analytics</li>
        <li>Displaying relevant ads using Google AdSense</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Cookies and Web Beacons</h2>
      <p className="mb-4">
        Like many websites, TrendifyTube uses cookies to store information including visitor preferences and the pages
        on the website that the visitor accessed or visited. This information is used to optimize the user experience.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Google AdSense & Analytics</h2>
      <p className="mb-4">
        We use Google AdSense to display ads and Google Analytics to understand visitor interactions. Google may use
        cookies and collect data to personalize content and ads. You can review Google’s policies{" "}
        <a
          className="text-blue-600 underline"
          href="https://policies.google.com/technologies/partner-sites"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>
        .
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Your Consent</h2>
      <p className="mb-4">By using our website, you consent to our Privacy Policy and agree to its terms.</p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">6. Updates</h2>
      <p className="mb-4">
        This policy may be updated from time to time. Any changes will be reflected on this page with a revised date.
      </p>

      <p className="text-sm text-gray-500 mt-8">Last updated: June 2025</p>
    </div>
  )
}
