import { Navbar } from "@/components/Navbar";

export default function SolkartLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Spesialside</title>
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
