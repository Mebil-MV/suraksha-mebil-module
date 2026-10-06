import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { useGeoLocation } from '../hooks/useGeoLocation';
import { apiGet, apiPost } from '../api';
import type { SafeCheck, HelpRequest, PriorityItem, Volunteer } from '../types';
import { apiPatch } from '../api';
import Spinner from '../components/Spinner';
import ErrorBox from '../components/ErrorBox';

export default function CommunityPage() {
  const { t } = useI18n();
  const username = localStorage.getItem('username') || '';
  
  const [activeTab, setActiveTab] = useState<'safe' | 'help' | null>(null);
  
  // Safe Check form state
  const { latitude, longitude, loading: geoLoading, error: geoError, getLocation } = useGeoLocation();
  const [safeMessage, setSafeMessage] = useState('');
  
  // Help Request form state
  const [requestType, setRequestType] = useState('medical');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('high');
  
  // Data state
  const [safeChecks, setSafeChecks] = useState<SafeCheck[]>([]);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [priorities, setPriorities] = useState<PriorityItem[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sc, hr, p, vols] = await Promise.all([
        apiGet('/community/safe-checks?limit=20'),
        apiGet('/community/help-requests?status=open'),
        apiGet('/community/decision-support/priorities'),
        apiGet('/community/volunteers?available_only=true')
      ]);
      setSafeChecks(sc);
      setHelpRequests(hr);
      setPriorities(p);
      setVolunteers(vols);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSafeCheckSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiPost(`/community/safe-checks?user_id=${username}`, {
        latitude,
        longitude,
        message: safeMessage
      });
      setActiveTab(null);
      setSafeMessage('');
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleHelpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiPost(`/community/help-requests?user_id=${username}`, {
        latitude,
        longitude,
        request_type: requestType,
        description,
        urgency
      });
      setActiveTab(null);
      setDescription('');
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAssign = async (requestId: number, volunteerId: string) => {
    if (!volunteerId) return;
    try {
      await apiPatch(`/community/help-requests/${requestId}/assign`, {
        volunteer_id: parseInt(volunteerId)
      });
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleResolve = async (requestId: number) => {
    try {
      await apiPatch(`/community/help-requests/${requestId}/status`, {
        status: 'resolved'
      });
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEscalate = async (requestId: number) => {
    try {
      await apiPatch(`/community/help-requests/${requestId}/escalate`, {});
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} />;

  return (
    <div className="community-page page-container">
      <h1>{t('community.title')}</h1>
      
      <div className="action-cards">
        <div className="card action-card" onClick={() => setActiveTab('safe')}>
          <h2>✅ {t('community.im_safe')}</h2>
          <p>{t('community.im_safe_desc')}</p>
        </div>
        <div className="card action-card danger" onClick={() => setActiveTab('help')}>
          <h2>🆘 {t('community.need_help')}</h2>
          <p>{t('community.need_help_desc')}</p>
        </div>
      </div>

      {activeTab === 'safe' && (
        <form className="card form-card" onSubmit={handleSafeCheckSubmit}>
          <h3>{t('community.mark_safe')}</h3>
          <div className="form-group">
            <button type="button" className="btn btn-outline" onClick={getLocation}>
              📍 {latitude ? t('common.location_captured') : 'Capture Location'}
            </button>
            {geoLoading && <span>{t('common.loading')}</span>}
            {geoError && <span className="error">{geoError}</span>}
          </div>
          <div className="form-group">
            <label>{t('community.message')}</label>
            <input 
              type="text" 
              value={safeMessage} 
              onChange={e => setSafeMessage(e.target.value)} 
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setActiveTab(null)}>{t('common.cancel')}</button>
            <button type="submit" className="btn btn-primary">{t('common.save')}</button>
          </div>
        </form>
      )}

      {activeTab === 'help' && (
        <form className="card form-card" onSubmit={handleHelpSubmit}>
          <h3>{t('community.need_help')}</h3>
          <div className="form-group">
            <button type="button" className="btn btn-outline" onClick={getLocation}>
              📍 {latitude ? t('common.location_captured') : 'Capture Location'}
            </button>
            {geoLoading && <span>{t('common.loading')}</span>}
            {geoError && <span className="error">{geoError}</span>}
          </div>
          <div className="form-group">
            <label>{t('community.request_type')}</label>
            <select value={requestType} onChange={e => setRequestType(e.target.value)}>
              <option value="medical">{t('community.medical')}</option>
              <option value="rescue">{t('community.rescue')}</option>
              <option value="shelter">{t('community.shelter')}</option>
              <option value="food_water">{t('community.food_water')}</option>
              <option value="other">{t('community.other')}</option>
            </select>
          </div>
          <div className="form-group">
            <label>{t('community.urgency')}</label>
            <div className="radio-group">
              {['low', 'medium', 'high', 'critical'].map(lvl => (
                <label key={lvl}>
                  <input type="radio" name="urgency" value={lvl} checked={urgency === lvl} onChange={e => setUrgency(e.target.value)} />
                  {t(`community.${lvl}`)}
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>{t('community.message')}</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setActiveTab(null)}>{t('common.cancel')}</button>
            <button type="submit" className="btn btn-danger">{t('community.submit')}</button>
          </div>
        </form>
      )}

      <div className="dashboard-grid">
        <div className="col">
          <h3>{t('community.recent_safe')}</h3>
          {safeChecks.length === 0 ? <p>{t('community.no_safe_checks')}</p> : safeChecks.map(sc => (
            <div key={sc.id} className="list-item">
              <strong>{sc.user_id}</strong>
              {sc.message && <p>{sc.message}</p>}
              <small>{sc.created_at}</small>
            </div>
          ))}
        </div>
        <div className="col">
          <h3>{t('community.active_help')}</h3>
          {helpRequests.length === 0 ? <p>{t('community.no_help_requests')}</p> : helpRequests.map(hr => (
            <div key={hr.id} className="list-item warning" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="flex-between">
                <strong>{t(`community.${hr.request_type}`)}</strong>
                <span className={`badge badge-${hr.urgency}`}>{t(`community.${hr.urgency}`)}</span>
              </div>
              <p style={{ margin: 0 }}>{hr.description}</p>
              <div className="flex-between" style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                <span>{hr.user_id} • {hr.status}</span>
                {hr.assigned_volunteer_id ? (
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>Assigned to Vol #{hr.assigned_volunteer_id}</span>
                ) : (
                  <select 
                    title={t('community.assign_volunteer')}
                    onChange={(e) => handleAssign(hr.id, e.target.value)}
                    style={{ padding: '0.2rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="">{t('community.assign_volunteer')}...</option>
                    {volunteers.map(v => (
                      <option key={v.id} value={v.id}>{v.full_name} ({v.skills.join(', ')})</option>
                    ))}
                  </select>
                )}
              </div>
              {hr.user_id === username && hr.status !== 'resolved' && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button onClick={() => handleResolve(hr.id)} className="btn btn-sm btn-outline" style={{ borderColor: '#10b981', color: '#10b981', flex: 1 }}>
                    ✅ {t('community.im_okay')}
                  </button>
                  <button onClick={() => handleEscalate(hr.id)} className="btn btn-sm btn-danger" style={{ flex: 1 }}>
                    🚨 {t('community.still_in_danger')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {priorities.length > 0 && (
        <div className="dashboard-section mt-4">
          <h3>{t('community.priority_dashboard')}</h3>
          <div className="priority-list">
            {priorities.map(p => (
              <div key={p.help_request_id} className="list-item card" style={{ position: 'relative' }}>
                <div className="flex-between">
                  <h4>Req #{p.help_request_id} - {t('community.priority_score')}: {p.priority_score.toFixed(1)}</h4>
                  <div className="tooltip-container">
                    <span className="badge badge-outline">ℹ️ Why?</span>
                    <div className="tooltip-content" style={{ fontSize: '0.8rem', marginTop: '4px', color: '#475569' }}>
                      <strong>Factors:</strong>
                      <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                        {Object.entries(p.factors).map(([key, val]) => (
                          <li key={key}>{key}: {val}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <p style={{ marginTop: '0.5rem' }}>{p.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
