import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { apiGet, apiPost } from '../api';
import type { SafetyTip, MicroChallenge, ReadinessOverview } from '../types';
import Spinner from '../components/Spinner';
import SpeechButton from '../components/SpeechButton';
import ErrorBox from '../components/ErrorBox';

export default function PreparednessPage() {
  const { t, lang } = useI18n();
  const username = localStorage.getItem('username') || '';
  
  const [activeTab, setActiveTab] = useState<'awareness' | 'tips' | 'challenges' | 'readiness'>('awareness');
  
  const [tips, setTips] = useState<SafetyTip[]>([]);
  const [challenges, setChallenges] = useState<MicroChallenge[]>([]);
  const [overview, setOverview] = useState<ReadinessOverview | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters for tips
  const [hazardFilter, setHazardFilter] = useState('all');
  const [phaseFilter, setPhaseFilter] = useState('before');

  useEffect(() => {
    fetchData();
  }, [hazardFilter, phaseFilter, username]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const hQuery = hazardFilter === 'all' ? '' : `hazard_type=${hazardFilter}&`;
      const pQuery = `phase=${phaseFilter}`;
      
      const [tData, cData, oData] = await Promise.all([
        apiGet(`/preparedness-content/safety-tips?${hQuery}${pQuery}`),
        apiGet(`/preparedness-content/micro-challenges?user_id=${username}`),
        apiGet(`/preparedness-content/readiness-overview/${username}`)
      ]);
      
      setTips(tData);
      setChallenges(cData);
      setOverview(oData);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteChallenge = async (id: number) => {
    try {
      await apiPost(`/preparedness-content/micro-challenges/${id}/complete?user_id=${username}`);
      fetchData(); // refresh
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading && tips.length === 0) return <Spinner />;
  if (error) return <ErrorBox message={error} />;

  return (
    <div className="preparedness-page page-container">
      <h1>{t('preparedness.title')}</h1>

      <div className="tabs">
        <button className={`tab ${activeTab === 'awareness' ? 'active' : ''}`} onClick={() => setActiveTab('awareness')}>
          {lang === 'hi' ? 'जागरूकता एनीमेशन' : 'Awareness Animation'}
        </button>
        <button className={`tab ${activeTab === 'tips' ? 'active' : ''}`} onClick={() => setActiveTab('tips')}>
          {t('preparedness.safety_tips')}
        </button>
        <button className={`tab ${activeTab === 'challenges' ? 'active' : ''}`} onClick={() => setActiveTab('challenges')}>
          {t('preparedness.micro_challenges')}
        </button>
        <button className={`tab ${activeTab === 'readiness' ? 'active' : ''}`} onClick={() => setActiveTab('readiness')}>
          {t('preparedness.readiness_overview')}
        </button>
      </div>

      {activeTab === 'awareness' && (
        <div className="tab-content awareness-content">
          <div className="card text-center mb-4" style={{ padding: '0' }}>
            <h2 style={{ padding: '1rem' }}>{lang === 'hi' ? 'बंद नाले से बाढ़ जागरूकता' : 'Clogged Drain Flood Awareness'}</h2>
            <iframe 
              src="/drain-flood.html" 
              style={{ width: '100%', height: '70vh', border: 'none', borderRadius: '0 0 10px 10px', backgroundColor: '#0f1a2e' }}
              title="Clogged Drain Flood Animation"
            />
          </div>
          
          <div className="card text-center mb-4" style={{ padding: '0' }}>
            <h2 style={{ padding: '1rem' }}>{lang === 'hi' ? 'झील के ओवरफ्लो से बाढ़ जागरूकता' : 'Lake Overflow Flood Awareness'}</h2>
            <iframe 
              src="/lake-flood.html" 
              style={{ width: '100%', height: '70vh', border: 'none', borderRadius: '0 0 10px 10px', backgroundColor: '#0f1a2e' }}
              title="Lake Overflow Flood Animation"
            />
          </div>
          <div className="card text-center mb-4" style={{ padding: '0' }}>
            <h2 style={{ padding: '1rem' }}>{lang === 'hi' ? 'वनों की कटाई से भूस्खलन जागरूकता' : 'Deforestation Landslide Awareness'}</h2>
            <iframe 
              src="/landslide.html" 
              style={{ width: '100%', height: '70vh', border: 'none', borderRadius: '0 0 10px 10px', backgroundColor: '#1a1f18' }}
              title="Deforestation Landslide Animation"
            />
          </div>
        </div>
      )}

      {activeTab === 'tips' && (
        <div className="tab-content tips-content">
          <div className="filters mb-4">
            <div className="button-group mb-2">
              {['all', 'landslide', 'flood', 'earthquake'].map(h => (
                <button key={h} className={`btn btn-sm ${hazardFilter === h ? 'btn-primary' : 'btn-outline'}`} onClick={() => setHazardFilter(h)}>
                  {t(`preparedness.${h === 'all' ? 'all_hazards' : h}`)}
                </button>
              ))}
            </div>
            <div className="button-group">
              {['before', 'during', 'after'].map(p => (
                <button key={p} className={`btn btn-sm ${phaseFilter === p ? 'btn-primary' : 'btn-outline'}`} onClick={() => setPhaseFilter(p)}>
                  {t(`preparedness.${p}`)}
                </button>
              ))}
            </div>
          </div>
          <div className="tips-grid grid-list">
            {tips.length === 0 ? <p>No tips found.</p> : tips.map(tip => (
              <div key={tip.id} className="card tip-card">
                <h3>{tip.icon} {tip.title} <SpeechButton text={lang === 'hi' && tip.content_hi ? tip.content_hi : tip.content} lang={lang === 'hi' ? 'hi-IN' : 'en-US'} /></h3>
                <p>{lang === 'hi' && tip.content_hi ? tip.content_hi : tip.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'challenges' && (
        <div className="tab-content challenges-content grid-list">
          {challenges.map(c => (
            <div key={c.id} className={`card challenge-card ${c.is_completed ? 'completed' : ''}`}>
              <h3>{c.icon} {lang === 'hi' && c.title_hi ? c.title_hi : c.title} <SpeechButton text={lang === 'hi' && c.description_hi ? c.description_hi : c.description} lang={lang === 'hi' ? 'hi-IN' : 'en-US'} /></h3>
              <p>{lang === 'hi' && c.description_hi ? c.description_hi : c.description}</p>
              <div className="flex-between mt-3">
                <span className="badge badge-low">+{c.points} {t('preparedness.points')}</span>
                {c.is_completed ? (
                  <span className="success-text">{t('preparedness.completed')}</span>
                ) : (
                  <button className="btn btn-sm btn-primary" onClick={() => handleCompleteChallenge(c.id)}>
                    {t('preparedness.complete')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'readiness' && overview && (
        <div className="tab-content readiness-content">
          <div className="card overview-card text-center mb-4">
            <h2>{t('preparedness.level')}: {t(`preparedness.${overview.level}`)}</h2>
            <div className="points-display mt-3">
              <span className="huge-text">{overview.total_points}</span>
              <span>{t('preparedness.points')}</span>
            </div>
            <div className="stats-grid mt-4">
              <div className="stat-box">
                <h4>{overview.quiz_score}</h4>
                <p>Quiz Score</p>
              </div>
              <div className="stat-box">
                <h4>{overview.micro_challenges_completed}</h4>
                <p>Micro-Challenges</p>
              </div>
            </div>
            {overview.badges && overview.badges.length > 0 && (
              <div className="badges mt-4">
                {overview.badges.map((b, i) => <span key={i} className="badge badge-outline m-1">{b}</span>)}
              </div>
            )}
          </div>
          
          <div className="card text-center">
            <h3>{t('preparedness.quiz_challenges')}</h3>
            <p className="mb-3">Test your knowledge with interactive scenarios.</p>
            <Link to="/challenges/1" className="btn btn-primary">{t('preparedness.take_quiz')}</Link>
          </div>
        </div>
      )}
    </div>
  );
}
