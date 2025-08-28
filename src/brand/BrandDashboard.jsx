// Updated BrandDashboard.jsx with session-based brand ID and a fallback default
import React, { useEffect, useState } from 'react';
import './brandDashboard.css';
import BrandSidebar from './BrandSidebar';
import BrandDashboardHeader from './BrandDashboardHeader';
import {
    FaUsers, FaThumbsUp, FaThumbsDown, FaHandshake,
    FaBan, FaEnvelopeOpenText
} from 'react-icons/fa';
import {
    PieChart, Pie, Cell, Tooltip, Legend,
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../utils/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#7B68EE'];

const BrandDashboard = () => {
    const [totalInquiries, setTotalInquiries] = useState(0);
    const [stateData, setStateData] = useState([]);
    const [monthData, setMonthData] = useState([]);
    const [remarkCounts, setRemarkCounts] = useState({});
    const [brandId, setBrandId] = useState(null);

    const navigate = useNavigate();

    // Effect to get the brandId from the session on component load
    useEffect(() => {
        let idFromSession = null;
        try {
            const sessionString = localStorage.getItem('userSession');
            if (sessionString) {
                const sessionData = JSON.parse(sessionString);
                if (sessionData && sessionData.id) {
                    idFromSession = sessionData.id;
                }
            }
        } catch (error) {
            console.error("Failed to parse user session:", error);
        }

        // Set the brandId state with the value from the session, or a fallback default
        // The default value is 'brand' as requested. You might want to use a specific default ID
        // like `1` or handle this with a redirect to the login page.
        if (idFromSession) {
            setBrandId(idFromSession);
        } else {
            // setBrandId(4);
            // Option 1: Set a default ID
            // setBrandId(1); // For testing purposes, if you want a specific brand's data
            
            // Option 2: Redirect to the login page
            // console.error("No valid brand ID found. Redirecting to login.");
            navigate('/');
        }
    }, [navigate]);

    // Effect to fetch data, dependent on brandId being available
    useEffect(() => {
        const fetchData = async () => {
            if (!brandId) return; // Don't fetch if brandId isn't set yet

            try {
                const res = await axios.get(getApiUrl(`get_brand_inquiries.php?brand_id=${brandId}`));
                const data = res.data;

                setTotalInquiries(data.total || 0);

                // State-wise processing
                const totalState = data.statewise.reduce((sum, item) => sum + parseInt(item.count), 0);
                const stateProcessed = data.statewise.map(item => ({
                    name: item.state,
                    value: parseInt(item.count),
                    percentage: ((item.count / totalState) * 100).toFixed(1)
                }));
                setStateData(stateProcessed);

                // Month-wise processing
                const monthProcessed = data.monthly.map(entry => ({
                    month: entry.month,
                    enquiries: parseInt(entry.count)
                }));
                setMonthData(monthProcessed);

                // Remark-wise processing
                const remarkMap = {};
                data.remarkwise?.forEach(r => {
                    remarkMap[r.remark] = parseInt(r.count);
                });
                setRemarkCounts(remarkMap);

            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            }
        };

        fetchData();
    }, [brandId]); // Now the dependency is brandId

    const handleRemarkClick = (remark) => {
        navigate(`/brand/inquiries?remark=${encodeURIComponent(remark)}`);
    };

    if (!brandId) {
        // You can render a loading state or a message while waiting for the ID
        return <div>Loading dashboard...</div>;
    }

    return (
        <div className="brand-crm-container">
            <BrandSidebar />
            <div className="brand-crm-main">
                <BrandDashboardHeader />
                <section className="brand-overview">
                    <h2>Brand Performance Overview</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="icon-box green"><FaUsers /></div>
                            <div className="text-box">
                                <h4>Total Inquiries</h4>
                                <p>{totalInquiries}</p>
                            </div>
                        </div>
                        {/* Remark Cards */}
                        <div className="stat-card clickable" onClick={() => handleRemarkClick('interested')}>
                            <div className="icon-box success"><FaThumbsUp /></div>
                            <div className="text-box">
                                <h4>Interested</h4>
                                <p>{remarkCounts.interested || 0}</p>
                            </div>
                        </div>
                        <div className="stat-card clickable" onClick={() => handleRemarkClick('not interested')}>
                            <div className="icon-box danger"><FaThumbsDown /></div>
                            <div className="text-box">
                                <h4>Not Interested</h4>
                                <p>{remarkCounts["not interested"] || 0}</p>
                            </div>
                        </div>
                        <div className="stat-card clickable" onClick={() => handleRemarkClick('deal')}>
                            <div className="icon-box teal"><FaHandshake /></div>
                            <div className="text-box">
                                <h4>Deal</h4>
                                <p>{remarkCounts.deal || 0}</p>
                            </div>
                        </div>
                        <div className="stat-card clickable" onClick={() => handleRemarkClick('not qualified')}>
                            <div className="icon-box gray"><FaBan /></div>
                            <div className="text-box">
                                <h4>Not Qualified</h4>
                                <p>{remarkCounts["not qualified"] || 0}</p>
                            </div>
                        </div>
                        <div className="stat-card clickable" onClick={() => handleRemarkClick('not received')}>
                            <div className="icon-box purple"><FaEnvelopeOpenText /></div>
                            <div className="text-box">
                                <h4>Not Received</h4>
                                <p>{remarkCounts["not received"] || 0}</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="brand-charts">
                    <h3>State-wise Enquiries (Total: {totalInquiries})</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stateData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, value, percentage }) =>
                                        `${name} (${value}) - ${percentage}%`
                                    }
                                >
                                    {stateData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value, name, props) =>
                                        [`${value} inquiries (${props.payload.percentage}%)`, 'Enquiries']
                                    }
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <h3 style={{ marginTop: '40px' }}>Month-wise Inquiries</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`${value} Inquiries`, 'Monthly Total']} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="enquiries"
                                    name="Monthly Inquiries"
                                    stroke="#0088FE"
                                    strokeWidth={3}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default BrandDashboard;