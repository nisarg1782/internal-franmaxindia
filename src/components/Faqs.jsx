import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import './design/Faqs.css';
import { getApiUrl } from '../utils/api';

export default function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch FAQs from the API
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      // Replace with the actual URL of your PHP script
      const response = await fetch(getApiUrl('get-faq.php'));
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      if (data.success) {
        // FIXED: The API returns data under the key 'faq', not 'faqs'.
        setFaqs(data.faq);
      } else {
        setError(data.message || 'Failed to fetch FAQs.');
        setFaqs([]);
      }
    } catch (err) {
      setError('Failed to fetch FAQs. Please check the server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Function to toggle the expansion of an FAQ item
  const toggleFaq = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="faqs-page-container">
      <div className="faqs-header">
        <h1 className="main-title">Frequently Asked Questions</h1>
        <p className="faqs-quote">
          "The wise man doesn't give the right answers, he poses the right questions."
        </p>
      </div>

      <div className="faqs-container">
        {loading && <div className="loading-message">Loading FAQs...</div>}
        {error && <div className="error-message">{error}</div>}
        
        {!loading && !error && faqs.length === 0 && (
          <div className="no-data-message">No FAQs found.</div>
        )}

        {!loading && !error && faqs.map((faq) => (
          <div
            key={faq.id}
            className={`faq-item ${expandedId === faq.id ? 'expanded' : ''}`}
          >
            <div className="faq-question" onClick={() => toggleFaq(faq.id)}>
              <h3>{faq.question}</h3>
              <div className="faq-icon">
                {expandedId === faq.id ? <FaMinus /> : <FaPlus />}
              </div>
            </div>
            {expandedId === faq.id && (
              <div className="faq-answer">
                <div 
                  className="scrollable-answer"
                  dangerouslySetInnerHTML={{ __html: faq.answer }} 
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
