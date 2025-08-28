import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Newsletter.css';
import Sidebar from './Sidebar';
import { FaPlus, FaEdit, FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getApiUrl ,getImageUrl } from '../utils/api';

// Utility function to get API URL
// const getApiUrl = (endpoint) => `http://localhost/react-api/${endpoint}`;

export default function NewsletterTable() {
    const [newsletters, setNewsletters] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State for editing functionality
    const [editingNewsId, setEditingNewsId] = useState(null);
    const [editingNewsData, setEditingNewsData] = useState({ title: '', description: '' });

    // State for delete confirmation
    const [deletingNewsId, setDeletingNewsId] = useState(null);

    const [newNews, setNewNews] = useState({
        title: '',
        image: null,
        description: '',
    });

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setNewNews({
            title: '',
            image: null,
            description: '',
        });
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setNewNews((prevNews) => ({
            ...prevNews,
            [name]: files ? files[0] : value,
        }));
    };

    const handleDescriptionChange = (content) => {
        setNewNews((prevNews) => ({
            ...prevNews,
            description: content,
        }));
    };

    // New handlers for editing
    const handleEditClick = (news) => {
        setEditingNewsId(news.id);
        setEditingNewsData({ title: news.title, description: news.description });
    };

    const handleEditCancel = () => {
        setEditingNewsId(null);
        setEditingNewsData({ title: '', description: '' });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingNewsData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleEditDescriptionChange = (content) => {
        setEditingNewsData(prevData => ({ ...prevData, description: content }));
    };

    // New handlers for deletion
    const handleDeleteClick = (id) => {
        setDeletingNewsId(id);
    };

    const handleConfirmDelete = () => {
        const formData = new FormData();
        formData.append('id', deletingNewsId);
        formData.append('action', 'delete');
        manageNews(formData);
        setDeletingNewsId(null); // Close the confirmation modal
    };

    const handleCancelDelete = () => {
        setDeletingNewsId(null); // Close the confirmation modal
    };

    // Unified function to handle add, edit, and delete API calls
    const manageNews = async (formData) => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl('add-news.php'), {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Network response was not ok.');
            }

            const result = await res.json();
            if (result.success) {
                toast.success(result.message);
                fetchNewsletters(); // Refresh the list
                closeModal();
                setEditingNewsId(null); // Exit edit mode
            } else {
                toast.error(result.message || 'An unexpected error occurred.');
            }
        } catch (err) {
            toast.error('Failed to communicate with the server.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('action', 'add');
        formData.append('title', newNews.title);
        formData.append('image', newNews.image);
        formData.append('description', newNews.description);
        manageNews(formData);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('action', 'edit');
        formData.append('id', editingNewsId);
        formData.append('title', editingNewsData.title);
        formData.append('description', editingNewsData.description);
        manageNews(formData);
    };

    const fetchNewsletters = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl('get-news.php'));
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await res.json();

            if (data.success) {
                setNewsletters(data.news);
            } else {
                setNewsletters([]);
            }
        } catch (err) {
            toast.error('Failed to fetch newsletters.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNewsletters();
    }, []);

    return (
        <div className="newsletter-page-container">
            <Sidebar />
            <div className="main-content">
                <ToastContainer />
                <div className="table-header">
                    <h2 className="table-title">Newsletters</h2>
                    <button onClick={openModal} className="add-news-btn">
                        <FaPlus className="icon" /> Add News
                    </button>
                </div>

                {loading && <div className="loading">Loading...</div>}

                {!loading && newsletters.length === 0 && (
                    <div className="no-data-message">No newsletters found.</div>
                )}

                {!loading && newsletters.length > 0 && (
                    <div className="table-wrapper">
                        <table className="newsletter-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Created At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newsletters.map((news) => (
                                    <React.Fragment key={news.id}>
                                        {editingNewsId === news.id ? (
                                            // Editable Row
                                            <tr className="edit-row">
                                                <td>{news.id}</td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        value={editingNewsData.title}
                                                        onChange={handleEditChange}
                                                    />
                                                </td>
                                                <td>{news.created_at}</td>
                                                <td className="action-buttons">
                                                    <button onClick={handleEditSubmit} className="save-btn">
                                                        <FaSave /> Save
                                                    </button>
                                                    <button onClick={handleEditCancel} className="cancel-btn">
                                                        <FaTimes /> Cancel
                                                    </button>
                                                </td>
                                            </tr>
                                        ) : (
                                            // Summary Row
                                            <tr className="summary-row">
                                                <td>{news.id}</td>
                                                <td>{news.title}</td>
                                                <td>{news.created_at}</td>
                                                <td className="action-buttons">
                                                    <button onClick={() => toggleExpand(news.id)} className="expand-btn">
                                                        {expandedId === news.id ? 'Hide Details' : 'View Details'}
                                                    </button>
                                                    <button onClick={() => handleEditClick(news)} className="edit-btn">
                                                        <FaEdit /> Edit
                                                    </button>
                                                    <button onClick={() => handleDeleteClick(news.id)} className="delete-btn">
                                                        <FaTrash /> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        )}
                                        {editingNewsId === news.id && (
                                            <tr className="details-row">
                                                <td colSpan="4">
                                                    <div className="details-box">
                                                        <ReactQuill
                                                            theme="snow"
                                                            value={editingNewsData.description}
                                                            onChange={handleEditDescriptionChange}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                        {expandedId === news.id && (
                                            <tr className="details-row">
                                                <td colSpan="4">
                                                    <div className="details-box">
                                                        {news.image && (
                                                            <img
                                                                src={getImageUrl(`${news.image}`)}
                                                                alt={news.title}
                                                                className="newsletter-image"
                                                            />
                                                        )}
                                                        <div
                                                            className="newsletter-description-html"
                                                            dangerouslySetInnerHTML={{ __html: news.description }}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal for adding a new newsletter */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Add New Newsletter</h3>
                            <button className="close-btn" onClick={closeModal}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="add-news-form" encType="multipart/form-data">
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={newNews.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="image">Image</label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <ReactQuill
                                    theme="snow"
                                    value={newNews.description}
                                    onChange={handleDescriptionChange}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="submit-btn">Add News</button>
                                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for delete confirmation */}
            {deletingNewsId && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Confirm Deletion</h3>
                            <button className="close-btn" onClick={handleCancelDelete}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this newsletter? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="delete-btn" onClick={handleConfirmDelete}>
                                <FaTrash /> Delete
                            </button>
                            <button className="cancel-btn" onClick={handleCancelDelete}>
                                <FaTimes /> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}