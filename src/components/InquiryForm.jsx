import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import "./design/InquiryForm.css";
import { getApiUrl } from "../utils/api";

const InquiryForm = ({ submitUrl, showModal, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    stateId: "",
    cityId: "",
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const location = useLocation();
  const [serviceType, setServiceType] = useState("");

  // Detect service type based on page
  useEffect(() => {
    if (location.pathname.includes("consulting")) {
      setServiceType("Consulting");
    } else if (location.pathname.includes("franchise")) {
      setServiceType("Franchise Expansion");
    } else {
      setServiceType("General Inquiry");
    }
  }, [location]);

  // Load states
  useEffect(() => {
    const loadStates = async () => {
      try {
        const res = await fetch(getApiUrl("get-indian-states.php"));
        const data = await res.json();
        setStates(data ?? []);
      } catch (e) {
        console.error("States API error:", e);
        toast.error("Failed to load states");
      }
    };
    loadStates();
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (!form.stateId) return setCities([]);
    const loadCities = async () => {
      try {
        const res = await fetch(
          getApiUrl(`get-cities.php?state_id=${form.stateId}`)
        );
        const data = await res.json();
        setCities(data ?? []);
      } catch (e) {
        console.error("Cities API error:", e);
        toast.error("Failed to load cities");
      }
    };
    loadCities();
  }, [form.stateId]);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "name" && !/^[A-Za-z\s]*$/.test(value)) return;
    if (name === "contact" && value && !/^[6-9]\d{0,9}$/.test(value)) return;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onStateChange = (e) => {
    setForm((f) => ({
      ...f,
      stateId: Number(e.target.value) || "",
      cityId: "",
    }));
    setCities([]);
  };

  const onCityChange = (e) => {
    setForm((f) => ({ ...f, cityId: Number(e.target.value) || "" }));
  };

  const validate = () => {
    let isValid = true;
    if (!form.name || !/^[A-Za-z\s]+$/.test(form.name)) {
      toast.error("Name is required (letters & spaces only).");
      isValid = false;
    }
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("Valid email is required.");
      isValid = false;
    }
    if (!form.contact || !/^[6-9]\d{9}$/.test(form.contact)) {
      toast.error("Contact must start with 6–9 and be 10 digits.");
      isValid = false;
    }
    if (!form.stateId) {
      toast.error("State is required.");
      isValid = false;
    }
    if (!form.cityId) {
      toast.error("City is required.");
      isValid = false;
    }
    return isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const submitData = {
      name: form.name,
      email: form.email,
      contact: form.contact,
      stateId: form.stateId,
      cityId: form.cityId,
      service_type: serviceType,
    };

    console.log("Submitting form data:", submitData);

    try {
      const res = await fetch(getApiUrl("submit-service-inquiry.php"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const result = await res.json();
      console.log("API response:", result);

      if (result.success) {
        toast.success("Inquiry submitted ✅", { autoClose: 5000 });
        setForm({ name: "", email: "", contact: "", stateId: "", cityId: "" });
        setCities([]);
        if (onClose) onClose();
      } else {
        toast.error(result.message || "Something went wrong ❌", {
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Error submitting form ❌", { autoClose: 5000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{serviceType} Inquiry Form</h2>
      <form onSubmit={onSubmit} noValidate>
        <label>Name*</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={onChange}
          required
        />

        <label>Email*</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          required
        />

        <label>Contact Number*</label>
        <input
          type="tel"
          name="contact"
          value={form.contact}
          onChange={onChange}
          maxLength={10}
          required
        />

        <label>State*</label>
        <select
          name="stateId"
          value={form.stateId}
          onChange={onStateChange}
          required
        >
          <option value="">-- Select State --</option>
          {states.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <label>City*</label>
        <select
          name="cityId"
          value={form.cityId}
          onChange={onCityChange}
          required
          disabled={!form.stateId}
        >
          <option value="">-- Select City --</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      <ToastContainer position="top-right" newestOnTop />
    </div>
  );
};

export default InquiryForm;
