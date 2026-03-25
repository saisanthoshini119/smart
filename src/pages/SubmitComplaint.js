import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Send, 
  Tag, 
  AlignLeft, 
  AlertTriangle, 
  Upload, 
  X,
  CheckCircle2
} from 'lucide-react';
import BASE_URL from '../api';

const SubmitComplaint = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Academics',
    description: '',
    priority: 'MEDIUM'
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('priority', formData.priority);
    if (file) {
      data.append('file', file);
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));
    try {
      await axios.post(`${BASE_URL}/complaints`, data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${storedUser?.token}`
        }
      });
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '24px', borderRadius: '50%', marginBottom: '20px' }}>
          <CheckCircle2 size={64} />
        </div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Complaint Submitted!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '8px' }}>Submit a Complaint</h1>
        <p style={{ color: 'var(--text-muted)' }}>Provide details about the issue you're facing.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '40px' }}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500' }}>Complaint Title</label>
          <div style={{ position: 'relative' }}>
            <Tag style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              name="title" 
              className="input-field" 
              style={{ paddingLeft: '40px' }} 
              placeholder="Brief summary of the issue"
              onChange={handleChange}
              required 
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500' }}>Category</label>
            <select name="category" className="input-field" onChange={handleChange}>
              <option value="Academics">Academics</option>
              <option value="Hostel">Hostel</option>
              <option value="Library">Library</option>
              <option value="Transport">Transport</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="IT">IT Support</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500' }}>Priority</label>
            <div style={{ position: 'relative' }}>
              <AlertTriangle style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
              <select name="priority" className="input-field" style={{ paddingLeft: '40px' }} onChange={handleChange}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500' }}>Detailed Description</label>
          <div style={{ position: 'relative' }}>
            <AlignLeft style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} size={18} />
            <textarea 
              name="description" 
              className="input-field" 
              style={{ paddingLeft: '40px', minHeight: '150px', resize: 'vertical' }} 
              placeholder="Explain the issue in detail..."
              onChange={handleChange}
              required 
            ></textarea>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500' }}>Supporting Document/Image</label>
          {!preview ? (
            <label style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '120px', 
              border: '2px dashed rgba(255,255,255,0.1)', 
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: 'rgba(255,255,255,0.02)'
            }} onMouseEnter={(e) => e.target.style.borderColor = 'var(--primary)'} onMouseLeave={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}>
              <Upload size={24} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Click to upload file</span>
              <input type="file" style={{ display: 'none' }} onChange={handleFileChange} accept="image/*,.pdf,.doc,.docx" />
            </label>
          ) : (
            <div style={{ position: 'relative', width: 'fit-content' }}>
              <img src={preview} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
              <button onClick={removeFile} style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--danger)', border: 'none', color: 'white', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button type="button" onClick={() => navigate('/')} className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', flex: 1 }}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} disabled={loading}>
            {loading ? 'Submitting...' : <><Send size={18} /> Submit Complaint</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitComplaint;
