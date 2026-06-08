import "./globals.css";

export const metadata = {
  title: "WearWise AI",
  description: "Amazon-first AI personal stylist MVP for North America.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
