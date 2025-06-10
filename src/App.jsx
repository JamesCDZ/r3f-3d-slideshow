import React, { useEffect } from 'react';
import { Overlay } from './components/Overlay';

function App() {
  useEffect(() => {
    // GTM Script
    const gtmScript = document.createElement('script');
    gtmScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("set", "ads_data_redaction", true);
      
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window, document, 'script', 'dataLayer', 'GTM-KX6ZVQ5V');
    `;
    document.head.appendChild(gtmScript);

    // GTM NoScript
    const gtmNoScript = document.createElement('noscript');
    gtmNoScript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KX6ZVQ5V" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.appendChild(gtmNoScript);

    // Cleanup function
    return () => {
      if (gtmScript.parentNode) {
        gtmScript.parentNode.removeChild(gtmScript);
      }
      if (gtmNoScript.parentNode) {
        gtmNoScript.parentNode.removeChild(gtmNoScript);
      }
    };
  }, []);

  return (
    <>
      <Overlay />
    </>
  );
}

export default App;