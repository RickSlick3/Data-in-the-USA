import { Outfit, Ovo } from "next/font/google";
import "./globals.css";
import Menu from "./components/Menu";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ovo = Ovo({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata = {
  title: "Data in the USA",
  description: "Data in the USA project for Visualizing Data Interfaces",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth"> 
      <body
        className={`${outfit.className} ${ovo.className} antialiased leading-8 overflow-x-hidden`}
      >
        <Menu>
          {children}
        </Menu>
      </body>
    </html>
  );
}