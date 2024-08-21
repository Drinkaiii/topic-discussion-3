import React, { useState } from 'react';
import { TextField, List, ListItem, ListItemText, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate(); 
  const username = 'elastic';
  const password = 'YFqFY2Mr=UQMKupkuqN3';
  const credentials = btoa(`${username}:${password}`);


  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    const query = {
      query: {
        query_string: {
          default_field: "title",
          query: `*${value}*`
        }
      }
    };

    if (value.length > 0) {
      const response = await fetch(
        `http://localhost:9200/movies/_search`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`
          },
          body: JSON.stringify(query)
        }
      );
      const data = await response.json();
      const hits = data.hits.hits;
      const suggestionList = hits.map((hit) => ({
        id: hit._id,
        title: hit._source.title,
        details: hit._source
      }));
      setSuggestions(suggestionList);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (id) => {
    const selectedData = suggestions.find((suggestion) => suggestion.id === id);
    if (selectedData) {
      localStorage.setItem('selectedData', JSON.stringify(selectedData));
      navigate('/details');
    }
  };

  return (
    <div>
      <TextField
        fullWidth
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
        variant="outlined"
      />
      {suggestions.length > 0 && (
        <Paper style={{ maxHeight: 200, overflow: 'auto', marginTop: '5px' }}>
          <List>
            {suggestions.map((suggestion) => (
              <ListItem button key={suggestion.id} onClick={() => handleSuggestionClick(suggestion.id)}>
                <ListItemText primary={suggestion.title} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
};

export default SearchBar;
