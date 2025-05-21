import React, { useState, useEffect, useCallback } from 'react';
import CharacterCard from './CharacterCard';
import PaginationControls from './PaginationControls';
import SearchBar from './searchBar'; // Asegúrate de tener este componente creado

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

    let url = `${API_URL}?page=${currentPage}`;
    if (searchTerm) {
      url += `&name=${searchTerm}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          setCharacters([]);
          setPaginationInfo(null);
          setLoading(false);
          setError('No se encontraron personajes.');
          return;
        }
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      setCharacters(data.results || []);
      setPaginationInfo(data.info);
    } catch (error) {
      console.error('Error al obtener personajes:', error);
      setError('No pudimos cargar los personajes. Intenta de nuevo más tarde.');
      setCharacters([]);
      setPaginationInfo(null);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  const handleNextPage = () => {
    if (paginationInfo?.next) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (paginationInfo?.prev) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
  };

  return (
    <div style={appContainerStyle}>
      <h1>Personajes de Rick y Morty</h1>
      <SearchBar onSearch={handleSearch} />
      {loading ? (
        <p style={{ textAlign: 'center', fontSize: '1.5em', color: '#555' }}>Cargando personajes...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', fontSize: '1.5em', color: 'red' }}>{error}</p>
      ) : (
        <>
          <div style={characterGridStyle}>
            {characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
          <PaginationControls
            onPrevPage={handlePreviousPage}
            onNextPage={handleNextPage}
            currentPage={currentPage}
            isLoading={loading}
            hasPrev={currentPage > 1}
            hasNext={!!paginationInfo?.next}
          />
        </>
      )}
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
