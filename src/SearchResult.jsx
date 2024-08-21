import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchResult = () => {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('searchResults');
    if (storedData) {
      setResults(JSON.parse(storedData));
    }
  }, []);

  const handleItemClick = (id) => {
    const selectedData = results.find((result) => result.id === id);
    if (selectedData) {
      localStorage.setItem('selectedData', JSON.stringify(selectedData));
      navigate('/details');
    }
  };


  if (results.length === 0) {
    return <div>No results found.</div>;
  }

  return (
    <div>
      <h1>Search Results</h1>
      <ul>
        {results.map((result) => (
          <li key={result.id} onClick={() => handleItemClick(result.id)}>
            <h2 style={{ cursor: 'pointer' }}>{result.title}</h2>
            <p style={{ cursor: 'pointer' }}>{result.details.overview}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResult;
