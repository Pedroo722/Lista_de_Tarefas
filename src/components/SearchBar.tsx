import React from 'react';
import { TextField, Box } from '@mui/material';
import { SearchBarProps } from '../util/types';

const SearchBar: React.FC<SearchBarProps> = ({ query, onSearch }) => {
  return (
    <Box sx={{ marginBottom: 2 }}>
      <TextField
        label="Pesquisar Tarefa"
        variant="outlined"
        fullWidth
        value={query}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Digite o nome da tarefa..."
      />
    </Box>
  );
};

export default SearchBar;
