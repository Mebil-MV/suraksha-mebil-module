import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";

type Scene = 'intro' | 'waking' | 'decision1' | 'decision2' | 'success' | 'gameover';

export default function FloodGame() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [scene, setScene] = useState<Scene>('intro');
  const [waterLevel, setWaterLevel] = useState(0); // percentage
  const [message, setMessage] = useState('');
  const [failReason, setFailReason] = useState('');

  // Scene effects
  useEffect(() => {
    if (scene === 'waking') {
      setWaterLevel(30);
      setMessage(t('flood_game.guidance_1'));
    } else if (scene === 'decision2') {
      setWaterLevel(65);
      setMessage(t('flood_game.guidance_2'));
    } else if (scene === 'success') {
      setWaterLevel(50);
      setMessage(t('flood_game.survived'));
    } else if (scene === 'gameover') {
      setWaterLevel(100);
    }
  }, [scene, t]);

  const handleDecision1 = (choice: 'toys' | 'roof' | 'hide') => {
    if (choice === 'roof') {
      setScene('decision2');
    } else if (choice === 'toys') {
      setFailReason("You wasted precious time gathering toys. Flood waters rise extremely fast and can trap you.");
      setScene('gameover');
    } else {
      setFailReason("Hiding under a bed is dangerous during a flood. You should always seek higher ground immediately.");
      setScene('gameover');
    }
  };

  const handleDecision2 = (choice: 'swim' | 'signal') => {
    if (choice === 'signal') {
      setScene('success');
    } else {
      setFailReason("Never try to swim in floodwater! It hides fast currents, dangerous debris, and can carry diseases or electrical currents.");
      setScene('gameover');
    }
  };

  const restart = () => {
    setWaterLevel(0);
    setScene('waking');
  };

  return (
    <div className="flood-game-page">
      <div className="flood-header">
        <h1>🌊 {t('flood_game.title')}</h1>
        <p>{t('flood_game.subtitle')}</p>
      </div>

      <div className="flood-animation-container">
        {/* Sky / Background */}
        <div className={`flood-sky ${scene === 'success' ? 'day' : 'night'}`}></div>
        
        {/* House Graphic */}
        <div className="flood-house">
          <div className="roof-area">
            {(scene === 'decision2' || scene === 'success') && (
              <div className="kid-sprite waving">👦<span className="cloth">🟥</span></div>
            )}
            {scene === 'success' && <div className="rescue-sprite">🚁</div>}
          </div>
          <div className="room-area">
            <div className="window">🪟</div>
            {(scene === 'waking' || scene === 'intro') && (
              <div className="kid-sprite in-bed">🛏️👦</div>
            )}
            {scene === 'gameover' && (
              <div className="kid-sprite sunk">💧👦💧</div>
            )}
          </div>
        </div>

        {/* Rising Water */}
        <div className="flood-water" style={{ height: `${waterLevel}%` }}></div>
      </div>

      <div className="flood-ui card">
        {scene === 'intro' && (
          <div className="ui-center">
            <h2>{t('flood_game.are_you_ready')}</h2>
            <p>{t('flood_game.ready_desc')}</p>
            <button className="btn btn-primary mt-3" onClick={() => setScene('waking')}>{t('flood_game.start')}</button>
          </div>
        )}

        {scene === 'waking' && (
          <div>
            <h3>🚨 {message}</h3>
            <p className="guidance">{t('flood_game.guidance_1')}</p>
            <div className="decision-grid mt-4">
              <button className="btn btn-danger" onClick={() => handleDecision1('hide')}>{t('flood_game.hide')}</button>
              <button className="btn btn-warning" onClick={() => handleDecision1('toys')}>{t('flood_game.pack_toys')}</button>
              <button className="btn btn-success" onClick={() => handleDecision1('roof')}>{t('flood_game.roof')}</button>
            </div>
          </div>
        )}

        {scene === 'decision2' && (
          <div>
            <h3>🏠 {message}</h3>
            <p className="guidance">{t('flood_game.guidance_2')}</p>
            <div className="decision-grid mt-4">
              <button className="btn btn-danger" onClick={() => handleDecision2('swim')}>{t('flood_game.swim')}</button>
              <button className="btn btn-success" onClick={() => handleDecision2('signal')}>{t('flood_game.signal')}</button>
            </div>
          </div>
        )}

        {scene === 'gameover' && (
          <div className="ui-center">
            <h2 className="text-danger">{t('flood_game.failed')}</h2>
            <div className="fail-reason">
              <p>{failReason}</p>
            </div>
            <h4 className="mt-4">{t('flood_game.survival_rule')}</h4>
            <p className="rule"><strong>"{t('flood_game.rule_1')}"</strong> {t('flood_game.rule_1_desc')}</p>
            <div className="mt-4" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={restart}>{t('flood_game.try_again')}</button>
              <button className="btn btn-outline" onClick={() => navigate('/')}>{t('flood_game.home')}</button>
            </div>
          </div>
        )}

        {scene === 'success' && (
          <div className="ui-center">
            <h2 className="text-success">{message}</h2>
            <h4 className="mt-4">{t('flood_game.rule_followed')}</h4>
            <p className="rule">{t('flood_game.rule_2_desc')}</p>
            <div className="mt-4" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={restart}>{t('flood_game.play_again')}</button>
              <button className="btn btn-outline" onClick={() => navigate('/')}>{t('flood_game.home')}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
