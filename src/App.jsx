import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./App.css";

// Define validation schema with Yup
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .matches(/^[\p{L} ]+$/u, "Name should contain letters only"),
  university: yup.string().required("University is required"),
  college: yup.string().required("College is required"),
  committee: yup
    .string()
    .oneOf(["pr", "smm", "technical", "video", "graphic"], "Invalid committee")
    .required("Committee is required"),
  position: yup
    .string()
    .oneOf(["member", "highboard", "head"], "Invalid position")
    .required("Position is required"),
});

export default function App() {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm({
    mode: "onChange", // Validate on every change
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setMessage("");
    try {
      await axios.post("https://technical-team-02-back.onrender.com/participants", data);
      setMessage("✅ Registered successfully!");
      reset();
    } catch (error) {
      setMessage(
        "❌ Registration failed: " + (error.response?.data?.error || "Unknown error")
      );
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2 className="form-title">Event Registration</h2>
        <p className="form-subtitle">Please fill out the form below</p>

        {message && (
          <div className={`message ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            {...register("name")}
            placeholder="Enter your full name"
            className={errors.name ? "error-input" : ""}
          />
          {errors.name && <p className="error-text">{errors.name.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="university">University</label>
          <input
            id="university"
            {...register("university")}
            placeholder="Your university"
            className={errors.university ? "error-input" : ""}
          />
          {errors.university && <p className="error-text">{errors.university.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="college">College</label>
          <input
            id="college"
            {...register("college")}
            placeholder="Your college"
            className={errors.college ? "error-input" : ""}
          />
          {errors.college && <p className="error-text">{errors.college.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="committee">Committee</label>
          <select
            id="committee"
            {...register("committee")}
            className={errors.committee ? "error-input" : ""}
          >
            <option value="">Select Committee</option>
            <option value="pr">PR</option>
            <option value="smm">Social Media Marketing</option>
            <option value="technical">Technical</option>
            <option value="video">Video Production</option>
            <option value="graphic">Graphic Design</option>
          </select>
          {errors.committee && <p className="error-text">{errors.committee.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="position">Position</label>
          <select
            id="position"
            {...register("position")}
            className={errors.position ? "error-input" : ""}
          >
            <option value="">Select Position</option>
            <option value="member">Member</option>
            <option value="highboard">Highboard</option>
            <option value="head">Head</option>
          </select>
          {errors.position && <p className="error-text">{errors.position.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting || !isValid}>
          {isSubmitting ? (
            <>
              <span className="spinner"></span> Registering...
            </>
          ) : (
            "Register Now"
          )}
        </button>
      </form>
    </div>
  );
}
