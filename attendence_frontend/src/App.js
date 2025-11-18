import logo from './logo.svg';
import './App.css';
import SignUp from './components/SignUp';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import CheckInOut from './components/CheckInOut';
import TaskManager from './components/TaskManager';

function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<SignIn/>} />
    <Route path='/signup' element={<SignUp/>} />
    <Route path='/employee' element={<EmployeeDashboard/>} />
    <Route path='/admin' element={<AdminDashboard/>} />
    <Route path='/check' element={<CheckInOut/>} />
    <Route path='/tasks' element={<TaskManager/>} />
   </Routes>
   </BrowserRouter>
  );
}

export default App;
