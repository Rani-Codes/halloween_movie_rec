import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [movie, setMovie] = useState(null);
  const apiKey = import.meta.env.VITE_OMDB_API_KEY;  // Access the API key

  // Function to fetch details of specific movies
  const fetchSpecificMovies = async () => {
    const specificTitles = ["Pearl", "Blade", "The Conjuring"];
    const specificMovies = [];

    for (const title of specificTitles) {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}`);
      const data = await response.json();
      if (data && data.Response !== "False") specificMovies.push(data);
    }
    return specificMovies;
  };

  const fetchMovie = async () => {
    try {
      // Fetch Halloween-themed movies
      const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=halloween&type=movie`);
      const data = await response.json();

      // Fetch specific movies
      const specificMovies = await fetchSpecificMovies();

      // Combine Halloween-themed movies with specific movies
      const allMovies = data.Search ? [...data.Search, ...specificMovies] : specificMovies;

      // Pick a random movie from the combined list
      if (allMovies.length > 0) {
        const randomMovie = allMovies[Math.floor(Math.random() * allMovies.length)];

        // Fetch full movie details if needed (for Search results)
        if (randomMovie.imdbID) {
          const movieDetails = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${randomMovie.imdbID}`);
          const movieData = await movieDetails.json();
          setMovie(movieData);
        } else {
          setMovie(randomMovie); // Use data directly for specific titles
        }
      } else {
        setMovie(null);
      }
    } catch (error) {
      console.error('Error fetching movie data:', error);
      setMovie(null);
    }
  };

  return (
    <div className='bg-orange-700 w-full h-screen text-white'>
      <h1 className='text-4xl w-full text-center p-4'>Halloween Movie Recommender</h1>
      
      <div className='flex flex-col items-center justify-center'>
        <button
          onClick={fetchMovie}
          className='bg-black text-white py-2 px-4 mt-4 rounded'
        >
          Get a Spooky Recommendation!
        </button>
        
        {movie && (
          <div className='mt-8 p-4 bg-black text-white rounded flex justify-center items-center flex-col'>
            <h2 className='text-2xl'>{movie.Title}</h2>
            <p>{movie.Genre}, {movie.Year}</p>
            <p className='mt-2'>{movie.Plot}</p>
            {movie.Poster && (
              <img src={movie.Poster} alt={`${movie.Title} Poster`} className='w-48 h-auto mt-4 rounded' />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
