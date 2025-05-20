import React, { useState, useEffect, useCallback } from 'react';
import CharacterCard from './CharacterCard'; 
import PaginationControls from './PaginationControls'; 

const API_URL = 'https://rickandmortyapi.com/api/character/';

function RickAndMortyCharacters() { 
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState(null);

  const fetchCharacters = useCallback(async () => {
    setLoading(true);
    setError(null);

    const url = `${API_URL}?page=${currentPage}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404 && currentPage > 1 && paginationInfo?.next === null) { 
          setPaginationInfo(prev => ({ ...prev, next: null }));
          setLoading(false);
          return;
        }
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      if (currentPage === 1) {
        setCharacters(data.results || []);
      } else {
        setCharacters(prev => [...prev, ...data.results]);
      }
      setPaginationInfo(data.info);

    } catch (error) {
      console.error('Error al obtener personajes:', error);
      setError('No pudimos cargar los personajes. Intenta de nuevo más tarde.');
      setCharacters([]);
      setPaginationInfo(null);
    } finally {
      setLoading(false);
    }
  }, [currentPage, paginationInfo]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  if (loading) {
    return <p style={{ textAlign: 'center', fontSize: '1.5em', color: '#555' }}>Cargando personajes...</p>;
  }

  if (error) {
    return <p style={{ textAlign: 'center', fontSize: '1.5em', color: 'red' }}>{error}</p>;
  }

  return (
    <div style={appContainerStyle}>
      <h1>Personajes de Rick y Morty</h1>
      <div style={characterGridStyle}> 
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
      <PaginationControls
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        hasNextPage={paginationInfo?.next !== null}
        hasPrevPage={paginationInfo?.prev !== null}
      />
    </div>
  );
}

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

export default RickAndMortyCharacters;
