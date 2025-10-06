import { GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";
import { Roboto } from 'next/font/google'
import "@/app/styles/globals.scss";

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

const GTM_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || "";
const OT_DOMAIN = process.env.ONE_TRUST_DATA_DOMAIN_SCRIPT || "";

export default async function RootLayout({
  params,
  children,
}: {
  params: { locale: string };
  children: React.ReactNode;
}) {
  return (
    <html lang={params.locale} className={roboto.className}>
      <body>
        {children}
        <Script
          dangerouslySetInnerHTML={{
            __html: `
              // Define dataLayer and the gtag function.
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
                        
              // Set default consent to 'denied' as a placeholder
              // Determine actual values based on your own requirements
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied'
              });`,
          }}
        />

        <GoogleTagManager gtmId={GTM_ID} />
        <Script src={`https://cdn.cookielaw.org/consent/${OT_DOMAIN}/OtAutoBlock.js`} />
        <Script
          src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
          data-domain-script={OT_DOMAIN}
        />
        <Script
          id="onetrust-optanon"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function OptanonWrapper() { }
            `,
          }}
        ></Script>
      </body>
    </html>
  );
}
