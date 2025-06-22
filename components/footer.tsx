import Link from "next/link"

export default function Footer() {
  return (
    <footer className="mt-16 py-6 border-t dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
      <p>
        © {new Date().getFullYear()} TrendifyTube. All rights reserved. |
        <Link href="/privacy-policy" className="mx-2 text-blue-600 hover:underline">
          Privacy Policy
        </Link>
        |
        <Link href="/terms" className="ml-2 text-blue-600 hover:underline">
          Terms & Conditions
        </Link>
      </p>
    </footer>
  )
}
