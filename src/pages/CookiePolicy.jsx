import React from 'react';
import '../components/design/CookiePolicy.css';

function CookiePolicy() {
  return (
    <div className="cookie-policy-container">
      <h1>Cookies & Privacy Policy</h1>
         <section className="terms-conditions">
        <p>
          What Are Cookies? Cookies are small text documents that Internet websites can use to provide a more efficient user experience. These documents contain strings that can be downloaded to your PC or mobile phone when you visit certain websites. Cookies enable websites to record your preferences, automatically sign you in, improve your browsing experience, and serve relevant advertising and marketing messages.
        </p>

        <p>
          Use Of Cookies On This Website: We use several first-party cookies (<strong>Franmax India</strong>) and third-party cookies (such as <strong>Google Analytics</strong>, <strong>Tawk.to</strong>, and <strong>Google Webmaster Tools</strong>) to track and improve your experience. We do not collect or record your name, address, phone number, or other personally identifiable information through cookies.
        </p>

        <p>
          These Cookies Are Used For: Collecting statistical data about website usage, helping us improve website functionality, showing relevant or customized content, and providing advertisers with data about visitor interactions.
        </p>

        <p>
          How To Manage And Delete Cookies: Most Internet browsers automatically accept cookies. You can change your settings to block cookies or notify you when cookies are set. For more information, please refer to your browser’s policy. Disabling cookies may affect your experience with certain components of our website. Temporary cookies are automatically deleted when you leave the website. Persistent cookies may remain until you delete them manually.
        </p>
      </section>
    </div>
  );
}

export default CookiePolicy;