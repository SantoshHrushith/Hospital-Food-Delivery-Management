import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ManagerHome from './pages/ManagerHome.jsx';
import Patient from './pages/Patient.jsx';
import PatientCreate from './pages/PatientCreate';
import PatientInfo from './pages/PatientInfo.jsx';
import PatientEdit from './pages/PatientEdit.jsx';
import DietInfo from './pages/DietInfo.jsx';
import DietCreate from './pages/DietCreate.jsx';
import StaffCreate from './pages/StaffCreate.jsx';
import Staff from './pages/Staff.jsx';
import Pantry from './pages/Pantry.jsx';
import PrivateRoute from './PrivateRoute.jsx'
import DeliveryPortal from './pages/DeliveryPortal.jsx';
import PantryHome from './pages/PantryHome.jsx';
import { Navigate } from 'react-router-dom';
import H from './pages/H.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        {/* <Route path='/' element={<H />} /> */}
        <Route element={<PrivateRoute />}>
          <Route path='/managerhome' element={<ManagerHome />} />
          <Route path='/pantryhome' element={<PantryHome />} />
          <Route path='/patients' element={<Patient />} />
          <Route path='/patient/add' element={<PatientCreate />} />
          <Route path='/patientinfo/:id' element={<PatientInfo />} />
          <Route path='/patientedit/:id' element={<PatientEdit />} />
          <Route path='/dietinfo/:id' element={<DietInfo />} />
          <Route path='/diet/create/:id' element={<DietCreate />} />
          <Route path='/staff/add' element={<StaffCreate />} />
          <Route path='/staff' element={<Staff />} />
          <Route path='/pantry' element={<Pantry />} />
          <Route path='/delivery' element={<DeliveryPortal />} /> 
        </Route>
        <Route path="/" element={<Navigate to="/login" />} />
  {/* Fallback for undefined routes */}
  <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
  );
}

export default App;
