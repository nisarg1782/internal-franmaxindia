import React from "react";
import {
  FaCheckCircle,
  FaRocket,
  FaBuilding,
  FaChartLine,
  FaBullhorn,
  FaGavel,
} from "react-icons/fa";
import { MdWork, MdOutlineStorefront } from "react-icons/md";
import BenefitCard from "./BenefitCard";
import WorkList from "./WorkList";

const tabData = {
  build: {
    title: "Start Your Own Brand with Franmax India",
    description:
      "We help aspiring entrepreneurs build their own brand from scratch, including branding, legal setup, marketing, and business planning.",
    benefits: [
      "Customized Branding Support",
      "Market & Competitor Analysis",
      "Full Business Model Creation",
    ],
    work: [
      { icon: <FaRocket />, label: "Logo & Identity Design" },
      { icon: <FaGavel />, label: "Legal & Licensing Help" },
      { icon: <MdOutlineStorefront />, label: "Store Setup Guidance" },
      { icon: <FaChartLine />, label: "Menu/Product Design" },
      { icon: <FaBullhorn />, label: "Social Media & Ads" },
    ],
  },
  franchise: {
    title: "Find the Right Franchise with Franmax India",
    description:
      "Choosing the right franchise is crucial. We guide you through the evaluation, negotiation, and onboarding process.",
    benefits: [
      "Personalized Franchise Match",
      "ROI & Risk Assessment",
      "Franchise Agreement Guidance",
    ],
    work: [
      { icon: <FaChartLine />, label: "Market Research" },
      { icon: <FaBuilding />, label: "Brand Comparisons" },
      { icon: <FaGavel />, label: "Franchise Document Review" },
      { icon: <FaRocket />, label: "Investment Planning" },
      { icon: <MdWork />, label: "Location Strategy" },
    ],
  },
};

const TabContent = ({ activeTab }) => {
  const { title, description, benefits, work } = tabData[activeTab];

  return (
    <div className="tab-content enhanced-tab-content">
      <h2 className="tab-title">{title}</h2>
      <p className="tab-description">{description}</p>

      <section className="tab-section">
        <h3 className="tab-subheading">🌟 Key Benefits</h3>
        <div className="benefit-list">
          {benefits.map((benefit, index) => (
            <div className="benefit-card enhanced-benefit-card" key={index}>
              <FaCheckCircle className="benefit-icon" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* <section className="tab-section">
        <h3 className="tab-subheading">🛠️ What We Do</h3>
        <div className="work-grid">
          {work.map((item, index) => (
            <div className="work-item" key={index}>
              <div className="work-icon">{item.icon}</div>
              <p className="work-label">{item.label}</p>
            </div>
          ))}
        </div>
      </section> */}

      <section className="tab-section what-we-do">
        <h3 className="tab-subheading">🛠️ What We Do</h3>
        {/* key={activeTab} forces remount on tab change */}
        <div className="work-grid" key={activeTab}>
          {work.map((item, index) => (
            <div className="work-card" key={index}>
              <div className="work-icon">{item.icon}</div>
              <div className="work-text">
                <h4 className="work-label">{item.label}</h4>
                {/* descriptions unchanged */}
                {item.label === "Logo & Identity Design" && (
                  <p className="work-desc">
                    Unique brand identities and logos that create a lasting
                    impression and build customer trust.
                  </p>
                )}
                {item.label === "Legal & Licensing Help" && (
                  <p className="work-desc">
                    Complete support for registrations, licensing, and franchise
                    agreements to ensure smooth operations.
                  </p>
                )}
                {item.label === "Store Setup Guidance" && (
                  <p className="work-desc">
                    Location planning, layout design, and operational setup so
                    your store is customer-ready.
                  </p>
                )}
                {item.label === "Menu/Product Design" && (
                  <p className="work-desc">
                    Engaging menus and product strategies designed to boost
                    sales and customer loyalty.
                  </p>
                )}
                {item.label === "Social Media & Ads" && (
                  <p className="work-desc">
                    Creative campaigns and targeted ads to grow your online
                    presence and attract more customers.
                  </p>
                )}
                {item.label === "Market Research" && (
                  <p className="work-desc">
                    In-depth market studies and competitor analysis to guide
                    smart business decisions.
                  </p>
                )}
                {item.label === "Brand Comparisons" && (
                  <p className="work-desc">
                    Transparent evaluation of multiple franchise brands so you
                    can invest wisely.
                  </p>
                )}
                {item.label === "Franchise Document Review" && (
                  <p className="work-desc">
                    Legal experts review every agreement to safeguard your
                    interests before you commit.
                  </p>
                )}
                {item.label === "Investment Planning" && (
                  <p className="work-desc">
                    Customized financial planning for long-term growth and
                    sustainable profits.
                  </p>
                )}
                {item.label === "Location Strategy" && (
                  <p className="work-desc">
                    Smart location analysis based on footfall, demographics, and
                    geography for maximum ROI.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TabContent;
