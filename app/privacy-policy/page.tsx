import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - TrendifyTube",
  description:
    "Our Privacy Policy outlines how TrendifyTube collects and uses your data while ensuring transparency and security.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">Last updated: June 22, 2025</p>

      <p className="mb-4">
        Welcome to <strong>TrendifyTube</strong> (accessible at{" "}
        <a href="https://trendifyhub.vercel.app" className="text-blue-500" target="_blank" rel="noopener noreferrer">
          https://trendifyhub.vercel.app
        </a>
        ). Your privacy is important to us.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Device & browser information</li>
        <li>IP address (anonymized)</li>
        <li>Pages visited, time spent, and referral source</li>
        <li>Consent preferences for ads and cookies</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. How We Use the Data</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Improve user experience</li>
        <li>Display trending videos by region</li>
        <li>Serve personalized Amazon or 3Kings Boutique product links</li>
        <li>Show relevant Google AdSense ads</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Third-Party Tools</h2>
      <p className="mb-4">We use services such as:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Google Analytics (visitor insights)</li>
        <li>Google AdSense (ads & monetization)</li>
        <li>Amazon Associates (affiliate products)</li>
        <li>Facebook page links (e.g., 3Kings Boutique)</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Your Privacy Rights</h2>
      <p className="mb-4">
        Users in the EEA, UK, or Switzerland can request data access, deletion, or withdraw consent at any time.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Security & Children’s Privacy</h2>
      <p className="mb-4">
        We implement industry-standard protection measures and do not knowingly collect data from children under 13.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">6. Updates</h2>
      <p className="mb-4">
        We may update this policy as needed. Changes will be posted here with the effective date above.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">7. Contact</h2>
      <p>
        For questions or concerns, contact us at:{" "}
        <a href="mailto:qualitygoodsblog@gmail.com" className="text-blue-500">
          qualitygoodsblog@gmail.com
        </a>
      </p>
    </div>
  )
}
