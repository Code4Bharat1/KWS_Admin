import React from "react";
import "./globals.css";

export const metadata = {
  title: "Kokan Welfare Society - Portal",
  description:
    "Kokan Welfare Society, Kuwait (KWS) was founded in 2012 by like-minded people from the Kokan region (coastal Maharashtra) residing in Kuwait. The motivation behind the formation of this association is to bring the community on a common platform and work together for the development and welfare of all people, especially for the people from the Kokan region and generally from India.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/kws.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
