import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUndo, FaPhone, FaUser, FaEnvelope, FaBuilding, FaMapMarkerAlt, FaGlobe, FaCity, FaRupeeSign, FaInfoCircle, FaRocket, FaHandshake, FaMoneyBill, FaChartLine, FaClock, FaSquare } from 'react-icons/fa';
import './EditProfileModal.css';
import { getApiUrl } from '../utils/api';

/**
 * EditBrandModal component for updating a brand's profile.
 * It displays editable fields and dynamic dropdowns for a user's brand profile.
 *
 * @param {object} brandData - The brand's current data to populate the form.
 * @param {function} onClose - Function to close the modal.
 * @param {function} onUpdate - Function to call after a successful update.
 */
const EditBrandModal = ({ brandData, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('personal');

  // States for dropdown data
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [masterCategories, setMasterCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [franchiseModels, setFranchiseModels] = useState([]);
  const [franchiseTypes, setFranchiseTypes] = useState([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Define the options for the dropdowns
  const outletRanges = ['0-10', '11-50', '51-100', '100+'];
  const yesNoOptions = ['Yes', 'No'];
  const franchiseYearsOptions = ['1', '2', '3', '5', '10', '15'];

  // Dropdown options based on the provided database schema
  const requiredAreaOptions = ['100-500', '501-1500', '1501-2500', '2501-5000', '5000+'];
  const investmentRangeOptions = ['250000-1000000', '1100000-2000000', '2100000-3500000', '3600000-5000000', '5000000-10000000', '10000000+'];
  const expectedRoiOptions = ['15-20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80', '80-90', '90-100', '100+'];
  const expectedPaybackOptions = ['0.5', '1', '1.5', '2', '2+'];

  // State for showing success/error messages
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Consolidated state for all form data with nested structure for master franchise details
  const [formData, setFormData] = useState({
    // Personal Info
    name: brandData?.name || '',
    email: brandData?.email || '',
    mobile: brandData?.mobile || '',
    address: brandData?.address || '',
    description: brandData?.description || '',
    bd_manager_name: brandData?.bd_manager_name || '',
    bd_manager_email: brandData?.bd_manager_email || '',
    bd_manager_contact: brandData?.bd_manager_contact || '',
    state_id: brandData?.state_id || '',
    city_id: brandData?.city_id || '',
    mas_cat_id: brandData?.mas_cat_id || '',
    cat_id: brandData?.cat_id || '',
    sub_cat_id: brandData?.sub_cat_id || '',

    // Business Summary
    commenced_operations_year: brandData?.commenced_operations_year || '',
    expansion_started_year: brandData?.expansion_started_year || '',
    total_outlets: brandData?.total_outlets || '',
    company_owned_outlets: brandData?.company_owned_outlets || '',
    franchise_owned_outlets: brandData?.franchise_owned_outlets || '',
    franchise_years: brandData?.franchise_years || '',
    is_agreement_renewable: brandData?.is_agreement_renewable || '',
    operations_manual_provided: brandData?.operations_manual_provided || '',
    training_provided: brandData?.training_provided || '',
    it_systems_included: brandData?.it_systems_included || '',
    marketing_materials_provided: brandData?.marketing_materials_provided || '',
    head_office_assistance: brandData?.head_office_assistance || '',

    // Franchise Info
    franchise_model: brandData?.franchise_model || '',
    franchise_type_id: brandData?.franchise_type_id || '',
    single_area: brandData?.required_area || '',
    single_investment: brandData?.investment_range || '',
    single_roi: brandData?.expected_roi || '',
    single_payback: brandData?.expected_payback_period || '',

    // Nested object for Master Franchise details by scope
    master_scope: brandData?.master_scope || '',
    master_franchise_details: {
      country: {
        area: brandData?.master_required_area_country || '',
        investment: brandData?.master_investment_range_country || '',
        roi: brandData?.master_expected_roi_country || '',
        payback: brandData?.master_expected_payback_period_country || '',
      },
      state: {
        area: brandData?.master_required_area_state || '',
        investment: brandData?.master_investment_range_state || '',
        roi: brandData?.master_expected_roi_state || '',
        payback: brandData?.master_expected_payback_period_state || '',
      },
      city: {
        area: brandData?.master_required_area_city || '',
        investment: brandData?.master_investment_range_city || '',
        roi: brandData?.master_expected_roi_city || '',
        payback: brandData?.master_expected_payback_period_city || '',
      },
    },

    master_franchise_state_ids: brandData?.master_franchise_state_ids?.split(',') || [],
    master_franchise_city_ids: brandData?.master_franchise_city_ids?.split(',') || [],

    // Expansion Tab
    expansion_state_ids: brandData?.expansion_state_ids?.split(',') || [],
    expansion_city_ids: brandData?.expansion_city_ids?.split(',') || [],
  });

  // Effect to update formData if brandData prop changes
  useEffect(() => {
    if (brandData) {
      setFormData({
        // ... (other fields remain the same)
        name: brandData.name || '',
        email: brandData.email || '',
        mobile: brandData.mobile || '',
        address: brandData.address || '',
        description: brandData.description || '',
        bd_manager_name: brandData.bd_manager_name || '',
        bd_manager_email: brandData.bd_manager_email || '',
        bd_manager_contact: brandData.bd_manager_contact || '',
        state_id: brandData.state_id || '',
        city_id: brandData.city_id || '',
        mas_cat_id: brandData.mas_cat_id || '',
        cat_id: brandData.cat_id || '',
        sub_cat_id: brandData.sub_cat_id || '',
        commenced_operations_year: brandData.commenced_operations_year || '',
        expansion_started_year: brandData.expansion_started_year || '',
        total_outlets: brandData.total_outlets || '',
        company_owned_outlets: brandData.company_owned_outlets || '',
        franchise_owned_outlets: brandData.franchise_owned_outlets || '',
        franchise_years: brandData.franchise_years || '',
        is_agreement_renewable: brandData.is_agreement_renewable || '',
        operations_manual_provided: brandData.operations_manual_provided || '',
        training_provided: brandData.training_provided || '',
        it_systems_included: brandData.it_systems_included || '',
        marketing_materials_provided: brandData.marketing_materials_provided || '',
        head_office_assistance: brandData.head_office_assistance || '',
        franchise_model: brandData.franchise_model || '',
        franchise_type_id: brandData.franchise_type_id || '',
        single_area: brandData.required_area || '',
        single_investment: brandData.investment_range || '',
        single_roi: brandData.expected_roi || '',
        single_payback: brandData.expected_payback_period || '',

        master_scope: brandData.master_scope || '',
        master_franchise_details: {
          country: {
            area: brandData?.master_required_area_country || '',
            investment: brandData?.master_investment_range_country || '',
            roi: brandData?.master_expected_roi_country || '',
            payback: brandData?.master_expected_payback_period_country || '',
          },
          state: {
            area: brandData?.master_required_area_state || '',
            investment: brandData?.master_investment_range_state || '',
            roi: brandData?.master_expected_roi_state || '',
            payback: brandData?.master_expected_payback_period_state || '',
          },
          city: {
            area: brandData?.master_required_area_city || '',
            investment: brandData?.master_investment_range_city || '',
            roi: brandData?.master_expected_roi_city || '',
            payback: brandData?.master_expected_payback_period_city || '',
          },
        },

        master_franchise_state_ids: brandData.master_franchise_state_ids?.split(',') || [],
        master_franchise_city_ids: brandData.master_franchise_city_ids?.split(',') || [],

        expansion_state_ids: brandData.expansion_state_ids?.split(',') || [],
        expansion_city_ids: brandData.expansion_city_ids?.split(',') || [],
      });
    }
  }, [brandData]);

  // --- Data Fetching Hooks ---
  useEffect(() => {
    // Fetch static data once
    const fetchData = async () => {
      try {
        const [statesRes, masterCatRes, modelsRes, typesRes] = await Promise.all([
          axios.get(getApiUrl('get-indian-states.php')),
          axios.get(getApiUrl('get-master-category.php')),
          axios.get(getApiUrl('get-modals.php')),
          axios.get(getApiUrl('get-franchise-type.php')),
        ]);

        setStates(statesRes.data);
        setMasterCategories(masterCatRes.data);
        setFranchiseModels(modelsRes.data.success ? modelsRes.data.data : []);
        setFranchiseTypes(typesRes.data.success ? typesRes.data.data : []);
      } catch (err) {
        console.error('Error fetching initial data:', err);
      }
    };
    fetchData();
  }, []);

  // Fetch cities based on a single selected state ID
  useEffect(() => {
    if (formData.state_id) {
      axios.get(getApiUrl(`get-cities.php?state_id=${formData.state_id}`))
        .then(res => setCities(res.data))
        .catch(err => console.error('Error fetching cities:', err));
    } else {
      setCities([]);
    }
  }, [formData.state_id]);

  // Fetch categories whenever the selected master category changes
  useEffect(() => {
    if (formData.mas_cat_id) {
      setFormData(prev => ({ ...prev, cat_id: '', sub_cat_id: '' }));
      setSubCategories([]);

      axios.get(getApiUrl(`get-category.php?mas_cat_id=${formData.mas_cat_id}`))
        .then(res => setCategories(res.data))
        .catch(err => console.error('Error fetching categories:', err));
    } else {
      setCategories([]);
      setFormData(prev => ({ ...prev, cat_id: '', sub_cat_id: '' }));
      setSubCategories([]);
    }
  }, [formData.mas_cat_id]);

  // Fetch sub-categories whenever the selected category changes
  useEffect(() => {
    if (formData.cat_id) {
      setFormData(prev => ({ ...prev, sub_cat_id: '' }));
      axios.get(getApiUrl(`get-sub-category.php?cat_id=${formData.cat_id}`))
        .then(res => setSubCategories(res.data))
        .catch(err => console.error('Error fetching sub-categories:', err));
    } else {
      setSubCategories([]);
    }
  }, [formData.cat_id]);

  // Handle changes to form inputs, including text fields and selects
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMasterFranchiseChange = (scope, name, value) => {
    setFormData(prev => ({
      ...prev,
      master_franchise_details: {
        ...prev.master_franchise_details,
        [scope]: {
          ...prev.master_franchise_details[scope],
          [name]: value
        }
      }
    }));
  };

  // Generic handler for multi-select checkboxes
  // const handleMultiSelectChange = (field, id) => {
  //   setFormData(prev => {
  //     let updatedIds;
  //     // Handle state selection logic
  //     if (field === 'expansion_state_ids') {
  //       const currentIds = prev[field];
  //       updatedIds = currentIds.includes(id)
  //         ? currentIds.filter(item => item !== id)
  //         : [...currentIds, id];

  //       // If a state is deselected, remove its cities from the city selection
  //       if (currentIds.includes(id)) {
  //         const citiesToRemove = cities.filter(city => city.state_id === id).map(city => city.id);
  //         const updatedCityIds = prev.expansion_city_ids.filter(cityId => !citiesToRemove.includes(cityId));
  //         return {
  //           ...prev,
  //           [field]: updatedIds,
  //           expansion_city_ids: updatedCityIds,
  //         };
  //       } else {
  //         return { ...prev, [field]: updatedIds };
  //       }
  //     }

  //     // Handle city selection logic (unchanged)
  //     const currentIds = prev[field];
  //     updatedIds = currentIds.includes(id)
  //       ? currentIds.filter(item => item !== id)
  //       : [...currentIds, id];

  //     return { ...prev, [field]: updatedIds };
  //   });
  // };
   useEffect(() => {
    const fetchStates = async () => {
      setIsLoadingStates(true);
      try {
        const response = await fetch('http://localhost/react-api/get-indian-states.php');
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setIsLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  // Fetch cities based on selected states
  useEffect(() => {
    const fetchCitiesForSelectedStates = async () => {
      const selectedStateIds = formData.expansion_state_ids;
      if (selectedStateIds.length === 0) {
        setCities([]);
        setFormData(prev => ({ ...prev, expansion_city_ids: [] }));
        return;
      }

      setIsLoadingCities(true);
      try {
        const fetchPromises = selectedStateIds.map(stateId =>
          fetch(`http://localhost/react-api/get-cities.php?state_id=${stateId}`).then(res => res.json())
        );

        const allCitiesArrays = await Promise.all(fetchPromises);
        const allCities = allCitiesArrays.flat(); // Combines all cities into a single array
        setCities(allCities);

        // Update selected cities to remove any that are no longer in the list
        setFormData(prev => {
          const validCityIds = allCities.map(city => city.id);
          const newSelectedCityIds = prev.expansion_city_ids.filter(cityId => validCityIds.includes(cityId));
          return { ...prev, expansion_city_ids: newSelectedCityIds };
        });
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setIsLoadingCities(false);
      }
    };
    fetchCitiesForSelectedStates();
  }, [formData.expansion_state_ids]); // This effect re-runs whenever the selected states change

  const handleMultiSelectChange = (field, id) => {
    setFormData(prev => {
      const currentIds = prev[field];
      const updatedIds = currentIds.includes(id)
        ? currentIds.filter(item => item !== id)
        : [...currentIds, id];
      return { ...prev, [field]: updatedIds };
    });
  };
  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);


    // Prepare the payload by converting multi-select arrays to comma-separated strings
    // and merging the correct master franchise details
    const masterFranchiseDetails = formData.master_franchise_details[formData.master_scope?.toLowerCase()] || {};



    // Create a comprehensive payload with all form data
    const payload = {
      // Brand ID
      id: brandData.id,

      // Personal Information
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      address: formData.address,
      description: formData.description,

      // Manager Information
      bd_manager_name: formData.bd_manager_name,
      bd_manager_email: formData.bd_manager_email,
      bd_manager_contact: formData.bd_manager_contact,

      // Location Information
      state_id: formData.state_id,
      city_id: formData.city_id,

      // Category Information
      mas_cat_id: formData.mas_cat_id,
      cat_id: formData.cat_id,
      sub_cat_id: formData.sub_cat_id,

      // Business Summary Information
      franchise_fee: formData.franchise_fee,
      commenced_operations_year: formData.commenced_operations_year,
      expansion_started_year: formData.expansion_started_year,
      total_outlets: formData.total_outlets,
      company_owned_outlets: formData.company_owned_outlets,
      franchise_owned_outlets: formData.franchise_owned_outlets,
      franchise_years: formData.franchise_years,
      is_agreement_renewable: formData.is_agreement_renewable,
      operations_manual_provided: formData.operations_manual_provided,
      training_provided: formData.training_provided,
      it_systems_included: formData.it_systems_included,
      marketing_materials_provided: formData.marketing_materials_provided,
      head_office_assistance: formData.head_office_assistance,

      // Franchise Model and Type
      franchise_model: formData.franchise_model,
      franchise_type_id: formData.franchise_type_id,

      // Single Unit Franchise Details (mapped to original column names)
      single_required_area: formData.single_area,
      single_investment_range: formData.single_investment,
      single_expected_roi: formData.single_roi,
      single_expected_payback_period: formData.single_payback,

      // Master Franchise Information
      master_scope: formData.master_scope,

      // Master Franchise Details (mapped based on selected scope)
      // master_required_area: masterFranchiseDetails.area,
      // master_investment_range: masterFranchiseDetails.investment,
      // master_expected_roi: masterFranchiseDetails.roi,
      // master_expected_payback_period: masterFranchiseDetails.payback,

      // Master Franchise Country Details
      master_required_area_country: formData.master_franchise_details.country?.area,
      master_investment_range_country: formData.master_franchise_details.country?.investment,
      master_expected_roi_country: formData.master_franchise_details.country?.roi,
      master_expected_payback_period_country: formData.master_franchise_details.country?.payback,

      // Master Franchise State Details
      master_required_area_state: formData.master_franchise_details.state?.area,
      master_investment_range_state: formData.master_franchise_details.state?.investment,
      master_expected_roi_state: formData.master_franchise_details.state?.roi,
      master_expected_payback_period_state: formData.master_franchise_details.state?.payback,

      // Master Franchise City Details
      master_required_area_city: formData.master_franchise_details.city?.area,
      master_investment_range_city: formData.master_franchise_details.city?.investment,
      master_expected_roi_city: formData.master_franchise_details.city?.roi,
      master_expected_payback_period_city: formData.master_franchise_details.city?.payback,

      // Multi-select arrays converted to comma-separated strings
      expansion_state_ids: formData.expansion_state_ids.join(','),
      expansion_city_ids: formData.expansion_city_ids.join(','),
      master_franchise_state_ids: formData.master_franchise_state_ids.join(','),
      master_franchise_city_ids: formData.master_franchise_city_ids.join(','),
    };

    // Log the complete payload structure
    console.log("=== COMPLETE PAYLOAD STRUCTURE ===");

    console.log("Full payload:", payload);
    try {
      // console.log("=== MAKING API CALL ===");
      // console.log("API URL: http://localhost/react-api/simple-api.php");
      // console.log("Request method: POST");
      console.log("Request data:", payload);
      const response = await axios.post(getApiUrl('simple-api.php'), payload);

      // console.log("=== API RESPONSE ===");
      // console.log("Response status:", response.status);
      // console.log("Response headers:", response.headers);
      // console.log("Response data:", response.data);
      // console.log("Response success:", response.data?.success);
      // console.log("Response message:", response.data?.message);
      // console.log("Response brand data:", response.data?.data);

      setMessage(null);
      if (response.data.success) {
        // console.log("✅ SUCCESS: Profile updated successfully");
        setMessage({ type: 'success', text: '✅ Profile updated successfully!' });
        // onUpdate(response.data.data);
        setTimeout(onClose, 1500);
      } else {
        // console.log("❌ API ERROR:", response.data.message);
        setMessage({ type: 'success', text: `✅ ${response.data.message}` });
      }
    } catch (err) {
      console.log("=== API REQUEST ERROR ===");
      console.error("Error object:", err);
      // console.error("Error message:", err.message);
      // console.error("Error response:", err.response);
      // console.error("Error request:", err.request);
      if (err.response) {
        console.log("Error response data:", err.response.data);
        // console.log("Error response status:", err.response.status);
        // console.log("Error response headers:", err.response.headers);
      }

      setMessage({ type: 'error', text: '❌ An error occurred while saving. Please try again.' });
    } finally {
      setIsLoading(false);
      console.log("=== SAVE PROCESS COMPLETED ===");
    }
  };
  // Helper function to render master franchise details for a specific scope
  const renderMasterFranchiseFields = (scope) => {
    // Safely access the details for the given scope, defaulting to an empty object
    const details = formData.master_franchise_details?.[scope.toLowerCase()] || {};
    return (
      <>
        <div className="form-group">
          <label><FaSquare /> Required Area (sq. ft.)</label>
          <select
            name="area"
            value={details.area || ''} // Use default empty string to handle undefined
            onChange={(e) => handleMasterFranchiseChange(scope.toLowerCase(), e.target.name, e.target.value)}
          >
            <option value="">-- Select --</option>
            {requiredAreaOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label><FaMoneyBill /> Investment Range (₹)</label>
          <select
            name="investment"
            value={details.investment || ''} // Use default empty string
            onChange={(e) => handleMasterFranchiseChange(scope.toLowerCase(), e.target.name, e.target.value)}
          >
            <option value="">-- Select --</option>
            {investmentRangeOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label><FaChartLine /> Expected ROI (%)</label>
          <select
            name="roi"
            value={details.roi || ''} // Use default empty string
            onChange={(e) => handleMasterFranchiseChange(scope.toLowerCase(), e.target.name, e.target.value)}
          >
            <option value="">-- Select --</option>
            {expectedRoiOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label><FaClock /> Expected Payback Period</label>
          <select
            name="payback"
            value={details.payback || ''} // Use default empty string
            onChange={(e) => handleMasterFranchiseChange(scope.toLowerCase(), e.target.name, e.target.value)}
          >
            <option value="">-- Select --</option>
            {expectedPaybackOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
      </>
    );
  };

  const renderPersonalInfoTab = () => (
    <div className="form-grid">
      <div className="form-group"><label><FaBuilding /> Brand Name</label><input type="text" name="name" value={formData.name} onChange={handleFormChange} /></div>
      <div className="form-group"><label><FaEnvelope /> Email</label><input type="text" name="email" value={formData.email} onChange={handleFormChange} /></div>
      <div className="form-group"><label><FaPhone /> Phone</label><input type="text" name="mobile" value={formData.mobile} onChange={handleFormChange} /></div>
      <div className="form-group">
        <label><FaGlobe /> Master Category</label>
        <select name="mas_cat_id" value={formData.mas_cat_id} onChange={handleFormChange}>
          <option value="">-- Select --</option>
          {masterCategories.map(cat => <option key={cat.mas_cat_id} value={cat.mas_cat_id}>{cat.mas_cat_name}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Category</label>
        <select name="cat_id" value={formData.cat_id} onChange={handleFormChange} disabled={!formData.mas_cat_id}>
          <option value="">-- Select --</option>
          {categories.map(cat => <option key={cat.cat_id} value={cat.cat_id}>{cat.cat_name}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Sub-Category</label>
        <select name="sub_cat_id" value={formData.sub_cat_id} onChange={handleFormChange} disabled={!formData.cat_id}>
          <option value="">-- Select --</option>
          {subCategories.map(cat => <option key={cat.subcat_id} value={cat.subcat_id}>{cat.subcat_name}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label><FaMapMarkerAlt /> State</label>
        <select name="state_id" value={formData.state_id} onChange={handleFormChange}>
          <option value="">-- Select --</option>
          {states.map(state => <option key={state.id} value={state.id}>{state.name}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label><FaCity /> City</label>
        <select name="city_id" value={formData.city_id} onChange={handleFormChange} disabled={!formData.state_id}>
          <option value="">-- Select --</option>
          {cities.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
        </select>
      </div>
      <div className="form-group"><label><FaUser /> Manager Name</label><input type="text" name="bd_manager_name" value={formData.bd_manager_name} onChange={handleFormChange} /></div>
      <div className="form-group"><label><FaEnvelope /> Manager Email</label><input type="text" name="bd_manager_email" value={formData.bd_manager_email} onChange={handleFormChange} /></div>
      <div className="form-group"><label><FaPhone /> Manager Contact</label><input type="text" name="bd_manager_contact" value={formData.bd_manager_contact} onChange={handleFormChange} /></div>
      <div className="form-group full"><label><FaMapMarkerAlt /> Address</label><textarea name="address" value={formData.address} onChange={handleFormChange} /></div>
      <div className="form-group full"><label><FaMapMarkerAlt /> Description</label><textarea name="description" value={formData.description} onChange={handleFormChange} /></div>
    </div>
  );

  const renderBusinessSummaryTab = () => (
    <div className="form-grid">
      <div className="form-group"><label><FaBuilding />Franchise Fee</label><input type="text" name="franchise_fee" value={formData.franchise_fee} onChange={handleFormChange} /></div>
      <div className="form-group">
        <label>Year of Commenced Operations</label>
        <input type="number" min="1900" max={new Date().getFullYear()} name="commenced_operations_year" value={formData.commenced_operations_year} onChange={handleFormChange} placeholder="e.g., 2020" />
      </div>
      <div className="form-group">
        <label>Year of Expansion Started</label>
        <input type="number" min="1900" max={new Date().getFullYear()} name="expansion_started_year" value={formData.expansion_started_year} onChange={handleFormChange} placeholder="e.g., 2022" />
      </div>
      <div className="form-group">
        <label>Total Outlets</label>
        <select name="total_outlets" value={formData.total_outlets} onChange={handleFormChange}>
          <option value="">-- Select --</option>
          {outletRanges.map(range => <option key={range} value={range}>{range}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Company Owned Outlets</label>
        <select name="company_owned_outlets" value={formData.company_owned_outlets} onChange={handleFormChange}>
          <option value="">-- Select --</option>
          {outletRanges.map(range => <option key={range} value={range}>{range}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Franchise Owned Outlets</label>
        <select name="franchise_owned_outlets" value={formData.franchise_owned_outlets} onChange={handleFormChange}>
          <option value="">-- Select --</option>
          {outletRanges.map(range => <option key={range} value={range}>{range}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Franchise Years</label>
        <select name="franchise_years" value={formData.franchise_years} onChange={handleFormChange}>
          <option value="">-- Select --</option>
          {franchiseYearsOptions.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Is Agreement Renewable?</label>
        <select name="is_agreement_renewable" value={formData.is_agreement_renewable} onChange={handleFormChange}>
          <option value="">-- Select --</option>
          {yesNoOptions.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Operations Manual Provided?</label>
        <select name="operations_manual_provided" value={formData.operations_manual_provided} onChange={handleFormChange}>
          <option value="">-- Select --</option>
          {yesNoOptions.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Training Provided?</label>
        <select name="training_provided" value={formData.training_provided} onChange={handleFormChange}>
          <option value="">-- Select --</option>
          {yesNoOptions.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>IT Systems Included?</label>
        <select name="it_systems_included" value={formData.it_systems_included} onChange={handleFormChange}>
          <option value="">-- Select --</option>
          {yesNoOptions.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Marketing Materials Provided?</label>
        <select name="marketing_materials_provided" value={formData.marketing_materials_provided} onChange={handleFormChange}>
          <option value="">-- Select --</option>
          {yesNoOptions.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Head Office Assistance?</label>
        <select name="head_office_assistance" value={formData.head_office_assistance} onChange={handleFormChange}>
          <option value="">-- Select --</option>
          {yesNoOptions.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
    </div>
  );

  const renderFranchiseInfoTab = () => {
    const selectedFranchiseType = franchiseTypes.find(type => type.id === formData.franchise_type_id);
    const isSingleUnit = selectedFranchiseType?.name === 'Single Unit';
    const isMaster = selectedFranchiseType?.name === 'Master Franchise';
    const isBoth = selectedFranchiseType?.name === 'Both';
    const isMasterOrBoth = isMaster || isBoth;

    return (
      <div className="form-grid">
        <div className="form-group">
          <label><FaHandshake /> Franchise Model</label>
          <select name="franchise_model" value={formData.franchise_model} onChange={handleFormChange}>
            <option value="">-- Select --</option>
            {franchiseModels.map(model => <option key={model.id} value={model.id}>{model.name}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label><FaHandshake /> Franchise Type</label>
          <select name="franchise_type_id" value={formData.franchise_type_id} onChange={handleFormChange}>
            <option value="">-- Select --</option>
            {franchiseTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {(isSingleUnit || isBoth) && (
          <>
            <h3>Single Unit Details</h3>
            <div className="form-group">
              <label><FaSquare /> Required Area (sq. ft.)</label>
              <select name="single_area" value={formData.single_area} onChange={handleFormChange}>
                <option value="">-- Select --</option>
                {requiredAreaOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label><FaMoneyBill /> Investment Range (₹)</label>
              <select name="single_investment" value={formData.single_investment} onChange={handleFormChange}>
                <option value="">-- Select --</option>
                {investmentRangeOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label><FaChartLine /> Expected ROI (%)</label>
              <select name="single_roi" value={formData.single_roi} onChange={handleFormChange}>
                <option value="">-- Select --</option>
                {expectedRoiOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label><FaClock /> Expected Payback Period</label>
              <select name="single_payback" value={formData.single_payback} onChange={handleFormChange}>
                <option value="">-- Select --</option>
                {expectedPaybackOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
          </>
        )}

        {isMasterOrBoth && (
          <>
            <h3>Master Franchise Details</h3>



            {/* Country Wise Section */}
            <h4>Country Wise</h4>
            {renderMasterFranchiseFields('Country')}

            {/* State Wise Section */}
            <h4>State Wise</h4>
            {renderMasterFranchiseFields('State')}

            {/* City Wise Section */}
            <h4>City Wise</h4>
            {renderMasterFranchiseFields('City')}

            {/* Master Franchise Target States */}


            {/* Master Franchise Target Cities */}

          </>
        )}
      </div>
    );
  };

  const renderExpansionTab = () => (
    <div className="form-grid">
      <div className="form-group full">
        <label><FaMapMarkerAlt /> Target States</label>
        <div className="multi-select-container">
          {isLoadingStates ? (
            <p>Loading states...</p>
          ) : (
            states.map(state => (
              <label key={state.id} className="checkbox-label">
                <input
                  type="checkbox"
                  value={state.id}
                  checked={formData.expansion_state_ids.includes(state.id)}
                  onChange={() => handleMultiSelectChange('expansion_state_ids', state.id)}
                />
                {state.name}
              </label>
            ))
          )}
        </div>
      </div>
      {formData.expansion_state_ids.length > 0 && (
        <div className="form-group full">
          <label><FaCity /> Target Cities</label>
          <div className="multi-select-container">
            {isLoadingCities ? (
              <p>Loading cities...</p>
            ) : (
              cities.map(city => (
                <label key={city.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={city.id}
                    checked={formData.expansion_city_ids.includes(city.id)}
                    onChange={() => handleMultiSelectChange('expansion_city_ids', city.id)}
                  />
                  {city.name}
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
  return (
    <div className="modal-overlay">
      <div className="edit-profile-modal">
        <div className="modal-header">
          <h2>Edit Brand Profile</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-tabs">
          <button onClick={() => setActiveTab('personal')} className={activeTab === 'personal' ? 'active' : ''}>Personal Info</button>
          <button onClick={() => setActiveTab('business-summary')} className={activeTab === 'business-summary' ? 'active' : ''}>Business Summary</button>
          <button onClick={() => setActiveTab('franchise-info')} className={activeTab === 'franchise-info' ? 'active' : ''}>Franchise Info</button>
          <button onClick={() => setActiveTab('expansion')} className={activeTab === 'expansion' ? 'active' : ''}>Expansion</button>
        </div>
        <div className="modal-body">
          {activeTab === 'personal' && renderPersonalInfoTab()}
          {activeTab === 'business-summary' && renderBusinessSummaryTab()}
          {activeTab === 'franchise-info' && renderFranchiseInfoTab()}
          {activeTab === 'expansion' && renderExpansionTab()}
        </div>
        {isLoading && <div className="alert info">Saving changes...</div>}
        {message && <div className={`alert ${message.type}`}>{message.text}</div>}
        <div className="modal-footer">
          <button className="btn cancel" onClick={onClose}><FaUndo /> Cancel</button>
          <button className="btn save" onClick={handleSave} disabled={isLoading}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default EditBrandModal;