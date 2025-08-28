import React, { useState, useEffect } from 'react';
import { X, User, GraduationCap, DollarSign, Briefcase } from 'lucide-react';

// NOTE: We assume that the user will handle the CSS for this component separately.
import './EditProfile.css';
import { getApiUrl } from '../utils/api';

const tabs = [
  { id: 'personal', name: 'Personal Info', icon: <User size={18} /> },
  { id: 'education', name: 'Education', icon: <GraduationCap size={18} /> },
  { id: 'assets', name: 'Assets', icon: <DollarSign size={18} /> },
  { id: 'professional', name: 'Professional', icon: <Briefcase size={18} /> },
];

const educationOptions = [
  'High School',
  'Associate Degree',
  "Bachelor's Degree",
  "Master's Degree",
  'Doctorate',
];
const incomeRangeOptions = [
  'Under ₹5 Lakh',
  '₹5 Lakh - ₹10 Lakh',
  '₹10 Lakh - ₹25 Lakh',
  '₹25 Lakh - ₹50 Lakh',
  'Over ₹50 Lakh',
];
const investmentRangeOptions = [
  'Under ₹10 Lakh',
  '₹10 Lakh - ₹25 Lakh',
  '₹25 Lakh - ₹50 Lakh',
  '₹50 Lakh - ₹1 Cr',
  'Over ₹1 Cr',
];

// Searchable dropdown component
const SearchableDropdown = ({ options, value, onChange, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState(value?.name || '');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSearchTerm(value?.name || '');
  }, [value]);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange(option);
    setSearchTerm(option.name);
    setIsOpen(false);
  };

  return (
    <div className="searchable-dropdown">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder={placeholder}
        className="dropdown-input"
      />
      {isOpen && (
        <ul className="dropdown-list">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li key={option.id} onMouseDown={() => handleSelect(option)}>
                {option.name}
              </li>
            ))
          ) : (
            <li className="no-results">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  
  // State for storing the user ID from session/local storage
  const [userId, setUserId] = useState(null);

  // Initial state for the form. It's best to start with empty values.
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    secondaryEmail: '',
    secondaryContact: '',
    pincode: '',
    highestEducation: '',
    incomeRange: '',
    investmentRange: '',
    availableCapital: '',
    needLoan: 'No',
    franchiseExperience: 'No',
    occupation: '',
    bio: '',
    state: { id: null, name: '' },
    city: { id: null, name: '' },
    address: '',
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  
  // Use a descriptive key for your local storage data
  const STORAGE_KEY = 'investor_session';
  const USER_ID_STORAGE_KEY = 'user_session_id';

  // Load data from local storage when the component mounts
  useEffect(() => {
    try {
      // Load form data
      const dataString = localStorage.getItem(STORAGE_KEY);
      if (dataString) {
        const storedData = JSON.parse(dataString);
        setFormData((prev) => ({
          ...prev,
          ...storedData,
          state: storedData.state || { id: null, name: '' },
          city: storedData.city || { id: null, name: '' },
        }));
      }

      // Load or generate user ID
      let storedUserId = localStorage.getItem(USER_ID_STORAGE_KEY);
      if (!storedUserId) {
        storedUserId = crypto.randomUUID(); // Generate a unique ID if one doesn't exist
        localStorage.setItem(USER_ID_STORAGE_KEY, storedUserId);
      }
      setUserId(storedUserId);

    } catch (error) {
      console.error("Could not load data from local storage:", error);
    }
  }, []);

  // Load states from API
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoadingStates(true);
        // Using the local API endpoint now
        const res = await fetch(getApiUrl('get-indian-states.php'));
        const data = await res.json();
        setStates(data); // Expected format: [{id:1,name:"..."}, ...]
      } catch (error) {
        console.error('Error fetching states:', error);
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  // Load cities whenever state changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!formData.state?.id) {
        setCities([]);
        return;
      }
      try {
        setLoadingCities(true);
        // Using the local API endpoint with the state_id parameter
        const res = await fetch(
          getApiUrl(`get-cities.php?state_id=${formData.state.id}`)
        );
        const data = await res.json();
        setCities(data); // Expected format: [{id:1,name:"..."}, ...]
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, [formData.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (name, value) => {
    if (name === 'state') {
      setFormData((prev) => ({
        ...prev,
        state: value,
        city: { id: null, name: '' }, // reset city on state change
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Updated Profile Data:', formData);

    // Prepare the data to be sent to the API
    const payload = {
      ...formData,
      userId, // Now using the userId from state, which is loaded from localStorage
      state_id: formData.state.id,
      city_id: formData.city.id,
    };

    // Remove the full state and city objects to send only the IDs
    delete payload.state;
    delete payload.city;
    console.log(payload)
    try {
      // Send the data to a single API endpoint
      const res = await fetch(getApiUrl('submit-user-profile.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        console.log('Submission successful:', result);
        // Save the form data to local storage on a successful submit
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        console.log("Data saved to local storage.");
        setIsOpen(false);
      } else {
        console.error('Submission failed:', result);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  if (!isOpen) {
    return (
      <div className="p-8 text-center text-gray-500">
        Profile modal closed. Click run again to open.
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="tab-content personal-info-tab">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Contact</label>
              <input type="text" name="contact" value={formData.contact} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Secondary Email</label>
              <input
                type="email"
                name="secondaryEmail"
                value={formData.secondaryEmail}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Secondary Contact</label>
              <input
                type="text"
                name="secondaryContact"
                value={formData.secondaryContact}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <SearchableDropdown
                options={states}
                value={formData.state}
                onChange={(value) => handleDropdownChange('state', value)}
                placeholder={loadingStates ? 'Loading states...' : 'Select State'}
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <SearchableDropdown
                options={cities}
                value={formData.city}
                onChange={(value) => handleDropdownChange('city', value)}
                placeholder={loadingCities ? 'Loading cities...' : 'Select City'}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange}></textarea>
            </div>
            <div className="form-group">
              <label>Pincode</label>
              <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} />
            </div>
          </div>
        );
      case 'education':
        return (
          <div className="tab-content education-tab">
            <div className="form-group">
              <label>Highest Education</label>
              <SearchableDropdown
                options={educationOptions.map((e, i) => ({ id: i, name: e }))}
                value={{ id: null, name: formData.highestEducation }}
                onChange={(value) => handleDropdownChange('highestEducation', value.name)}
                placeholder="Select Education"
              />
            </div>
          </div>
        );
      case 'assets':
        return (
          <div className="tab-content assets-tab">
            <div className="form-group">
              <label>Income Range</label>
              <SearchableDropdown
                options={incomeRangeOptions.map((e, i) => ({ id: i, name: e }))}
                value={{ id: null, name: formData.incomeRange }}
                onChange={(value) => handleDropdownChange('incomeRange', value.name)}
                placeholder="Select Income Range"
              />
            </div>
            <div className="form-group">
              <label>Investment Range</label>
              <SearchableDropdown
                options={investmentRangeOptions.map((e, i) => ({ id: i, name: e }))}
                value={{ id: null, name: formData.investmentRange }}
                onChange={(value) => handleDropdownChange('investmentRange', value.name)}
                placeholder="Select Investment Range"
              />
            </div>
            <div className="form-group">
              <label>Available Capital</label>
              <input
                type="text"
                name="availableCapital"
                value={formData.availableCapital}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Need of Loan?</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="needLoan"
                    value="Yes"
                    checked={formData.needLoan === 'Yes'}
                    onChange={handleChange}
                  />{' '}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="needLoan"
                    value="No"
                    checked={formData.needLoan === 'No'}
                    onChange={handleChange}
                  />{' '}
                  No
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Franchise Experience?</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="franchiseExperience"
                    value="Yes"
                    checked={formData.franchiseExperience === 'Yes'}
                    onChange={handleChange}
                  />{' '}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="franchiseExperience"
                    value="No"
                    checked={formData.franchiseExperience === 'No'}
                    onChange={handleChange}
                  />{' '}
                  No
                </label>
              </div>
            </div>
          </div>
        );
      case 'professional':
        return (
          <div className="tab-content professional-tab">
            <div className="form-group">
              <label>Occupation</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange}></textarea>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Edit Profile</h2>
          <button className="modal-close-btn" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          {renderTabContent()}
          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
