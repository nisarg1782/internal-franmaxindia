import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const INDIA_TOPO_JSON =
  "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@main/topojson/all_india.topo.json";

// States to highlight
const expansionStates = [
  "Gujarat",
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Rajasthan",
];

const App = () => {
  return (
    <div style={{ padding: 20, fontFamily: "Segoe UI" }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        📍 Expansion Plan Across Indian States
      </h2>
      <div
        style={{
          maxWidth: 800,
          margin: "auto",
          border: "1px solid #ccc",
          borderRadius: 10,
        }}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 1000, center: [80, 22] }}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={INDIA_TOPO_JSON}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const state = geo.properties.st_nm || geo.properties.NAME_1;
                const isHighlighted = expansionStates.includes(state);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      const tooltip = document.getElementById("tooltip");
                      if (tooltip) tooltip.innerHTML = state;
                    }}
                    onMouseLeave={() => {
                      const tooltip = document.getElementById("tooltip");
                      if (tooltip) tooltip.innerHTML = "";
                    }}
                    style={{
                      default: {
                        fill: isHighlighted ? "#28a745" : "#E0E0E0",
                        outline: "none",
                        stroke: "#fff",
                        strokeWidth: 0.5,
                      },
                      hover: {
                        fill: isHighlighted ? "#218838" : "#d6d6d6",
                        outline: "none",
                      },
                      pressed: {
                        fill: "#2c3e50",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
      <div
        id="tooltip"
        style={{
          textAlign: "center",
          marginTop: 10,
          fontSize: 16,
          fontWeight: "bold",
        }}
      ></div>
    </div>
  );
};

export default App;
