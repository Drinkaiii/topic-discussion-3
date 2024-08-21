import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Search from './Search.jsx';
import DetailPage from './DetailPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Search />} />
      <Route path="/details" element={<DetailPage />} />
    </Routes>
  );
}

export default App;