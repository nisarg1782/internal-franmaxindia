import React, { useEffect, useState } from 'react';
import './PricingPlan.css';
import { FaCheckCircle } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../utils/api';

// Razorpay script loader
const loadRazorpay = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PricingPlans = () => {
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const navigate = useNavigate();

  // Check user session
  useEffect(() => {
    const sessionData = localStorage.getItem('investor_session');
    if (sessionData) {
      const userData = JSON.parse(sessionData);
      if (userData.user_type === 'investor') {
        setUser(userData);
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  // Fetch plans
  useEffect(() => {
    fetch(getApiUrl('get-investor-plan-benifits.php'))
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPlans(data.plans);
        }
      })
      .catch(err => console.error('Error fetching plans:', err));
  }, []);

  // Start Razorpay payment
  const startPayment = async (plan) => {
    if (!user) {
      alert('Please login as investor to proceed.');
      return;
    }

    setLoadingPayment(true);

    const razorpayLoaded = await loadRazorpay('https://checkout.razorpay.com/v1/checkout.js');
    if (!razorpayLoaded) {
      alert('Failed to load Razorpay. Check your internet connection.');
      setLoadingPayment(false);
      return;
    }

    try {
      const options = {
        key: 'rzp_live_R80fc1Istwbzk9', // Replace with your live key
        amount: plan.price * 100,
        currency: 'INR',
        name: 'FRANMAX INDIA',
        description: 'Payment for your selected plan',
        image: 'http://franmaxindia.com/images/icon.png',
        theme: { color: '#156beb' },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.mobile
        },
        handler: async function (response) {
          try {
            const paymentDateTime = new Date().toISOString();

            const verifyResp = await fetch(getApiUrl('submit_investor_payment.php'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                payment_id: response.razorpay_payment_id,
                payment_date_time: paymentDateTime,
                user_id: user.id,
                plan_id: plan.id,
                amount: plan.price,
                month: plan.time_duration // Ensure this field is correct (integer)
              })
            });

            const verifyData = await verifyResp.json();
            if (verifyData.status === 'success') {
              alert(`Payment successful!\nPlan Start: ${verifyData.plan_start_date}\nPlan End: ${verifyData.plan_end_date}`);
            } else {
              alert('Payment recorded, but server returned an error: ' + verifyData.message);
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('Payment successful, but server verification failed.');
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error('Payment error:', err);
      alert('Something went wrong while initiating payment.');
    }

    setLoadingPayment(false);
  };

  return (
    <div className="pricing-wrapper">
      <Sidebar />
      <div className="pricing-main">
        <h1 className="plans-title">Choose the Plan That Fits You Best</h1>
        <p className="plans-subtitle">
          All plans include unique benefits tailored to your growth.
        </p>

        <div className="plans-container">
          {plans.length === 0 ? (
            <p className="loading-msg">Loading plans...</p>
          ) : (
            plans.map((plan, i) => (
              <div className="plan-card" key={i}>
                <h3>{plan.name}</h3>
                <p className="price">₹{plan.price}</p>
                <p className="duration">{plan.time_duration} Month(s)</p>
                <ul className="features">
                  {(Array.isArray(plan.benefits) ? plan.benefits : []).map(
                    (benefit, idx) => (
                      <li key={idx}>
                        <FaCheckCircle className="icon" /> {benefit}
                      </li>
                    )
                  )}
                </ul>
                <button
                  className="get-started-btn"
                  onClick={() => startPayment(plan)}
                  disabled={loadingPayment}
                >
                  {loadingPayment ? 'Processing...' : 'Get Started'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
