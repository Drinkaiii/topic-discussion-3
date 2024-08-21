import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Search from './Search.jsx';
import DetailPage from './DetailPage.jsx';
import SearchResult from './SearchResult.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Search />} />
      <Route path="/details" element={<DetailPage />} />
      <Route path="/results" element={<SearchResult />} />
    </Routes>
  );
}

export default App;