import type { Metadata } from "next";

import Navbar from "@/components/navbar";
import { FooterColeta } from "@/components/footer";




export const metadata: Metadata = {
  title: "E-coleta",
  description: "Reciclagem de lixo eletrônico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
     <Navbar/>
        {children}
        <FooterColeta />
    </>
 
  );
}
