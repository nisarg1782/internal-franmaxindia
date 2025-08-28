import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadDocs.css';
import BrandSidebar from './BrandSidebar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getApiUrl,getImageUrl} from '../utils/api';
import BrandDashboardHeader from './BrandDashboardHeader';

const imageLabels = [
    { key: "logo", label: "Logo" },
    { key: "primaryImage", label: "Primary Image" },
    { key: "listingImage", label: "Listing Page Image" },
    { key: "detailImage1", label: "Detail Page Image 1" },
    { key: "detailImage2", label: "Detail Page Image 2" }
];

const UploadDocs = () => {
    const [formData, setFormData] = useState({});
    const [existingUrls, setExistingUrls] = useState({});
    const [isUploading, setIsUploading] = useState(false);
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

        if (idFromSession) {
            setBrandId(idFromSession);
        } else {
            console.error("No valid brand ID found. Redirecting to login.");
            navigate('/');
        }
    }, [navigate]);

    // Fetch previously uploaded images based on brandId
    useEffect(() => {
        const fetchExistingDocs = async () => {
            if (!brandId) return; // Wait until brandId is available

            try {
                const res = await fetch(getApiUrl(`get-docs.php?brand_id=${brandId}`));
                const data = await res.json();
                if (data.success) {
                    setExistingUrls(data.images || {});
                } else {
                    toast.error(data.message || "Failed to load images.");
                }
            } catch (err) {
                toast.error("Error fetching uploaded images.");
                console.error("Error fetching uploaded images:", err);
            }
        };

        fetchExistingDocs();
    }, [brandId]); // This effect now depends on `brandId`

    const handleFileSelect = (e, key) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, [key]: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for missing images before upload
        const missing = imageLabels.filter(({ key }) => !formData[key] && !existingUrls[key]);
        if (missing.length > 0) {
            toast.error(`Missing image: ${missing[0].label}`);
            return;
        }

        const data = new FormData();
        imageLabels.forEach(({ key }) => {
            if (formData[key]) data.append(key, formData[key]);
        });

        // Use the brandId from state
        if (brandId) {
            data.append('brand_id', brandId);
        } else {
            toast.error("Brand ID not found. Please log in again.");
            return;
        }

        try {
            setIsUploading(true);
            const res = await fetch(getApiUrl('upload-docs.php'), {
                method: 'POST',
                body: data
            });
            const result = await res.json();
            setIsUploading(false);

            if (result.success) {
                toast.success(result.message || "Files uploaded successfully!");
                setFormData({});
                if (result.files) {
                    setExistingUrls(prevUrls => ({ ...prevUrls, ...result.files }));
                }
            } else {
                if (result.errors) {
                    result.errors.forEach(errorMsg => {
                        toast.error(errorMsg);
                    });
                } else {
                    toast.error(result.message || "Upload failed.");
                }
            }
        } catch (error) {
            setIsUploading(false);
            toast.error("Error uploading files.");
        }
    };

    const renderPreview = (file, key) => {
        if (file) {
            return URL.createObjectURL(file);
        } else if (existingUrls[key]) {
            return existingUrls[key];
        }
        return null;
    };

    if (!brandId) {
        return (
            <div className="upload-layout">
                <BrandSidebar />
                <div className="upload-wrapper">
                    <p>Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="upload-layout">
            <BrandSidebar />
            <div className="upload-wrapper">
                <BrandDashboardHeader /> {/* Added BrandDashboardHeader here */}
                <ToastContainer />

                {isUploading && (
                    <div className="upload-overlay">
                        <div className="upload-loader">Uploading...</div>
                    </div>
                )}

                <h2>Upload Brand Images</h2>
                <form className="upload-form" onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="upload-grid">
                        {imageLabels.map(({ key, label }) => (
                            <div className="upload-slot" key={key}>
                                <label>{label}</label>
                                <div className="upload-box">
                                    {renderPreview(formData[key], key) ? (
                                        <img
                                            src={getImageUrl(renderPreview(formData[key], key))}
                                            alt={`${label} Preview`}
                                            className="upload-thumbnail"
                                        />
                                    ) : (
                                        <span className="upload-placeholder">Choose file</span>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileSelect(e, key)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button type="submit" disabled={isUploading}>
                        {isUploading ? "Uploading..." : "Upload Documents"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadDocs;