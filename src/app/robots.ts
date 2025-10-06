import { MetadataRoute } from 'next';

/* START                               */
/* do NOT modify this by hand!         */
/* this code is altered automatically  */
/* by the build script.                */
const isProd = false;
/* END                                 */

export default function robots(): MetadataRoute.Robots {

  const host = process.env.DOMAIN_URL || "";

  const response = {
    'production': {
      rules: {
        userAgent: '*',
        allow: '/',
      },
      sitemap: `${host}/server-sitemap.xml`,
    },
    'default': {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: `${host}/server-sitemap.xml`,
    },
  }
  // in stage/dev environment must disallow everything; in prod everything must be allowed 
  return isProd ? response['production'] : response['default'];
}