import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
//import Ejecutor from './TestExecute.tsx'; perdón es que queria ver sin crear una route xd

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <Ejecutor/> */}
  </StrictMode>,
);
