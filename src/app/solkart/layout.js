import { Navbar } from "@/components/Navbar";
import "../globals.css";

export default function SolkartLayout({ children }) {
  return (
    <html>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
