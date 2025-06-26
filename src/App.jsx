import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';

function App() {
  useEffect(() => {
    // مربع لعرض المتغيرات البيئية عشان نختبر ظهورها على الموبايل
    const debug = document.createElement("div");
    debug.style.position = "fixed";
    debug.style.bottom = "0";
    debug.style.left = "0";
    debug.style.background = "#222";
    debug.style.color = "#0f0";
    debug.style.padding = "10px";
    debug.style.zIndex = 9999;
    debug.style.fontSize = "12px";
    debug.style.whiteSpace = "pre-line";
    debug.innerText = `
EMAILJS SERVICE: ${import.meta.env.VITE_EMAILJS_SERVICE_ID}
FIREBASE KEY: ${import.meta.env.VITE_FIREBASE_API_KEY}
    `;
    document.body.appendChild(debug);
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
