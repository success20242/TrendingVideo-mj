import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions - TrendifyTube",
  robots: {
    index: false,
    follow: false,
  },
}

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>

      <p className="mb-4">
        Welcome to TrendifyTube! These terms and conditions outline the rules and regulations for the use of our
        website, located at <strong>https://trendifyhub.vercel.app</strong>.
      </p>

      <p className="mb-4">
        By accessing this website we assume you accept these terms and conditions. Do not continue to use TrendifyTube
        if you do not agree to take all of the terms and conditions stated on this page.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Use of the Website</h2>
      <p className="mb-4">
        You may browse and interact with content on TrendifyTube for personal, non-commercial use. We provide trending
        YouTube video listings and affiliate links to online marketplaces such as Amazon and other featured stores.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. Intellectual Property</h2>
      <p className="mb-4">
        All content on this site, including text, logos, and graphics, is the property of TrendifyTube or its content
        providers. Unauthorized use is strictly prohibited.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Affiliate Disclosure</h2>
      <p className="mb-4">
        TrendifyTube uses affiliate links, including Amazon Associate links. This means we may earn a small commission
        if you make a purchase through our links—at no extra cost to you.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. User Conduct</h2>
      <p className="mb-4">
        You agree not to misuse the site or engage in activity that may harm TrendifyTube or other users. Spamming,
        scraping, or reverse engineering is not allowed.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Limitation of Liability</h2>
      <p className="mb-4">
        We do our best to ensure the accuracy and quality of our content, but we are not liable for any errors,
        downtime, or actions taken based on content found on the site.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">6. External Links</h2>
      <p className="mb-4">
        Our site may link to external websites. We are not responsible for the content or privacy policies of those
        sites.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">7. Updates to These Terms</h2>
      <p className="mb-4">
        We may update these Terms from time to time. Any changes will be posted here and will take effect immediately
        upon posting.
      </p>

      <p className="text-sm text-gray-500 mt-8">Last updated: June 2025</p>
    </div>
  )
}
