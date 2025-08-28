import React, { useEffect, useState } from 'react';
import './FilterBar.css';
import { useSearchParams } from 'react-router-dom';
import { getApiUrl } from '../utils/api';
const statusOptions = ['open', 'contacted', 'not contacted', 'closed'];
const remarkOptions = ['interested', 'not interested', 'deal', 'not qualified', 'not received'];

const defaultFilters = {
  name: '',
  status: 'All',
  remark: '',
  stateId: '',
  stateName: '',
  city: '',
  startDate: '',
  endDate: ''
};

const FilterBar = ({ filters, onChange }) => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchParams] = useSearchParams();

  // Initial remark from URL
  useEffect(() => {
    const urlRemark = searchParams.get('remark');
    if (urlRemark && remarkOptions.includes(urlRemark) && !filters.remark) {
      onChange({ ...filters, remark: urlRemark });
    }
  }, [searchParams, filters, onChange]);

  // Load states
  useEffect(() => {
    fetch(getApiUrl('get-indian-states.php'))
      .then(res => res.json())
      .then(data => setStates(data))
      .catch(err => console.error('State load error:', err));
  }, []);

  // Load cities based on stateId
  useEffect(() => {
    if (filters.stateId) {
      fetch(getApiUrl(`get-cities.php?state_id=${filters.stateId}`))
        .then(res => res.json())
        .then(data => setCities(data))
        .catch(err => console.error('City load error:', err));
    } else {
      setCities([]);
    }
  }, [filters.stateId]);

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'stateId') {
      const selectedState = states.find((s) => String(s.id) === value);
      onChange({
        ...filters,
        stateId: value,
        stateName: selectedState?.name || '',
        city: '',
      });
    } else {
      onChange({ ...filters, [name]: value });
    }
  };

  // Reset filters
  const handleReset = () => {
    onChange({ ...defaultFilters });
  };

  return (
    <div className="filter-bar">
      <input
        type="text"
        name="name"
        value={filters.name}
        placeholder="Search by name"
        onChange={handleChange}
      />

      <select name="status" value={filters.status} onChange={handleChange}>
        <option value="All">All Status</option>
        {statusOptions.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      <select name="remark" value={filters.remark} onChange={handleChange}>
        <option value="">All Remarks</option>
        {remarkOptions.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      <select name="stateId" value={filters.stateId} onChange={handleChange}>
        <option value="">All States</option>
        {states.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <select name="city" value={filters.city} onChange={handleChange}>
        <option value="">All Cities</option>
        {cities.map(c => (
          <option key={c.id} value={c.name}>{c.name}</option>
        ))}
      </select>

      <input
        type={filters.startDate ? 'date' : 'text'}
        name="startDate"
        value={filters.startDate}
        placeholder="Select Start Date"
        onFocus={(e) => (e.target.type = 'date')}
        onBlur={(e) => {
          if (!filters.startDate) e.target.type = 'text';
        }}
        onChange={handleChange}
      />

      <input
        type={filters.endDate ? 'date' : 'text'}
        name="endDate"
        value={filters.endDate}
        placeholder="Select End Date"
        onFocus={(e) => (e.target.type = 'date')}
        onBlur={(e) => {
          if (!filters.endDate) e.target.type = 'text';
        }}
        onChange={handleChange}
      />

      <button className="reset-btn" onClick={handleReset}>Reset Filters</button>
    </div>
  );
};

export default FilterBar;
