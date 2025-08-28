import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { getApiUrl } from '../../utils/api';

export default function InvestmentTab() {
  const [masterCategories, setMasterCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [minInvestment, setMinInvestment] = useState(null);
  const [maxInvestment, setMaxInvestment] = useState(null);

  // Fetch master categories from API on component mount
  useEffect(() => {
    fetch(getApiUrl('get-master-category.php'))
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map(cat => ({
          value: cat.mas_cat_id,
          label: cat.mas_cat_name
        }));
        setMasterCategories(formatted);
      })
      .catch((err) => console.error('Error loading master categories:', err));
  }, []);

  // Investment options
  const investmentOptions = [
    { value: '50000', label: '₹50,000' },
    { value: '100000', label: '₹1,00,000' },
    { value: '500000', label: '₹5,00,000' },
    { value: '1000000', label: '₹10,00,000' }
  ];

  return (
    <div className="filter-row">
      {/* Category Dropdown */}
      <div style={{ minWidth: 200 }}>
        <Select
          placeholder="Select Category"
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={masterCategories}
          isClearable
        />
      </div>

      {/* Min Investment */}
      <div style={{ minWidth: 200 }}>
        <Select
          placeholder="Select Min Investment"
          value={minInvestment}
          onChange={setMinInvestment}
          options={investmentOptions}
          isClearable
        />
      </div>

      {/* Max Investment */}
      <div style={{ minWidth: 200 }}>
        <Select
          placeholder="Select Max Investment"
          value={maxInvestment}
          onChange={setMaxInvestment}
          options={investmentOptions}
          isClearable
        />
      </div>

      {/* Search Button */}
      <button className="search-btn">🔍</button>
    </div>
    
  );
}
