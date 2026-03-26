import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  User, 
  LogOut, 
  ShieldCheck, 
  Users, 
  BarChart3, 
  Bell,
  ClipboardList,
  Check,
  CheckCheck
} from 'lucide-react';
import axios from 'axios';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    try {
      const res = await axios.get('http://localhost:10000/api/notifications/unread/count', {
        headers: { 'Authorization': `Bearer ${storedUser?.token}` }
      });
      setUnreadCount(res.data);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const fetchNotifications = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    try {
      const res = await axios.get('http://localhost:10000/api/notifications', {
        headers: { 'Authorization': `Bearer ${storedUser?.token}` }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const handleToggleNotifications = () => {
    if (!showNotifications) {
      fetchNotifications();
    }
    setShowNotifications(!showNotifications);
  };

  const markAsRead = async (id) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    try {
      await axios.put(`http://localhost:10000/api/notifications/${id}/read`, {}, {
        headers: { 'Authorization': `Bearer ${storedUser?.token}` }
      });
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    try {
      await axios.put('http://localhost:10000/api/notifications/read-all', {}, {
        headers: { 'Authorization': `Bearer ${storedUser?.token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { title: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { title: 'Submit Complaint', path: '/submit', icon: <PlusCircle size={20} /> },
    { title: 'My History', path: '/history', icon: <History size={20} /> },
    { title: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  const adminLinks = [
    { title: 'Admin Overview', path: '/', icon: <ShieldCheck size={20} /> },
    { title: 'Manage Complaints', path: '/manage', icon: <ClipboardList size={20} /> },
    { title: 'User Management', path: '/users', icon: <Users size={20} /> },
    { title: 'Reports', path: '/reports', icon: <BarChart3 size={20} /> },
  ];

  const staffLinks = [
    { title: 'Staff Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { title: 'Assigned Complaints', path: '/assigned', icon: <ClipboardList size={20} /> },
    { title: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : user?.role === 'STAFF' ? staffLinks : studentLinks;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="glass-card" style={{ width: '280px', borderRadius: '0', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--primary)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck color="white" size={20} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>S.C.M.S.</span>
        </div>

        <nav style={{ flex: 1, padding: '0 15px' }}>
          {links.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 15px',
                borderRadius: '8px',
                color: location.pathname === link.path ? 'white' : 'var(--text-muted)',
                backgroundColor: location.pathname === link.path ? 'rgba(79, 70, 229, 0.15)' : 'transparent',
                textDecoration: 'none',
                marginBottom: '5px',
                transition: 'all 0.2s ease',
                fontWeight: location.pathname === link.path ? '600' : '400'
              }}
            >
              {link.icon}
              {link.title}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', padding: '0 10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '2px' }}>{user?.name}</p>
              <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              padding: '10px', 
              borderRadius: '8px', 
              border: 'none', 
              background: 'transparent', 
              color: 'var(--danger)', 
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-dark)' }}>
        <header style={{ height: '70px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 30px', position: 'relative' }}>
          <button 
            onClick={handleToggleNotifications}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', position: 'relative', padding: '8px' }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '5px', right: '5px', width: '16px', height: '16px', background: 'var(--danger)', borderRadius: '50%', color: 'white', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="glass-card" style={{ 
              position: 'absolute', 
              top: '70px', 
              right: '30px', 
              width: '350px', 
              maxHeight: '450px', 
              zIndex: 1000, 
              padding: '0',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <CheckCheck size={14} /> Mark all as read
                  </button>
                )}
              </div>
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Bell size={32} style={{ opacity: 0.2, marginBottom: '10px' }} />
                    <p style={{ fontSize: '0.875rem' }}>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      style={{ 
                        padding: '15px 20px', 
                        borderBottom: '1px solid rgba(255,255,255,0.03)', 
                        background: n.read ? 'transparent' : 'rgba(79, 70, 229, 0.05)',
                        display: 'flex',
                        gap: '12px'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.875rem', marginBottom: '4px', color: n.read ? 'var(--text-muted)' : 'white' }}>{n.message}</p>
                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                      {!n.read && (
                        <button 
                          onClick={() => markAsRead(n.id)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', height: 'fit-content' }}
                          title="Mark as read"
                        >
                          <Check size={16} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div style={{ padding: '10px', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
                <button 
                  onClick={() => setShowNotifications(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </header>

        <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
