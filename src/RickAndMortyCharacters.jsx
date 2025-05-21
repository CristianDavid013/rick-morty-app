import React, { useState, useEffect, useCallback } from 'react';
import CharacterCard from './CharacterCard'; 
import PaginationControls from './PaginationControls'; 
import { set } from 'mongoose';


const API_URL = 'https://rickandmortyapi.com/api/character/';

function RickAndMortyCharacters() { 
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCharacters = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (searchTerm) {
      url = `${API_URL}?name=${searchTerm}`;
    }

    const url = `${API_URL}?page=${currentPage}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404 && currentPage > (paginationInfo?.pages || 0)) { 
          setCharacters([]);
          setError('err message');
          setPaginationInfo(prev => (null ));
          setLoading(false);
          return;
        }
        if (response.status === 404 && searchTerm) {
          setCharacters([]);
          setLoading(false);
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      setCharacters(data.results || []);
      setPaginationInfo(data.info);

    }
    
    catch (error) {
      console.error('Error al obtener personajes:', error);
      setError('No pudimos cargar los personajes. Intenta de nuevo más tarde.');
      setCharacters([]);
      setPaginationInfo(null);

    } finally {
      setLoading(false);
    }
  }; 
  
  [currentPage]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  if (loading) {
    return <p style={{ textAlign: 'center', fontSize: '1.5em', color: '#555' }}>Cargando personajes...</p>;
  }

  if (error) {
    return <p style={{ textAlign: 'center', fontSize: '1.5em', color: 'red' }}>{error}</p>;
  }

  const handleNextPage = () => {
    if (paginationInfo && paginationInfo.next) {
      setCharacters([]);
      setCurrentPage((nextPage) => nextPage + 1);
    }
  }
  const handlePreviousPage = () => {
    if (paginationInfo && paginationInfo.prev) {
      setCharacters([]);
      setCurrentPage((prevPage) => prevPage - 1);
    }
  }

  const handleSearch = (newSearchTerm) => {
    if (newSearchTerm !== searchTerm) {
      setSearchTerm(newSearchTerm);
      setCharacters([]);
  };

  const handleSearch = (newSearchTerm ) => {

  return (
  <div style={appContainerStyle}>
    <h1>Personajes de Rick y Morty</h1>
    <searchBar onSearch={handleSearch} />
    <div style={characterGridStyle}>
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
    {error && (
      <PaginationControls
        onPrevPage={handlePreviousPage}
        onNextPage={handleNextPage}
        currentPage={currentPage}
        isLoading={loading}
        hasPrev={currentPage > 1}
        hasNext={paginationInfo?.next !== null}
      />
    )}
  </div>
);


// Estilos
const appContainerStyle = {
  fontFamily: 'Arial, sans-serif',
  maxWidth: '900px',
  margin: '20px auto',
  padding: '20px',
  backgroundColor: '#f4f4f4',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  color: '#333',
};

const characterGridStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '15px',
  marginTop: '20px',
};

}


export default RickAndMortyCharacters;
