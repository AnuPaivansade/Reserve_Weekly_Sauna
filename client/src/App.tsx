import { Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import Saunavuorot from './components/Saunavuorot';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import Navbar from './components/Navbar';

const App : React.FC = () : React.ReactElement => {

  const [token, setToken] = useState<string | null>(String(localStorage.getItem("token")));
  const [kirjautunut, setKirjautunut] = useState<boolean>(false);
  const [sahkopostiosoite, setSahkopostiosoite] = useState<string>(String(localStorage.getItem("sahkopostiosoite")));
  const [kayttajaId, setKayttajaId] = useState<number | null>(null);
  const [kayttajatunnus, setKayttajatunnus] =useState<string>("");

  return(
    <>
      <Navbar kirjautunut={kirjautunut}/>
      <Routes>
        <Route path="/" element={<Saunavuorot token={token} kirjautunut={kirjautunut} sahkopostiosoite={sahkopostiosoite} kayttajaId={kayttajaId} kayttajatunnus={kayttajatunnus}/>}/>
        <Route path="/login" element={<Login setToken={setToken} setKirjautunut={setKirjautunut} setSahkopostiosoite={setSahkopostiosoite} setKayttajaId={setKayttajaId} setKayttajatunnus={setKayttajatunnus}/>}/>
        <Route path="/logout" element={<Logout setKirjautunut={setKirjautunut} setKayttajaId={setKayttajaId} setKayttajatunnus={setKayttajatunnus}/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </>
  );
}

export default App;