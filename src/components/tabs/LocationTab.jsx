import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { getApiUrl } from '../../utils/api';

export default function LocationTab() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selCountry, setSelCountry] = useState(null);
  const [selState, setSelState] = useState(null);
  const [selCity, setSelCity] = useState(null);

  // Fetch countries
  useEffect(() => {
    fetch(getApiUrl('get-countries.php'))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCountries(data.map(c => ({ value: c.id, label: c.name })));
        } else {
          console.error('Invalid countries format:', data);
        }
      })
      .catch(err => console.error('Error loading countries:', err));
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (selCountry?.value) {
      fetch(getApiUrl(`get-states.php?country_id=${selCountry.value}`))
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setStates(data.map(s => ({ value: s.id, label: s.name })));
          } else {
            console.error('Invalid states format:', data);
          }
        })
        .catch(err => console.error('Error loading states:', err));
    } else {
      setStates([]);
    }
    setSelState(null);
    setCities([]);
    setSelCity(null);
  }, [selCountry]);

  // Fetch cities when state changes
  useEffect(() => {
    if (selState?.value) {
      fetch(getApiUrl(`get-cities.php?state_id=${selState.value}`))
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setCities(data.map(c => ({ value: c.id, label: c.name })));
          } else {
            console.error('Invalid cities format:', data);
          }
        })
        .catch(err => console.error('Error loading cities:', err));
    } else {
      setCities([]);
    }
    setSelCity(null);
  }, [selState]);

  return (
    <div className="filter-row">
      <div style={{ minWidth: 200 }}>
        <Select
          placeholder="Select Country"
          value={selCountry}
          onChange={setSelCountry}
          options={countries}
          isClearable
        />
      </div>

      <div style={{ minWidth: 200 }}>
        <Select
          placeholder="Select State"
          value={selState}
          onChange={setSelState}
          options={states}
          isDisabled={!states.length}
          isClearable
        />
      </div>

      <div style={{ minWidth: 200 }}>
        <Select
          placeholder="Select City"
          value={selCity}
          onChange={setSelCity}
          options={cities}
          isDisabled={!cities.length}
          isClearable
        />
      </div>

      <button className="search-btn">🔍</button>
    </div>
  );
}
