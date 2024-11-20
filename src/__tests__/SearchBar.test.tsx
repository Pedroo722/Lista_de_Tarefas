import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../components/SearchBar';

const mockOnSearch = jest.fn();

describe('Componente SearchBar', () => {
  it('renderiza a barra de pesquisa', () => {
    render(<SearchBar query="" onSearch={mockOnSearch} />);
    expect(screen.getByLabelText('Pesquisar Tarefa')).toBeInTheDocument();
  });

  it('chama onSearch quando o valor do input mudar', () => {
    render(<SearchBar query="Tarefa" onSearch={mockOnSearch} />);

    fireEvent.change(screen.getByLabelText('Pesquisar Tarefa'), { target: { value: 'Teste' } });
    expect(mockOnSearch).toHaveBeenCalledWith('Teste');
  });
});