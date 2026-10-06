import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { apiGet, apiPost, apiPatch } from '../api';
import type { Volunteer } from '../types';
import Spinner from '../components/Spinner';
import ErrorBox from '../components/ErrorBox';

export default function VolunteerPage() {
  const { t } = useI18n();
  const username = localStorage.getItem('username') || '';
  
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [myProfile, setMyProfile] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (myProfile) {
      setFullName(myProfile.full_name);
      setPhone(myProfile.phone || '');
      setSkills(myProfile.skills.join(', '));
    }
  }, [myProfile]);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const data: Volunteer[] = await apiGet('/community/volunteers');
      setVolunteers(data);
      const me = data.find(v => v.user_id === username);
      setMyProfile(me || null);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      await apiPost(`/community/volunteers?user_id=${username}`, {
        full_name: fullName,
        phone,
        skills: skillsArray,
        latitude: null,
        longitude: null,
      });
      setIsEditing(false);
      fetchVolunteers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleAvailability = async () => {
    if (!myProfile) return;
    try {
      await apiPatch(`/community/volunteers/${myProfile.id}/availability`, {
        is_available: !myProfile.is_available
      });
      fetchVolunteers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} />;

  return (
    <div className="volunteer-page page-container">
      <h1>{t('volunteer.title')}</h1>

      {!myProfile || isEditing ? (
        <form className="card form-card" onSubmit={handleRegister}>
          <h3>{myProfile ? "Edit Profile" : t('volunteer.register')}</h3>
          <div className="form-group">
            <label>{t('volunteer.full_name')}</label>
            <input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>{t('volunteer.phone')}</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="form-group">
            <label>{t('volunteer.skills')}</label>
            <input type="text" value={skills} onChange={e => setSkills(e.target.value)} placeholder="First Aid, Driving, etc." />
          </div>
          <div className="form-actions" style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn btn-primary">{t('common.save')}</button>
            {myProfile && (
              <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>
                {t('common.cancel')}
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="card my-profile-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>{t('volunteer.your_profile')}</h3>
            <button className="btn btn-sm btn-outline" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </div>
          <p><strong>{myProfile.full_name}</strong> ({myProfile.phone})</p>
          <div className="tags">
            {myProfile.skills.map((s, i) => <span key={i} className="badge">{s}</span>)}
          </div>
          <div className="availability-toggle mt-4">
            Status: <span className={`badge ${myProfile.is_available ? 'badge-low' : 'badge-critical'}`}>
              {myProfile.is_available ? t('volunteer.available') : t('volunteer.unavailable')}
            </span>
            <button className="btn btn-sm btn-outline ml-2" onClick={toggleAvailability}>
              {t('volunteer.toggle_availability')}
            </button>
          </div>
        </div>
      )}

      <h3 className="mt-5">{t('volunteer.registered_volunteers')}</h3>
      <div className="volunteer-list grid-list">
        {volunteers.length === 0 ? <p>{t('volunteer.no_volunteers')}</p> : volunteers.map(v => (
          <div key={v.id} className="card list-item">
            <h4>{v.full_name} <small>({v.user_id})</small></h4>
            <div className="tags mt-2 mb-2">
              {v.skills.map((s, i) => <span key={i} className="badge badge-outline">{s}</span>)}
            </div>
            <span className={`badge ${v.is_available ? 'badge-low' : 'badge-critical'}`}>
              {v.is_available ? t('volunteer.available') : t('volunteer.unavailable')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
