import React, { useState } from 'react';
import { TextField, List, ListItem, ListItemText, Paper, Button, ButtonGroup, Typography, Card, CardMedia, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {

  //hocks
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [randomMovie, setRandomMovie] = useState(null);
  const navigate = useNavigate(); 

  //授權相關
  const username = 'elastic';
  const password = 'YFqFY2Mr=UQMKupkuqN3';
  const credentials = btoa(`${username}:${password}`);
  const host = "http://203.204.185.67:9200";

  // 跳出建議選項：fetch -> 儲存 suggestions -> 重新渲染畫面
  async function handleInputChange(e){
    const value = e.target.value;
    setQuery(value);

    const query = {
      query: {
        query_string: {
          "query": `*${value}*`,
          "fields": ["title", "title_zh"]
        }
      }
    };

    if (value.length > 0) {
      const response = await fetch(
        `${host}/movies/_search`,
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

  // 設定建議選項點擊功能：儲存 localstorage -> 跳轉畫面
  function handleSuggestionClick (id) {
    const selectedData = suggestions.find((suggestion) => suggestion.id === id);
    if (selectedData) {
      localStorage.setItem('selectedData', JSON.stringify(selectedData));
      navigate('/details');
    }
  };

  // 設定點選 enter 功能：儲存 localstorage -> 跳轉畫面
  function handleEnterKeyDown(e){
    if (e.key === 'Enter') {
      localStorage.setItem("keyword", query);
      console.log(query);
      navigate('/results');
    }
  };

  // 設定分類選項點擊功能：儲存 localstorage -> 跳轉畫面
  function handleCategoryClick (genres) {
    const selectedData = suggestions.find((suggestion) => suggestion.id === id);
    if (selectedData) {
      localStorage.setItem('selectedData', JSON.stringify(selectedData));
      navigate('/details');
    }
  };

  return (
    <div style={{display: 'flex',flexDirection: 'column'}}>
      
      <Typography variant="h2" gutterBottom style={{ fontWeight: 'bold', marginTop: '20px' }}>
        Movie Search
      </Typography>

      <ButtonGroup variant="outlined" color="primary" style={{ marginBottom: '10px', width: "100%" }}>
        <Button style={{ flexGrow: 1 }} onClick={() => handleKeywordClick('Action')}>動作片</Button>
        <Button style={{ flexGrow: 1 }} onClick={() => handleKeywordClick('Adventure')}>冒險片</Button>
        <Button style={{ flexGrow: 1 }} onClick={() => handleKeywordClick('Comedy')}>喜劇片</Button>
        <Button style={{ flexGrow: 1 }} onClick={() => handleKeywordClick('Drama')}>劇情片</Button>
        <Button style={{ flexGrow: 1 }} onClick={() => handleKeywordClick('Horror')}>恐怖片</Button>
        <Button style={{ flexGrow: 1 }} onClick={() => handleKeywordClick('Fantasy')}>奇幻片</Button>
        <Button style={{ flexGrow: 1 }} onClick={() => handleKeywordClick('Romance')}>愛情片</Button>
        <Button style={{ flexGrow: 1 }} onClick={() => handleKeywordClick('Animation')}>動畫片</Button>
      </ButtonGroup>

      <TextField
        fullWidth
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleEnterKeyDown}
        placeholder="Search..."
        variant="outlined"
      />
      {suggestions.length > 0 && (
        <Paper style={{ overflow: 'auto', marginTop: '5px' }}>
          <List>
            {suggestions.map((suggestion) => (
              <ListItem button key={suggestion.id} onClick={() => handleSuggestionClick(suggestion.id)}>
                <ListItemText primary={suggestion.title} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {randomMovie && (
        <Card style={{ marginTop: '20px', maxWidth: '800px', width: '100%' }}>
          <CardMedia
            component="img"
            height="300"
            image={randomMovie.image || 'https://via.placeholder.com/800x300.png?text=Movie+Image'} // replace with the actual image field
            alt={randomMovie.title}
          />
          <CardContent>
            <Typography variant="h5" component="div">
              {randomMovie.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {randomMovie.description || 'No description available.'}  {/* replace with the actual description field */}
            </Typography>
          </CardContent>
        </Card>
      )}

    </div>

  );
};

export default SearchBar;
