import type { Metadata } from "next";
import "./global.css";
import Navbar from "@/components/Navbar/Navbar";
import { AuthProvider } from "@/Context/Context";
export const metadata: Metadata = {
  title: "Skill Bridge- Let's Code",
  description: "SBDGLM - Skill Bridge for Learning with Mentor",
  // icons: {
  //   icon: "/icon.png",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png" type="image/png" />
      </head>

      <body className="antialiased">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
