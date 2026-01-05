import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Hero from './components/Hero';
import Dashboard from './pages/Dashboard'
import RunningTasks from './pages/RunningTasks';
import CompletedTasks from './pages/CompletedTasks';
import UpcomingTasks from './pages/UpcomingTasks';
import OverdueTasks from './pages/OverdueTasks';
import CreateTask from './pages/CreateTask';
import ConnectPage from './pages/ConnectPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import Sidebar from './components/Sidebar';
import MyTeams from './pages/MyTeams';
import SharedTasks from './pages/SharedTasks';
import About from './pages/About';
import NotificationPage from './pages/NotificationPage';
import CreateTeamPage from './pages/CreateTeamPage';
import LoginRecord from './pages/LoginRecord';
import Contact from './pages/Contact';

function App() {
  const {globalUser} = useAuth()
  return (
    <Router>
      <Routes> 
        <Route path="/" element={globalUser ? <Dashboard/>: <Hero/>}/>
        <Route path="/Toaster" element={<Toaster/>}/>
        <Route path="/Dashboard" element={<Dashboard/>}/>
        <Route path='/Sidebar' element={<Sidebar/>}/>
        <Route path="/RunningTasks" element={<RunningTasks/>}/>
        <Route path="/CompletedTasks" element={<CompletedTasks/>}/>
        <Route path="/UpcomingTasks" element={<UpcomingTasks/>}/>
        <Route path="/OverdueTasks" element={<OverdueTasks/>}/>
        <Route path="/ConnectPage" element={<ConnectPage/>}/>
        <Route path="/CreateTask" element={<CreateTask/>}/>
        <Route path='/SignUpPage' element={<SignUpPage/>}/>
        <Route path='/LoginPage' element={<LoginPage/>}/>
        <Route path='/ProfilePage' element={<ProfilePage/>}/>
        <Route path='/CreateTeamPage' element={<CreateTeamPage/>}/>
        <Route path='/MyTeams' element={<MyTeams/>}/>
        <Route path='/SharedTasks' element={<SharedTasks/>}/>
        <Route path='/About' element={<About/>}/>   
        <Route path='/NotificationPage' element={<NotificationPage/>}/> 
        <Route path="/LoginRecord" element={<LoginRecord/>}/>    
        <Route path= "/Contact" element={<Contact/>}/>
      </Routes>
    </Router>
  );
}

export default App;
