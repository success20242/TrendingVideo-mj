import Link from "next/link"

export default function Footer() {
  return (
    <footer className="mt-12 py-6 border-t dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
      <p>
        © {new Date().getFullYear()} TrendifyTube •{" "}
        <Link href="/privacy-policy" className="text-blue-500 hover:underline">
          Privacy Policy
        </Link>
        {" | "}
        <Link href="/terms" className="text-blue-500 hover:underline">
          Terms & Conditions
        </Link>
      </p>
    </footer>
  )
}
