import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Card, CardContent, CardMedia, Grid } from '@mui/material';
import './SearchResult.css';

const SearchResult = () => {

  //hocks
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  
  //授權相關
  const username = 'elastic';
  const password = 'YFqFY2Mr=UQMKupkuqN3';
  const credentials = btoa(`${username}:${password}`);
  const host = "http://203.204.185.67:9200";

  // 拿取資料
  const keyword = localStorage.getItem('keyword');

  const queryForKeyword = {
    "query": {
      "query_string": {
        "query": `${keyword}`,
        "fields": ["title", "title_zh", "overview", "overview_zh"]
      }
    },
    "highlight": {
      "fields": {
        "title": {},
        "title_zh":{},
        "overview": {},
        "overview_zh":{}
      }
    },
    "from": 0,
    "size": 100
  };

  // 首次載入
  if (keyword){
    handleQuery(0);
  }
  if (results.length === 0) {
    return <div>No results found.</div>;
  }

  // 查詢資料： fetch -> 儲存 results -> 重新渲染畫面 
  async function handleQuery (paging){

    const response = await fetch(
      `${host}/movies/_search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify(queryForKeyword)
      }
    );
    const data = await response.json();
    const hits = data.hits.hits;
    const resultList = hits.map((hit) => ({
      id: hit._id,
      title: hit.highlight.title ? hit.highlight.title : hit._source.title,
      overview: hit.highlight.overview ? hit.highlight.overview : hit._source.overview,
      title_zh: hit.title_zh ? hit.title_zh : null,
      overview_zh: hit.overview_zh ? hit.overview_zh : null,
      details: hit._source
    }));
    setResults(resultList);

  };

  // 設定建議選項點擊功能：儲存 localstorage -> 跳轉畫面
  const handleItemClick = (id) => {
    const selectedData = results.find((result) => result.id === id);
    if (selectedData) {
      console.log(selectedData);
      localStorage.setItem('selectedData', JSON.stringify(selectedData));
      navigate('/details');
    }
  };

  return (
    <div style={{display: "flex", flexDirection:"column", alignItems:'center'}}>
      <Typography variant="h2" gutterBottom style={{ fontWeight: 'bold', marginTop: '20px' }}>
        Search Results
      </Typography>
      <Grid container spacing={3}>
        {results.map((result) => (
          <Grid item xs={12} key={result.id}>
            <Card style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', width: '70%', margin: '0 auto' }} onClick={() => handleItemClick(result.id)}>
              <CardContent style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <Typography variant="h5" component="div" dangerouslySetInnerHTML={{ __html: result.title }} />
                <Typography variant="body2" color="text.secondary" dangerouslySetInnerHTML={{ __html: result.overview_zh ? result.overview_zh : result.overview }} />
              </CardContent>
              <CardMedia
                component="img"
                sx={{ width: 150, height: 'auto' }}
                image={
                  result.details.poster_path
                  ? `https://image.tmdb.org/t/p/w500${result.details.poster_path}`
                  : `https://image.tmdb.org/t/p/w500${result.details.backdrop_path}`
                }
                alt={result.details.title}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};


export default SearchResult;
