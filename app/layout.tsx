import "./globals.css";
import { Providers } from "../store/providers";
import Navbar from "../components/Navbar";
import AnnouncementBanner from "../components/AnnouncementBanner"; // <--- ADD THIS LINE

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <AnnouncementBanner />  {/* This will now work! */}
          <Navbar />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
