import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../../utils/api";

export default function CategoryDrawer() {
  const navigate = useNavigate();

  const [masterCategories, setMasterCategories] = useState([]);
  const [categories, setCategories] = useState({});
  const [subcategories, setSubcategories] = useState({});

  const [activePanel, setActivePanel] = useState("master");
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [subSearch, setSubSearch] = useState("");
  const [visibleMasters, setVisibleMasters] = useState(4);
  const [visibleCategories, setVisibleCategories] = useState(4);
  const [visibleSubcategories, setVisibleSubcategories] = useState(4);

  // Fetch master categories
  useEffect(() => {
    fetch(getApiUrl("get-master-category.php"))
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setMasterCategories(data));
  }, []);

  const saveSelection = ({ masterId, categoryId, subcategoryId }) => {
    localStorage.setItem(
      "categorySelection",
      JSON.stringify({ masterId, categoryId, subcategoryId })
    );
  };

  const handleMasterClick = (master) => {
    setSelectedMaster(master);
    setActivePanel("category");
    setCategorySearch("");
    setVisibleCategories(4);
    setSelectedCategory(null);
    setSelectedSubcategory(null);

    saveSelection({ masterId: master.mas_cat_id });

    navigate(`/category?mas_cat=${master.mas_cat_id}`);

    if (!categories[master.mas_cat_id]) {
      fetch(
        getApiUrl(`get-category.php?mas_cat_id=${master.mas_cat_id}`)
      )
        .then((res) => res.json())
        .then((data) => {
          setCategories((prev) => ({ ...prev, [master.mas_cat_id]: data }));
        });
    }
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setActivePanel("subcategory");
    setSubSearch("");
    setVisibleSubcategories(4);
    setSelectedSubcategory(null);

    saveSelection({ masterId: selectedMaster?.mas_cat_id, categoryId: cat.cat_id });

    navigate(`/category?mas_cat=${selectedMaster?.mas_cat_id}&cat=${cat.cat_id}`);

    if (!subcategories[cat.cat_id]) {
      fetch(getApiUrl(`get-sub-category.php?cat_id=${cat.cat_id}`))
        .then((res) => res.json())
        .then((data) => {
          setSubcategories((prev) => ({ ...prev, [cat.cat_id]: data }));
        });
    }
  };

  const handleSubcategoryClick = (sub) => {
    setSelectedSubcategory(sub);

    saveSelection({
      masterId: selectedMaster?.mas_cat_id,
      categoryId: selectedCategory?.cat_id,
      subcategoryId: sub.subcat_id,
    });

    navigate(
      `/category?mas_cat=${selectedMaster?.mas_cat_id}&cat=${selectedCategory?.cat_id}&sub=${sub.subcat_id}`
    );
  };

  const goBack = () => {
    if (activePanel === "subcategory") setActivePanel("category");
    else if (activePanel === "category") setActivePanel("master");
  };

  // Filter logic
  const filteredMasters = masterCategories.filter((cat) =>
    cat.mas_cat_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const displayedMasters = filteredMasters.slice(0, visibleMasters);

  const categoryList = categories[selectedMaster?.mas_cat_id] || [];
  const filteredCategories = categoryList.filter((cat) =>
    cat.cat_name.toLowerCase().includes(categorySearch.toLowerCase())
  );
  const displayedCategories = filteredCategories.slice(0, visibleCategories);

  const subcategoryList = subcategories[selectedCategory?.cat_id] || [];
  const filteredSubcategories = subcategoryList.filter((sub) =>
    sub.subcat_name.toLowerCase().includes(subSearch.toLowerCase())
  );
  const displayedSubcategories = filteredSubcategories.slice(
    0,
    visibleSubcategories
  );

  return (
    <div className="drawer-container">
      {/* MASTER PANEL */}
      <div className={`drawer-panel ${activePanel === "master" ? "active" : ""}`}>
        <h4>Explore Categories</h4>
        <input
          type="text"
          placeholder="Search master categories..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setVisibleMasters(4);
          }}
        />
        <ul>
          {displayedMasters.map((master) => (
            <li
              key={master.mas_cat_id}
              onClick={() => handleMasterClick(master)}
            >
              {master.mas_cat_name} ›
            </li>
          ))}
        </ul>
      </div>

      {/* CATEGORY PANEL */}
      <div className={`drawer-panel ${activePanel === "category" ? "active" : ""}`}>
        <button onClick={goBack}>← Back</button>
        <h4>{selectedMaster?.mas_cat_name}</h4>
        <input
          type="text"
          placeholder="Search categories..."
          value={categorySearch}
          onChange={(e) => {
            setCategorySearch(e.target.value);
            setVisibleCategories(4);
          }}
        />
        <ul>
          {displayedCategories.map((cat) => (
            <li key={cat.cat_id} onClick={() => handleCategoryClick(cat)}>
              {cat.cat_name} ›
            </li>
          ))}
        </ul>
      </div>

      {/* SUBCATEGORY PANEL */}
      <div className={`drawer-panel ${activePanel === "subcategory" ? "active" : ""}`}>
        <button onClick={goBack}>← Back</button>
        <h4>{selectedCategory?.cat_name}</h4>
        <input
          type="text"
          placeholder="Search subcategories..."
          value={subSearch}
          onChange={(e) => {
            setSubSearch(e.target.value);
            setVisibleSubcategories(4);
          }}
        />
        <ul>
          {displayedSubcategories.map((sub) => (
            <li key={sub.subcat_id}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubcategoryClick(sub);
                }}
              >
                {sub.subcat_name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
