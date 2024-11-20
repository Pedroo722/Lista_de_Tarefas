import { render, screen, fireEvent } from '@testing-library/react';
import PageSelector from '../components/PageSelector';

const mockSetCurrentPage = jest.fn();

describe('Componente PageSelector', () => {
  it('renderiza o componente de paginação', () => {
    render(
      <PageSelector
        currentPage={1}
        tasksPerPage={5}
        tasks={[
          { id: 1, nomeTarefa: 'Tarefa 1', custo: 100, dataLimite: '2024-12-01', ordemApresentacao: 1 },
          { id: 2, nomeTarefa: 'Tarefa 2', custo: 200, dataLimite: '2024-12-02', ordemApresentacao: 2 },
          { id: 3, nomeTarefa: 'Tarefa 3', custo: 300, dataLimite: '2024-12-03', ordemApresentacao: 3 },
          { id: 4, nomeTarefa: 'Tarefa 4', custo: 400, dataLimite: '2024-12-04', ordemApresentacao: 4 },
          { id: 5, nomeTarefa: 'Tarefa 5', custo: 500, dataLimite: '2024-12-05', ordemApresentacao: 5 },
          { id: 6, nomeTarefa: 'Tarefa 6', custo: 600, dataLimite: '2024-12-06', ordemApresentacao: 6 }
        ]}
        setCurrentPage={mockSetCurrentPage}
      />
    );

    const pagination = screen.getByRole('navigation');
    expect(pagination).toBeInTheDocument();
  });

  it('chama setCurrentPage quando uma página é selecionada', () => {
    render(
      <PageSelector
        currentPage={1}
        tasksPerPage={5}
        tasks={[
          { id: 1, nomeTarefa: 'Tarefa 1', custo: 100, dataLimite: '2024-12-01', ordemApresentacao: 1 },
          { id: 2, nomeTarefa: 'Tarefa 2', custo: 200, dataLimite: '2024-12-02', ordemApresentacao: 2 },
          { id: 3, nomeTarefa: 'Tarefa 3', custo: 300, dataLimite: '2024-12-03', ordemApresentacao: 3 },
          { id: 4, nomeTarefa: 'Tarefa 4', custo: 400, dataLimite: '2024-12-04', ordemApresentacao: 4 },
          { id: 5, nomeTarefa: 'Tarefa 5', custo: 500, dataLimite: '2024-12-05', ordemApresentacao: 5 },
          { id: 6, nomeTarefa: 'Tarefa 6', custo: 600, dataLimite: '2024-12-06', ordemApresentacao: 6 }
        ]}
        setCurrentPage={mockSetCurrentPage}
      />
    );

    fireEvent.click(screen.getByText('2'));
    expect(mockSetCurrentPage).toHaveBeenCalledWith(2);
  });
});