import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Create from './components/Create';
import Navbar from './components/NavBar';
import Edit from './components/Edit';
import Delete from './components/Delete';
import Grafico from './components/Grafico'
import ProgramacionLecturas from './components/ProgramacionLecturas';
import ControlLecturas from './components/ControlLecturas';
import VerContadores from './components/VerContadores'
import Login from './components/Login'
import VerProgramacion from './components/VerProgramacion';
import EditProgramaciones from './components/EditProgramaciones';
import DeleteProgramaciones from './components/DeleteProgramaciones';
import InformacionContador from './components/InformacionContador';


function App() {
  const myWidth = 220;
  return (
    <div className="App">
      <Navbar 
        drawerWidth={myWidth}
        content = {
          <Routes>
            <Route path="/programacion-lecturas" element={<ProgramacionLecturas />} /> 
            <Route path="/control-lecturas" element={<ControlLecturas />} />
            <Route path="/grafico" element={<Grafico />} />
            <Route path="/" element={<Home />} />
            <Route path="/ver-contadores" element={(
              <div>
                <VerContadores />
              </div>
            )} />
            <Route path="/create" element={<Create />} />
            <Route path="/ver-contadores/edit/:id" element={<Edit/>} />
            <Route path="/ver-contadores/delete/:id" element={<Delete />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/control-lecturas/edit/:id" element={<EditProgramaciones />} />
            <Route path="/control-lecturas/delete/:id" element={<DeleteProgramaciones />} />
          </Routes>
        }
      />
    </div>
  );
}

export default App;
