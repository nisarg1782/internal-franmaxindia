import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Newsletter.css';
import Sidebar from './Sidebar';
import { FaPlus, FaEdit, FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import { getApiUrl } from '../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function NewsletterTable() {
    const [faqs, setFaqs] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // State for editing functionality
    const [editingFaqId, setEditingFaqId] = useState(null);
    const [editingFaqData, setEditingFaqData] = useState({ question: '', answer: '' });

    // New state for delete confirmation
    const [deletingFaqId, setDeletingFaqId] = useState(null);

    const [newFaq, setNewFaq] = useState({
        question: '',
        answer: '',
    });

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setNewFaq({
            question: '',
            answer: '',
        });
    };

    const handleQuestionChange = (e) => {
        const { value } = e.target;
        setNewFaq((prevFaq) => ({
            ...prevFaq,
            question: value,
        }));
    };

    const handleAnswerChange = (content) => {
        setNewFaq((prevFaq) => ({
            ...prevFaq,
            answer: content,
        }));
    };

    // Handlers for the edit form
    const handleEditClick = (faq) => {
        setEditingFaqId(faq.id);
        setEditingFaqData({ question: faq.question, answer: faq.answer });
    };

    const handleEditCancel = () => {
        setEditingFaqId(null);
        setEditingFaqData({ question: '', answer: '' });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingFaqData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleEditQuillChange = (content) => {
        setEditingFaqData(prevData => ({ ...prevData, answer: content }));
    };

    // New handlers for deletion
    const handleDeleteClick = (id) => {
        setDeletingFaqId(id);
    };

    const handleConfirmDelete = () => {
        const formData = new FormData();
        formData.append('id', deletingFaqId);
        formData.append('action', 'delete');
        manageFaq(formData);
        setDeletingFaqId(null); // Close the confirmation modal
    };

    const handleCancelDelete = () => {
        setDeletingFaqId(null); // Close the confirmation modal
    };
    
    // Unified function to handle add, edit, and delete API calls
    const manageFaq = async (formData) => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl('add-faq.php'), {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Network response was not ok.');
            }

            const result = await res.json();
            if (result.success) {
                toast.success(result.message);
                fetchFaqs();
                closeModal();
                setEditingFaqId(null); // Exit edit mode
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
        formData.append('question', newFaq.question);
        formData.append('answer', newFaq.answer);
        manageFaq(formData);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('action', 'edit');
        formData.append('id', editingFaqId);
        formData.append('question', editingFaqData.question);
        formData.append('answer', editingFaqData.answer);
        manageFaq(formData);
    };

    const fetchFaqs = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl('get-faq.php'));
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await res.json();

            if (data.success) {
                setFaqs(data.faq);
            } else {
                setFaqs([]);
            }
        } catch (err) {
            toast.error('Failed to fetch FAQs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    return (
        <div className="newsletter-page-container">
            <Sidebar />
            <div className="main-content">
                <ToastContainer />
                <div className="table-header">
                    <h2 className="table-title">FAQs</h2>
                    <button onClick={openModal} className="add-news-btn">
                        <FaPlus className="icon" /> Add FAQ
                    </button>
                </div>

                {loading && <div className="loading">Loading...</div>}

                {!loading && faqs.length === 0 && (
                    <div className="no-data-message">No FAQs found.</div>
                )}

                {!loading && faqs.length > 0 && (
                    <div className="table-wrapper">
                        <table className="newsletter-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Question</th>
                                    <th>Created At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {faqs.map((faq) => (
                                    <React.Fragment key={faq.id}>
                                        {editingFaqId === faq.id ? (
                                            <tr className="edit-row">
                                                <td>{faq.id}</td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="question"
                                                        value={editingFaqData.question}
                                                        onChange={handleEditChange}
                                                    />
                                                </td>
                                                <td>{faq.created_at}</td>
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
                                            <tr className="summary-row">
                                                <td>{faq.id}</td>
                                                <td>{faq.question}</td>
                                                <td>{faq.created_at}</td>
                                                <td className="action-buttons">
                                                    <button onClick={() => toggleExpand(faq.id)} className="expand-btn">
                                                        {expandedId === faq.id ? 'Hide Answer' : 'View Answer'}
                                                    </button>
                                                    <button onClick={() => handleEditClick(faq)} className="edit-btn">
                                                        <FaEdit /> Edit
                                                    </button>
                                                    <button onClick={() => handleDeleteClick(faq.id)} className="delete-btn">
                                                        <FaTrash /> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        )}
                                        {editingFaqId === faq.id && (
                                            <tr className="details-row">
                                                <td colSpan="4">
                                                    <div className="details-box">
                                                        <ReactQuill
                                                            theme="snow"
                                                            value={editingFaqData.answer}
                                                            onChange={handleEditQuillChange}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                        {expandedId === faq.id && (
                                            <tr className="details-row">
                                                <td colSpan="4">
                                                    <div className="details-box">
                                                        <div
                                                            className="newsletter-description-html"
                                                            dangerouslySetInnerHTML={{ __html: faq.answer }}
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

            {/* Modal for adding a new FAQ */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Add New FAQ</h3>
                            <button className="close-btn" onClick={closeModal}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="add-news-form">
                            <div className="form-group">
                                <label htmlFor="question">Question</label>
                                <input
                                    type="text"
                                    id="question"
                                    name="question"
                                    value={newFaq.question}
                                    onChange={handleQuestionChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Answer</label>
                                <ReactQuill
                                    theme="snow"
                                    value={newFaq.answer}
                                    onChange={handleAnswerChange}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="submit-btn">Add FAQ</button>
                                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Modal for delete confirmation */}
            {deletingFaqId && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Confirm Deletion</h3>
                            <button className="close-btn" onClick={handleCancelDelete}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this FAQ? This action cannot be undone.</p>
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