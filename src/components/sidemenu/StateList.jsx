
import React, { useEffect, useState } from 'react';
import { getApiUrl } from '../../utils/api';
// ===== Slider Component =====


// ===== Drawer Component =====
function StateCityDrawer({ onStateSelect, onCitySelect }) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState({});
  const [selectedState, setSelectedState] = useState(null);
  const [activePanel, setActivePanel] = useState('state');

  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  const [stateVisibleCount, setStateVisibleCount] = useState(6);
  const [cityVisibleCount, setCityVisibleCount] = useState(6);

  useEffect(() => {
    fetch(getApiUrl('get-indian-states.php'))
      .then(res => res.json())
      .then(data => Array.isArray(data) && setStates(data));
  }, []);

  // ----- State selection -----
  const handleStateClick = (state) => {
    setSelectedState(state);
    setActivePanel('city');
    setCitySearch('');
    setCityVisibleCount(6);

    if (!cities[state.id]) {
      fetch(getApiUrl(`get-cities.php?state_id=${state.id}`))
        .then(res => res.json())
        .then(data => setCities(prev => ({ ...prev, [state.id]: data })));
    }

    // Pass stateId to parent immediately
    if (onStateSelect) onStateSelect(state.id);

    // Update URL for reference
    const url = new URL(window.location);
    url.searchParams.set('state_id', state.id);
    url.searchParams.delete('city_id');
    window.history.replaceState({}, '', url);
  };

  // ----- City selection -----
  const handleCityClick = (city) => {
    if (onCitySelect && selectedState) {
      onCitySelect({ stateId: selectedState.id, cityId: city.id });
    }

    // Update URL with both state and city
    const url = new URL(window.location);
    url.searchParams.set('state_id', selectedState.id);
    url.searchParams.set('city_id', city.id);
    window.history.replaceState({}, '', url);
  };

  const goBack = () => {
    setActivePanel('state');
    setSelectedState(null);
    setCitySearch('');
    setCityVisibleCount(6);
  };

  // Filter logic
  const filteredStates = states.filter(state =>
    state.name.toLowerCase().includes(stateSearch.toLowerCase())
  );
  const visibleStates = filteredStates.slice(0, stateVisibleCount);

  const filteredCities = (cities[selectedState?.id] || []).filter(city =>
    city.name.toLowerCase().includes(citySearch.toLowerCase())
  );
  const visibleCities = filteredCities.slice(0, cityVisibleCount);

  return (
    <div className="drawer-container">
      {/* STATE PANEL */}
      <div className={`drawer-panel ${activePanel === 'state' ? 'active' : ''}`}>
        <h4>Select State</h4>
        <input
          type="text"
          className="search-input"
          placeholder="Search states..."
          value={stateSearch}
          onChange={(e) => {
            setStateSearch(e.target.value);
            setStateVisibleCount(6);
          }}
        />
        <ul className="drawer-list">
          {visibleStates.map(state => (
            <li key={state.id} onClick={() => handleStateClick(state)}>
              {state.name} <span className="arrow">›</span>
            </li>
          ))}
        </ul>
        {stateVisibleCount < filteredStates.length && (
          <div className="load-more-wrapper">
            <button onClick={() => setStateVisibleCount(prev => prev + 6)} className="load-more-btn">
              Load More
            </button>
          </div>
        )}
      </div>

      {/* CITY PANEL */}
      <div className={`drawer-panel ${activePanel === 'city' ? 'active' : ''}`}>
        <div className="drawer-header">
          <button onClick={goBack}>← Back</button>
          <h4>{selectedState?.name}</h4>
        </div>
        <input
          type="text"
          className="search-input"
          placeholder="Search cities..."
          value={citySearch}
          onChange={(e) => {
            setCitySearch(e.target.value);
            setCityVisibleCount(6);
          }}
        />
        <ul className="drawer-list">
          {visibleCities.map(city => (
            <li key={city.id} onClick={() => handleCityClick(city)}>
              <a href="">{city.name}</a>
            </li>
          ))}
        </ul>
        {cityVisibleCount < filteredCities.length && (
          <div className="load-more-wrapper">
            <button onClick={() => setCityVisibleCount(prev => prev + 6)} className="load-more-btn">
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== Parent Component =====
export default function App() {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <div>
      <StateCityDrawer
        onStateSelect={(stateId) => {
          setSelectedState(stateId);
          setSelectedCity(null);
        }}
        onCitySelect={({ stateId, cityId }) => {
          setSelectedState(stateId);
          setSelectedCity(cityId);
        }}
      />

      
    </div>
  );
}
