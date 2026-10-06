import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { apiGet, apiPost } from '../api';
import type { DamageReport, RecoveryScheme } from '../types';
import { useGeoLocation } from '../hooks/useGeoLocation';
import Spinner from '../components/Spinner';
import ErrorBox from '../components/ErrorBox';

export default function RecoveryPage() {
  const { t } = useI18n();
  const username = localStorage.getItem('username') || '';
  
  const [activeTab, setActiveTab] = useState<'report' | 'schemes'>('report');
  
  const [reports, setReports] = useState<DamageReport[]>([]);
  const [schemes, setSchemes] = useState<RecoveryScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const { latitude, longitude, loading: geoLoading, error: geoError, getLocation } = useGeoLocation();
  const [category, setCategory] = useState('building');
  const [severity, setSeverity] = useState('moderate');
  const [description, setDescription] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<number | ''>('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reps, sch] = await Promise.all([
        apiGet(`/recovery/damage-reports?user_id=${username}`),
        apiGet('/recovery/schemes')
      ]);
      setReports(reps);
      setSchemes(sch);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiPost(`/recovery/damage-reports?user_id=${username}`, {
        latitude,
        longitude,
        category,
        severity,
        description,
        estimated_cost: estimatedCost === '' ? null : Number(estimatedCost)
      });
      setDescription('');
      setEstimatedCost('');
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} />;

  return (
    <div className="recovery-page page-container">
      <h1>{t('recovery.title')}</h1>

      <div className="tabs">
        <button className={`tab ${activeTab === 'report' ? 'active' : ''}`} onClick={() => setActiveTab('report')}>
          {t('recovery.report_damage')}
        </button>
        <button className={`tab ${activeTab === 'schemes' ? 'active' : ''}`} onClick={() => setActiveTab('schemes')}>
          {t('recovery.schemes')}
        </button>
      </div>

      {activeTab === 'report' && (
        <div className="tab-content">
          <form className="card form-card" onSubmit={handleSubmit}>
            <h3>{t('recovery.report_damage')}</h3>
            <div className="form-group">
              <button type="button" className="btn btn-outline" onClick={getLocation}>
                📍 {latitude ? t('common.location_captured') : 'Capture Location'}
              </button>
              {geoLoading && <span>{t('common.loading')}</span>}
              {geoError && <span className="error">{geoError}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('recovery.category')}</label>
                <select value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="building">{t('recovery.building')}</option>
                  <option value="road">{t('recovery.road')}</option>
                  <option value="bridge">{t('recovery.bridge')}</option>
                  <option value="infrastructure">{t('recovery.infrastructure')}</option>
                  <option value="other">{t('community.other')}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t('recovery.severity')}</label>
                <select value={severity} onChange={e => setSeverity(e.target.value)}>
                  <option value="minor">{t('recovery.minor')}</option>
                  <option value="moderate">{t('recovery.moderate')}</option>
                  <option value="severe">{t('recovery.severe')}</option>
                  <option value="destroyed">{t('recovery.destroyed')}</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>{t('recovery.description')}</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t('recovery.estimated_cost')}</label>
              <input type="number" value={estimatedCost} onChange={e => setEstimatedCost(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">{t('recovery.submit_report')}</button>
            </div>
          </form>

          <h3 className="mt-5">{t('recovery.your_reports')}</h3>
          <div className="report-list">
            {reports.length === 0 ? <p>{t('recovery.no_reports')}</p> : reports.map(r => (
              <div key={r.id} className="card list-item">
                <div className="flex-between">
                  <h4>{t(`recovery.${r.category}`)}</h4>
                  <span className={`badge badge-${r.severity === 'minor' ? 'low' : r.severity === 'moderate' ? 'medium' : 'critical'}`}>
                    {t(`recovery.${r.severity}`)}
                  </span>
                </div>
                <p>{r.description}</p>
                <div className="flex-between mt-2">
                  <small>{r.created_at}</small>
                  <span>{r.estimated_cost ? `₹${r.estimated_cost}` : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'schemes' && (
        <div className="tab-content scheme-list grid-list">
          {schemes.length === 0 ? <p>{t('recovery.no_schemes')}</p> : schemes.map(s => (
            <div key={s.id} className="card scheme-card">
              <h3>{s.name}</h3>
              <p>{s.description}</p>
              {s.hazard_type && <span className="badge badge-outline">{s.hazard_type}</span>}
              <ul className="mt-3">
                <li><strong>{t('recovery.eligibility')}:</strong> {s.eligibility}</li>
                <li><strong>{t('recovery.authority')}:</strong> {s.authority}</li>
                {s.max_compensation && <li><strong>{t('recovery.max_compensation')}:</strong> ₹{s.max_compensation}</li>}
              </ul>
              {s.link && (
                <a href={s.link} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm mt-3">
                  {t('recovery.apply')}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
