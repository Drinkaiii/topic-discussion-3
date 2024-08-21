import React, { useEffect, useState } from 'react';

const MovieDetails = () => {
  const [details, setDetails] = useState(null);

  useEffect(() => {

    const storedDetails = localStorage.getItem('selectedData');    
    if (storedDetails) {
      try {
        const parsedDetails = JSON.parse(storedDetails);
        setDetails(parsedDetails.details);
      } catch (error) {
        console.error("Error parsing JSON from localStorage", error);
      }
    }
    
  }, []);

  if (!details) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{details.title}</h1>
      <p><strong>Overview:</strong> {details.overview}</p>
      <img
        src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
        alt={details.title}
        style={styles.poster}
      />
      <p><strong>Release Date:</strong> {details.release_date}</p>
      <p><strong>Vote Average:</strong> {details.vote_average}</p>
      <p><strong>Vote Count:</strong> {details.vote_count}</p>
      <p><strong>Original Language:</strong> {details.original_language}</p>
      <p><strong>Popularity:</strong> {details.popularity}</p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  poster: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    marginBottom: '20px',
  }
};

export default MovieDetails;
