import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ChallengePage from './pages/ChallengePage';
import AdminPage from './pages/AdminPage';
import CommunityPage from './pages/CommunityPage';
import VolunteerPage from './pages/VolunteerPage';
import RecoveryPage from './pages/RecoveryPage';
import PreparednessPage from './pages/PreparednessPage';
import QuizPage from './pages/QuizPage';
import GamePage from './pages/GamePage';
import FloodGame from './pages/FloodGame';
import { I18nProvider } from './i18n';
import Layout from './components/Layout';
import './App.css';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <I18nProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><Layout><HomePage /></Layout></PrivateRoute>} />
        <Route path="/challenges/:id" element={<PrivateRoute><Layout><ChallengePage /></Layout></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><Layout><AdminPage /></Layout></PrivateRoute>} />
        <Route path="/community" element={<PrivateRoute><Layout><CommunityPage /></Layout></PrivateRoute>} />
        <Route path="/volunteers" element={<PrivateRoute><Layout><VolunteerPage /></Layout></PrivateRoute>} />
        <Route path="/recovery" element={<PrivateRoute><Layout><RecoveryPage /></Layout></PrivateRoute>} />
        <Route path="/preparedness" element={<PrivateRoute><Layout><PreparednessPage /></Layout></PrivateRoute>} />
        <Route path="/quiz" element={<PrivateRoute><Layout><QuizPage /></Layout></PrivateRoute>} />
        <Route path="/game" element={<PrivateRoute><Layout><GamePage /></Layout></PrivateRoute>} />
        <Route path="/flood-game" element={<PrivateRoute><Layout><FloodGame /></Layout></PrivateRoute>} />
      </Routes>
    </I18nProvider>
  );
}

export default App;
