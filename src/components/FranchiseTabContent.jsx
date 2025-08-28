import React, { useState } from "react";
import {
  FaCheckCircle,
  FaChartBar,
  FaPuzzlePiece,
  FaSearchDollar,
  FaBalanceScale,
  FaClipboardList,
  FaHandshake,
  FaGlobe,
} from "react-icons/fa";
import BenefitCard from "./FranchiseBenifitCard";
import WorkCard from "./WorkCard";
import InquiryForm from "./InquiryForm"; // Modal-friendly form
import "./design/Consulting.css"; // Include modal & form CSS

const tabInfo = {
  expansion: {
    title: "Franchise Expansion",
    description:
      "Franmax India offers strategic franchise expansion services tailored to your business vision. We help brands scale through data-driven market entry plans, partner scouting, and seamless location rollouts across cities and regions.",
    benefits: [
      "Scalable Growth Strategy",
      "Pan-India Expansion Planning",
      "Verified Franchisee Network",
      "Increased Brand Reach",
    ],
    work: [
      {
        icon: <FaSearchDollar />,
        label: "Market Demand Analysis",
        desc: "Franmax India studies market trends, customer behavior, and competitor insights to identify the most profitable franchise opportunities.",
      },
      {
        icon: <FaChartBar />,
        label: "Territory Planning & Roadmap",
        desc: "We create a step-by-step rollout strategy, ensuring you enter the right markets at the right time with maximum growth potential.",
      },
      {
        icon: <FaPuzzlePiece />,
        label: "Franchise Partner Onboarding",
        desc: "Our team scouts and vets reliable franchise partners, making onboarding smooth, transparent, and growth-focused.",
      },
      {
        icon: <FaHandshake />,
        label: "Investor Shortlisting & Screening",
        desc: "We connect you with serious, qualified investors who align with your brand’s long-term vision and values.",
      },
      {
        icon: <FaGlobe />,
        label: "City-wise Rollout Strategy",
        desc: "Franmax helps you expand city by city with a structured roadmap, minimizing risks while maximizing brand reach.",
      },
    ],
  },
  model: {
    title: "Franchise Model Making",
    description:
      "Our team helps you craft a foolproof franchise model that’s replicable, profitable, and easy to operate. From operational frameworks to training modules, we ensure your franchise runs like a well-oiled machine.",
    benefits: [
      "End-to-End Franchise Blueprint",
      "Operational SOPs & Manuals",
      "Financial Projections & Revenue Sharing",
      "Scalable Business Design",
    ],
    work: [
      {
        icon: <FaChartBar />,
        label: "Business Model Drafting",
        desc: "Franmax designs a structured model with clear systems, roles, and responsibilities for consistent franchise operations.",
      },
      {
        icon: <FaPuzzlePiece />,
        label: "Unit Economics Planning",
        desc: "We map out detailed cost structures, pricing, and margins to ensure profitability at every franchise unit.",
      },
      {
        icon: <FaBalanceScale />,
        label: "ROI & Breakeven Analysis",
        desc: "Our experts calculate investment returns and breakeven timelines so franchisees gain financial clarity and confidence.",
      },
      {
        icon: <FaClipboardList />,
        label: "Operations & Compliance SOPs",
        desc: "We prepare easy-to-follow manuals and SOPs that keep every outlet aligned with brand standards.",
      },
      {
        icon: <FaHandshake />,
        label: "Franchisee Onboarding Kits",
        desc: "Franmax builds detailed onboarding kits including training, guidelines, and support for new franchise owners.",
      },
    ],
  },
  auditing: {
    title: "Franchise Auditing",
    description:
      "Maintain consistency and performance across all your franchise outlets with our specialized auditing services. We audit operational health, customer service quality, and compliance with brand guidelines.",
    benefits: [
      "Enhanced Operational Efficiency",
      "Improved Compliance & Brand Image",
      "Data-Driven Performance Tracking",
      "Franchisee Accountability",
    ],
    work: [
      {
        icon: <FaSearchDollar />,
        label: "Franchise Compliance Reports",
        desc: "Franmax conducts in-depth audits to check compliance with brand standards, financial transparency, and legal regulations.",
      },
      {
        icon: <FaBalanceScale />,
        label: "Mystery Audits & Quality Checks",
        desc: "We perform secret audits to evaluate customer service, hygiene, and brand experience at franchise outlets.",
      },
      {
        icon: <FaChartBar />,
        label: "Sales & KPI Review",
        desc: "Our team reviews performance metrics, sales reports, and KPIs to identify gaps and areas of improvement.",
      },
      {
        icon: <FaClipboardList />,
        label: "Standard Operating Benchmarking",
        desc: "We compare franchise operations against industry benchmarks, ensuring outlets perform at their best.",
      },
      {
        icon: <FaHandshake />,
        label: "Feedback & Improvement Planning",
        desc: "Franmax works with franchisees to design practical solutions and action plans for continuous growth.",
      },
    ],
  },
};

const TabContent = ({ activeTab }) => {
  const { title, description, benefits, work } = tabInfo[activeTab];
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  return (
    <div className="tab-content">
      <h2>{title}</h2>
      <p>{description}</p>

      <h3>🌟 Benefits</h3>
      <div className="benefit-list">
        {benefits.map((item, i) => (
          <BenefitCard key={i} text={item} />
        ))}
      </div>

      <h3>🛠️ How Franmax Works</h3>
      <div className="work-grid">
        {work.map((item, i) => (
          <WorkCard
            key={i}
            icon={item.icon}
            label={item.label}
            desc={item.desc}
          />
        ))}
      </div>

      {/* Inquiry Button */}
      <div
        className="inquiry-btn-container"
        style={{ textAlign: "center", marginTop: "30px" }}
      >
        <button
          className="inquiry-btn"
          onClick={() => setShowInquiryModal(true)}
        >
          Inquiry Now
        </button>
      </div>

      {/* Modal */}
      {showInquiryModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowInquiryModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowInquiryModal(false)}
            >
              &times;
            </button>
            <InquiryForm sourceSteps={[title]} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TabContent;
