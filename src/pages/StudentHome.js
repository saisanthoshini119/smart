import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  MessageCircle,
  Send,
  X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BASE_URL from '../api';

const StudentHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    inProgress: 0
  });
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      try {
        const res = await axios.get(`${BASE_URL}/complaints`, {
          headers: {
            'Authorization': `Bearer ${storedUser?.token}`
          }
        });
        setComplaints(res.data);
        const s = { total: res.data.length, pending: 0, resolved: 0, inProgress: 0 };
        res.data.forEach(c => {
          if (c.status === 'PENDING') s.pending++;
          else if (c.status === 'RESOLVED') s.resolved++;
          else if (c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED') s.inProgress++;
        });
        setStats(s);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComplaints();
  }, []);

  const sendChatMessage = async () => {
    const text = (chatInput || '').trim();
    if (!text || chatLoading) return;
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userMsg = { role: 'user', content: text };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/chat`,
        { messages: newMessages },
        { headers: { 'Authorization': `Bearer ${storedUser?.token}` } }
      );
      setChatMessages(prev => [...prev, { role: 'assistant', content: res.data.reply || 'No response.' }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Failed to get a response. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, color }) => (
    <div className="glass-card" style={{ padding: '24px', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ padding: '12px', background: `rgba(${color}, 0.1)`, borderRadius: '12px', color: `rgb(${color})` }}>
          {icon}
        </div>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>{title}</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '4px' }}>{value}</h3>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '8px' }}>Hello, {user?.name}!</h1>
        <p style={{ color: 'var(--text-muted)' }}>Welcome to your complaint dashboard.</p>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
        <StatCard icon={<FileText size={24} />} title="Total Submitted" value={stats.total} color="79, 70, 229" />
        <StatCard icon={<Clock size={24} />} title="Pending Approval" value={stats.pending} color="245, 158, 11" />
        <StatCard icon={<TrendingUp size={24} />} title="In Progress" value={stats.inProgress} color="16, 185, 129" />
        <StatCard icon={<CheckCircle2 size={24} />} title="Resolved" value={stats.resolved} color="16, 185, 129" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        {/* Recent Complaints */}
        <div className="glass-card" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Recent Complaints</h2>
            <Link to="/history" style={{ color: 'var(--primary)', fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {complaints.slice(0, 5).map(c => (
              <div key={c.id} style={{ padding: '15px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{c.title}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {c.complaintId} • {c.category}</p>
                </div>
                <div style={{ 
                  padding: '6px 12px', 
                  borderRadius: '999px', 
                  fontSize: '0.75rem', 
                  fontWeight: '600',
                  background: c.status === 'PENDING' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  color: c.status === 'PENDING' ? 'var(--warning)' : 'var(--success)'
                }}>
                  {c.status}
                </div>
              </div>
            ))}
            {complaints.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                <AlertCircle size={40} style={{ marginBottom: '15px', opacity: 0.5 }} />
                <p>No complaints submitted yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '30px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', border: 'none' }}>
            <h3 style={{ color: 'white', marginBottom: '10px' }}>Need assistance?</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', marginBottom: '20px' }}>Submit a new complaint and our team will get back to you soon.</p>
            <button 
              onClick={() => navigate('/submit')}
              className="btn" 
              style={{ background: 'white', color: 'var(--primary)', width: '100%' }}
            >
              New Complaint
            </button>
          </div>

          <div className="glass-card" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '15px' }}>Notifications</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '20px 0' }}>All caught up!</p>
          </div>
        </div>
      </div>

      {/* FAQ / Triage Chat widget - student dashboard */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 50 }}>
        {chatOpen ? (
          <div className="glass-card" style={{ width: '360px', maxWidth: 'calc(100vw - 48px)', height: '420px', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '600', fontSize: '1rem' }}>FAQ & Help</span>
              <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }} aria-label="Close"><X size={20} /></button>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {chatMessages.length === 0 && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Ask how to submit a complaint, check status, or about categories.</p>
              )}
              {chatMessages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', padding: '10px 14px', borderRadius: '12px', background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.06)', fontSize: '0.9rem' }}>
                  {m.content}
                </div>
              ))}
              {chatLoading && <div style={{ alignSelf: 'flex-start', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', fontSize: '0.9rem' }}>...</div>}
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Ask a question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                style={{ flex: 1, padding: '10px 14px' }}
              />
              <button type="button" onClick={sendChatMessage} disabled={chatLoading} className="btn btn-primary" style={{ padding: '10px 14px' }}><Send size={18} /></button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setChatOpen(true)}
            className="btn btn-primary"
            style={{ width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(79, 70, 229, 0.4)' }}
            aria-label="Open FAQ chat"
          >
            <MessageCircle size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentHome;
