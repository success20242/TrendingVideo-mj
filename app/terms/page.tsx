import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions | TrendifyTube",
  description:
    "Read our Terms & Conditions for TrendifyTube, covering Google Analytics, AdSense, affiliate links, CMP compliance and more.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://trendifyhub.vercel.app/terms",
  },
}

export default function Terms() {
  return (
    <div className="min-h-screen p-6 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📄 Terms and Conditions</h1>

        <p className="mb-4">
          <strong>Effective Date:</strong> June 23, 2025
        </p>
        <p className="mb-4">
          <strong>Website:</strong>{" "}
          <a
            href="https://trendifyhub.vercel.app"
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://trendifyhub.vercel.app
          </a>
        </p>

        <p className="mb-4">
          Welcome to <strong>TrendifyTube</strong>. By accessing or using our website, you agree to the following Terms
          and Conditions. Please read them carefully.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">1. Introduction</h2>
        <p className="mb-4">
          TrendifyTube provides access to trending YouTube videos by country, paired with smart shopping suggestions
          including Amazon and 3Kings Boutique deals.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">2. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing our website, you confirm that you accept these Terms and agree to comply with them.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">3. Use of the Website</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Do not misuse the site or attempt unauthorized access</li>
          <li>Do not copy content without permission</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-2">4. Affiliate Disclosure</h2>
        <p className="mb-4">
          We may earn commissions from purchases made through links to Amazon and 3Kings Boutique. These do not affect
          your price.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">5. Analytics</h2>
        <p className="mb-4">
          We use Google Analytics to monitor traffic. You can opt out at{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google’s opt-out page
          </a>
          .
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">6. Advertisements</h2>
        <p className="mb-4">
          We show ads via Google AdSense and comply with Google’s policies. Users from the EEA, UK, and Switzerland will
          see a consent popup.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">7. Cookies & Consent</h2>
        <p className="mb-4">
          Cookies help us personalize and measure content and ads. You can manage preferences via our CMP popup or
          browser settings.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">8. External Links</h2>
        <p className="mb-4">
          We’re not responsible for content or practices on third-party sites like YouTube, Amazon, or Facebook.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">9. Intellectual Property</h2>
        <p className="mb-4">
          All content is owned by TrendifyTube or licensors. No copying without written permission.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">10. Updates</h2>
        <p className="mb-4">We may update these terms and will reflect changes on this page.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">11. Contact</h2>
        <p className="mb-4">
          Email:{" "}
          <a href="mailto:qualitygoodsblog@gmail.com" className="text-blue-500 underline">
            qualitygoodsblog@gmail.com
          </a>
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">12. Jurisdiction</h2>
        <p className="mb-4">
          These Terms are governed by the laws of the United Arab Emirates or local laws if applicable.
        </p>
      </div>
    </div>
  )
}
