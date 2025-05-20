import react from 'react';
function PaginationControls({ onPrevious, onNext, onFilter, categories }) {
    return(
        <div style={controlsStyle}>
            <button 
                onClick={onPrevious}
                style={buttonStyle}  
                disbled={ isLoading || !hasPrev }
            >Anterior</button>
            <span style={ { margin: '0 15px', fontSize: '1.1em', fontWeight: 'bold' } }>
                página {totalPages}
            </span>

            <button 
                onClick={onNext} 
                style={buttonStyle}
                disbled={ isLoading || !hasNext }>Siguiente</button>
            <div style={{ marginLeft: '20px' }}>
                <label htmlFor="filterCategory">Filtrar por Categoría: </label>
                <select id="filterCategory" onChange={(e) => onFilter(e.target.value)}>
                    <option value="all">Todas</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
        </div>

    )

}

const controlsStyle = {

display: 'flex',

justifyContent: 'center',

alignItems: 'center',

margin: '30px 0',

};

 

const buttonStyle = {

padding: '12px 25px',

backgroundColor: '#008CBA',

color: 'white',

border: 'none',

borderRadius: '5px',

fontSize: '1em',

cursor: 'pointer',

transition: 'background-color 0.3s ease',

};

 

// Estilo para botón deshabilitado

buttonStyle[':disabled'] = {

backgroundColor: '#cccccc',

cursor: 'not-allowed',

};