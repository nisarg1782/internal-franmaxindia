import React, { useState, useEffect } from 'react';
import './brandDashboard.css';
import BrandSidebar from './BrandSidebar';
import BrandDashboardHeader from './BrandDashboardHeader';
import FilterBar from './FilterBar';
import DetailModal from './DetailModal';
import { FaPhoneAlt, FaEdit, FaSave, FaEye, FaWhatsapp } from 'react-icons/fa';
import { getApiUrl } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const statusOptions = ['open', 'contacted', 'not contacted', 'closed'];
const remarkOptions = ['interested', 'not interested', 'deal', 'not qualified', 'not received'];

const BrandInquiries = ({ openLoginModal }) => {
  const [brandId, setBrandId] = useState(null);
  const [isPremium, setIsPremium] = useState(null);
  const [visibleContacts, setVisibleContacts] = useState([]);
  const [editModeId, setEditModeId] = useState(null);
  const [editedStatus, setEditedStatus] = useState('');
  const [editedRemark, setEditedRemark] = useState('');
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});
  const [inquiries, setInquiries] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    status: 'All',
    remark: '',
    startDate: '',
    endDate: ''
  });
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const navigate = useNavigate();

  // Fetch brand_id from session
  useEffect(() => {
    const sessionData = localStorage.getItem('userSession');
    if (sessionData) {
      const brandData = JSON.parse(sessionData);
      if (brandData.user_type === 'brand') {
        setBrandId(brandData.id);
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleWhatsAppClick = (inq) => {
    fetch(getApiUrl('log-view-contact.php'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inquiry_id: inq.id,
        brand_id: brandId,
        description: 'clicked WhatsApp link'
      })
    }).catch(err => console.error('Failed to log WhatsApp click', err));

    const phoneNumber = inq.phone.replace(/\D/g, '');
    window.open(`https://wa.me/91${phoneNumber}`, '_blank');
  };

  // Check if brand is premium
  useEffect(() => {
    if (!brandId) return;
    const checkPremium = async () => {
      try {
        const res = await fetch(getApiUrl('check_brand_premium.php'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ brand_id: brandId })
        });
        const result = await res.json();
        setIsPremium(result.success && result.is_premium);
      } catch (err) {
        console.error("Failed to check premium status", err);
        setIsPremium(false);
      }
    };
    checkPremium();
  }, [brandId]);

  // Load inquiries only if premium
  useEffect(() => {
    if (brandId && isPremium === true) {
      fetch(getApiUrl(`get_inquiries_by_brand.php?brand_id=${brandId}`))
        .then(res => res.json())
        .then(data => setInquiries(data))
        .catch(err => console.error('Failed to load inquiries', err));
    }
  }, [brandId, isPremium]);

  const handleViewContact = (inquiryId) => {
    if (!visibleContacts.includes(inquiryId)) {
      setVisibleContacts(prev => [...prev, inquiryId]);
      fetch(getApiUrl('log-view-contact.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inquiry_id: inquiryId, brand_id: brandId, description: 'viewed contact details' })
      });
    }
  };

  const handleEditClick = (inq) => {
    setEditModeId(inq.id);
    setEditedStatus(inq.status);
    setEditedRemark(inq.remark || '');
    setComment('');
    setErrors({});
  };

  const handleSave = async (id) => {
    if (!comment.trim()) {
      setErrors({ comment: 'Comment is required' });
      return;
    }
    try {
      const res = await fetch(getApiUrl('update_inquiry_status.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: editedStatus,
          remark: editedRemark,
          comment
        })
      });
      const result = await res.json();
      if (result.success) {
        const updated = inquiries.map(inq =>
          inq.id === id
            ? {
                ...inq,
                status: editedStatus,
                remark: editedRemark,
                comment,
                updated_at: result.updated_at
              }
            : inq
        );
        setInquiries(updated);
        setEditModeId(null);
        setComment('');
        setErrors({});
      } else {
        alert("Failed to save changes.");
      }
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesName = inq.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesStatus = filters.status === 'All' || inq.status === filters.status;
    const matchesRemark = !filters.remark || inq.remark === filters.remark;
    const matchesState = !filters.stateName || inq.state === filters.stateName;
    const matchesCity = !filters.city || inq.city === filters.city;
    const inquiryDate = new Date(inq.date);
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;
    const matchesDate = (!startDate || inquiryDate >= startDate) && (!endDate || inquiryDate <= endDate);
    return matchesName && matchesStatus && matchesRemark && matchesState && matchesCity && matchesDate;
  });

  if (isPremium === null || !brandId) {
    return <div className="brand-crm-container"><p>Loading...</p></div>;
  }

  if (isPremium === false) {
    return (
      <div className="brand-crm-container">
        <BrandSidebar openLoginModal={openLoginModal} />
        <div className="brand-crm-main">
          <BrandDashboardHeader />
          <div className="upgrade-box">
            <h2>Upgrade to Premium</h2>
            <p>This feature is available only for premium brands. Please contact support to upgrade your plan.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="brand-crm-container">
      <BrandSidebar openLoginModal={openLoginModal} />
      <div className="brand-crm-main">
        <BrandDashboardHeader />
        <div className="inquiries-section">
          <h2>Franchise Inquiries</h2>
          <FilterBar filters={filters} onChange={setFilters} />
          <table className="inquiries-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Remark</th>
                <th>State</th>
                <th>Enquiry Date</th>
                <th>Whatsapp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.map((inq, index) => (
                <tr key={inq.id} className="inquiry-row">
                  <td>{index + 1}</td>
                  <td>{inq.name}</td>
                  <td>
                    {visibleContacts.includes(inq.id) ? (
                      <>
                        📞 {inq.phone} <br /> ✉️ {inq.email}
                      </>
                    ) : (
                      <button className="icon-btn green" onClick={() => handleViewContact(inq.id)}>
                        <FaPhoneAlt className="icon" />
                        <span className="btn-label">Show</span>
                      </button>
                    )}
                  </td>
                  <td>
                    {editModeId === inq.id ? (
                      <select value={editedStatus} onChange={(e) => setEditedStatus(e.target.value)}>
                        {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <span className={`status-badge ${inq.status.replace(/\s+/g, '').toLowerCase()}`}>
                        {inq.status}
                      </span>
                    )}
                  </td>
                  <td>
                    {editModeId === inq.id ? (
                      <select value={editedRemark} onChange={(e) => setEditedRemark(e.target.value)}>
                        {remarkOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <span>{inq.remark}</span>
                    )}
                  </td>
                  <td>{inq.state}</td>
                  <td>{inq.date}</td>
                  <td>
                    {inq.updated_at ? (
                      <FaWhatsapp
                        className="wa-icon"
                        style={{ color: '#25D366', cursor: 'pointer', marginLeft: '6px', fontSize: '20px' }}
                        onClick={() => handleWhatsAppClick(inq)}
                        title="Chat on WhatsApp"
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <div className="icon-action-group">
                      {editModeId === inq.id ? (
                        <>
                          <input
                            type="text"
                            placeholder="Enter comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{ width: '100%', marginBottom: '4px' }}
                          />
                          {errors.comment && <div className="error-text">{errors.comment}</div>}
                          <button className="icon-only-btn icon-save" onClick={() => handleSave(inq.id)}>
                            <FaSave />
                            <span className="icon-label">Save</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="icon-only-btn icon-edit" onClick={() => handleEditClick(inq)}>
                            <FaEdit />
                            <span className="icon-label">Edit</span>
                          </button>
                          <button className="icon-only-btn icon-detail" onClick={() => setSelectedInquiry(inq)}>
                            <FaEye />
                            <span className="icon-label">Details</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedInquiry && (
        <DetailModal inquiry={selectedInquiry} onClose={() => setSelectedInquiry(null)} />
      )}
    </div>
  );
};

export default BrandInquiries;
