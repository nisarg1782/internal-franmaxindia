// FranMaxIndiaPage.jsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import './design/EventPage.css';
import { getApiUrl } from '../utils/api';

const FranMaxIndiaPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        state: null,
        city: null,
        source: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);

    useEffect(() => {
        const fetchStates = async () => {
            setLoadingStates(true);
            try {
                const response = await fetch(getApiUrl('get-indian-states.php'));
                if (!response.ok) {
                    throw new Error('Failed to fetch states. Please check the API endpoint.');
                }
                const data = await response.json();
                const formattedStates = data.map(state => ({
                    value: state.id,
                    label: state.name
                }));
                setStates(formattedStates);
            } catch (error) {
                console.error("Error fetching states:", error);
                toast.error(`Error: ${error.message}`);
            } finally {
                setLoadingStates(false);
            }
        };
        fetchStates();
    }, []);

    useEffect(() => {
        const fetchCities = async (stateId) => {
            if (!stateId) {
                setCities([]);
                return;
            }
            setLoadingCities(true);
            try {
                const response = await fetch(getApiUrl(`get-cities.php/?state_id=${stateId}`));
                if (!response.ok) {
                    throw new Error('Failed to fetch cities. Please check the API endpoint.');
                }
                const data = await response.json();
                const formattedCities = data.map(city => ({
                    value: city.id,
                    label: city.name
                }));
                setCities(formattedCities);
            } catch (error) {
                console.error("Error fetching cities:", error);
                toast.error(`Error: ${error.message}`);
            } finally {
                setLoadingCities(false);
            }
        };

        if (formData.state) {
            fetchCities(formData.state.value);
        } else {
            setCities([]);
        }
    }, [formData.state]);

    const openModal = () => setIsModalOpen(true);

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({
            name: '',
            email: '',
            phone: '',
            state: null,
            city: null,
            source: '',
        });
        setIsSubmitted(false);
        setCities([]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDropdownChange = (selectedOption, actionMeta) => {
        const { name } = actionMeta;
        setFormData(prevState => {
            if (name === 'state') {
                return {
                    ...prevState,
                    state: selectedOption,
                    city: null,
                };
            }
            return {
                ...prevState,
                [name]: selectedOption,
            };
        });
    };

    const validateForm = () => {
        let isValid = true;
        let validationErrors = [];

        if (!formData.name.trim()) {
            validationErrors.push("Name is required.");
            isValid = false;
        }
        if (!formData.email.trim()) {
            validationErrors.push("Email is required.");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            validationErrors.push("Email address is invalid.");
            isValid = false;
        }
        if (!formData.phone.trim()) {
            validationErrors.push("Phone number is required.");
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.phone)) {
            validationErrors.push("Phone number is invalid (e.g., 9876543210).");
            isValid = false;
        }
        if (!formData.state) {
            validationErrors.push("State is required.");
            isValid = false;
        }
        if (!formData.city) {
            validationErrors.push("City is required.");
            isValid = false;
        }
        if (!formData.source) {
            validationErrors.push("Please select how you heard about us.");
            isValid = false;
        }

        if (!isValid) {
            validationErrors.forEach(error => toast.error(error));
        }
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            state: formData.state.value,
            city: formData.city.value,
            source: formData.source,
        };
        try {
             document.getElementById('register-button').textContent = 'Submitting...';
            const response = await fetch(getApiUrl('register-event.php'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
             document.getElementById('register-button').textContent = 'Submitting...';
            const result = await response.json();
             document.getElementById('register-button').textContent = 'Submitting...';

            if (response.ok && result.success) {
                // register-button make the text of this as submitting
               
                setIsSubmitted(true);
                toast.success(result.message || "Thank you for registering! We'll be in touch soon.");
            } else {
                toast.error(result.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error(`Error: ${error.message}`);
        }
    };


    const heroVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } },
    };

    const buttonVariants = {
        hover: { scale: 1.05, transition: { duration: 0.3 } },
        tap: { scale: 0.95 }
    };

    const modalVariants = {
        hidden: { opacity: 0, y: "-100vh" },
        visible: {
            opacity: 1,
            y: "0",
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 200
            }
        },
        exit: { opacity: 0, y: "100vh" }
    };

    return (
        <div className="franmax-page-container">
            <motion.header
                className="hero-header-section"
                initial="hidden"
                animate="visible"
                variants={heroVariants}
            >
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="logo-section">
                        <h1 className="franmax-title">FranMax India Presents:</h1>
                        <h2 className="summit-title">The Franchise Show 2025</h2>
                    </div>
                    <h3 className="hero-tagline">Unlock Your Entrepreneurial Potential</h3>
                    <div className="event-details">
                        <p><strong>Date:</strong> Sunday, 14 September 2025</p>
                        <p><strong>Time:</strong> 10:00 AM - 6:00 PM</p>
                        <p><strong>Venue:</strong> Taj Skyline, Ahmedabad</p>
                    </div>
                    <motion.button
                        onClick={openModal}
                        className="register-button hero-register-button"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Register Now
                    </motion.button>
                </div>
            </motion.header>

            <motion.div
                className="content-wrapper"
                initial="hidden"
                animate="visible"
                variants={contentVariants}
            >
                <div className="content-section">
                    <h3 className="section-title">Why Attend The Franchise Show?</h3>
                    <div className="benefits-grid">
                        <motion.div
                            className="benefit-card"
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <h4>1. Discover Exclusive Opportunities</h4>
                            <p>Explore over <strong>35 leading brands</strong> across various sectors, all under one roof. Find the perfect business model that aligns with your passion and investment goals.</p>
                        </motion.div>
                        <motion.div
                            className="benefit-card"
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h4>2. Learn from Industry Leaders</h4>
                            <p>Attend exclusive workshops and keynote sessions led by top franchise consultants and successful business owners. Gain valuable insights on market trends and best practices.</p>
                        </motion.div>
                        <motion.div
                            className="benefit-card"
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <h4>3. Network for Success</h4>
                            <p>Connect with a community of like-minded investors, mentors, and brand representatives. Build relationships that can lead to partnerships and invaluable support.</p>
                        </motion.div>
                        <motion.div
                            className="benefit-card"
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <h4>4. A Proven Path to Growth</h4>
                            <p>By investing in a franchise, you're leveraging a proven business model, an established brand name, and comprehensive support systems for a higher chance of success.</p>
                        </motion.div>
                    </div>
                </div>

                <div className="brands-section">
                    <h3 className="section-title">Featured Brands Include:</h3>
                    <motion.ul
                        className="brand-list"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6 }}
                    >
                        <li><strong>Food & Beverage:</strong> Acha's Kitchen, Coffee Bloom, The Pizza Lab</li>
                        <li><strong>Education:</strong> Future Minds Tutors, STEM Innovators</li>
                        <li><strong>Health & Wellness:</strong> Aura Spa, Fit & Flex Gym</li>
                        <li><strong>Retail & Services:</strong> Urban Cleaners, My Pet Store</li>
                    </motion.ul>
                    <p className="brands-note">(... and over 25 more premier brands!)</p>
                </div>

                <div className="cta-section">
                    <h3 className="cta-title">Ready to Take the Next Step?</h3>
                    <p>Join India's leading franchise event and unlock your entrepreneurial journey.</p>
                    <motion.button
                        onClick={openModal}
                        className="register-button"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Register Now
                    </motion.button>
                </div>
            </motion.div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="registration-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="modal-content"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <span className="close-button" onClick={closeModal}>&times;</span>
                            <h3 className="section-title modal-title">Register for The Franchise Show 2025</h3>
                            {isSubmitted ? (
                                <div className="success-message">
                                    <h4>Thank You for Registering!</h4>
                                    <p>Your registration has been successfully submitted. We look forward to seeing you at the event!</p>
                                    <motion.button
                                        onClick={closeModal}
                                        className="register-button close-modal-button"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        Close
                                    </motion.button>
                                </div>
                            ) : (
                                <form className="registration-form" onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your Full Name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Your Email Address"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phone">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Your Phone Number (e.g., 9876543210)"
                                        />
                                    </div>
                                    <div className="form-group-row">
                                        <div className="form-group dropdown-group">
                                            <label htmlFor="state">State</label>
                                            <Select
                                                name="state"
                                                id="state"
                                                options={states}
                                                value={formData.state}
                                                onChange={handleDropdownChange}
                                                placeholder={loadingStates ? "Loading..." : "Select State"}
                                                classNamePrefix="react-select"
                                                isDisabled={loadingStates}
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                            />
                                        </div>
                                        <div className="form-group dropdown-group">
                                            <label htmlFor="city">City</label>
                                            <Select
                                                name="city"
                                                id="city"
                                                options={cities}
                                                value={formData.city}
                                                onChange={handleDropdownChange}
                                                placeholder={loadingCities ? "Loading..." : "Select City"}
                                                classNamePrefix="react-select"
                                                isDisabled={!formData.state || loadingCities}
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Where did you hear about this event?</label>
                                        <div className="radio-group">
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="source"
                                                    value="social media ads"
                                                    checked={formData.source === "social media ads"}
                                                    onChange={handleChange}
                                                />
                                                Social Media Ads
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="source"
                                                    value="radio"
                                                    checked={formData.source === "radio"}
                                                    onChange={handleChange}
                                                />
                                                Radio
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="source"
                                                    value="newspaper"
                                                    checked={formData.source === "newspaper"}
                                                    onChange={handleChange}
                                                />
                                                Newspaper
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="source"
                                                    value="cycle branding"
                                                    checked={formData.source === "cycle branding"}
                                                    onChange={handleChange}
                                                />
                                                Cycle Branding
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="source"
                                                    value="whatsapp"
                                                    checked={formData.source === "whatsapp"}
                                                    onChange={handleChange}
                                                />
                                                WhatsApp
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="source"
                                                    value="other"
                                                    checked={formData.source === "other"}
                                                    onChange={handleChange}
                                                />
                                                Other
                                            </label>
                                        </div>
                                    </div>
                                    <motion.button
                                        type="submit"
                                        id="register-button"
                                        className="register-button"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        Register
                                    </motion.button>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ToastContainer />
        </div>
    );
};
export default FranMaxIndiaPage;