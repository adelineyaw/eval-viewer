import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

// REPORT_TITLE is an environment variable: a setting stored outside the code.
// Set it in Vercel (Project → Settings → Environment Variables) and redeploy
// to change the title without editing any files.
const title = process.env.REPORT_TITLE ?? "Eval results viewer";

export const metadata: Metadata = {
  title,
  description: "A small viewer for repeated-run evaluation results.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link href="/" className="site-title">
            {title}
          </Link>
          <nav>
            <Link href="/">Summary</Link>
            <Link href="/cases">All cases</Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          Sample data only. Built with Next.js and deployed on Vercel.
        </footer>
      </body>
    </html>
  );
}
