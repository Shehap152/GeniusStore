import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, ogImage, ogUrl }) => {
  const siteName = "TopUp Store";
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Instant Game Credits`;

  return (
    <Helmet>
      {/* Standard SEO */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:site_name" content={siteName} />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {description && <meta property="og:description" content={description} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
};

export default SEO; 