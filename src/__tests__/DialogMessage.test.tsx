import { render, screen, fireEvent } from '@testing-library/react';
import DialogMessage from '../components/DialogMessage';

const mockOnConfirm = jest.fn();
const mockOnClose = jest.fn();
const mockOnCancel = jest.fn();

describe('Componente DialogMessage', () => {
  it('renderiza o Dialog quando open for true', () => {
    render(
      <DialogMessage
        open={true}
        title="Título do Dialog"
        message="Mensagem de teste."
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Título do Dialog')).toBeInTheDocument();
    expect(screen.getByText('Mensagem de teste.')).toBeInTheDocument();
  });

  it('chama onConfirm quando o botão Confirmar é clicado', () => {
    render(
      <DialogMessage
        open={true}
        title="Título do Dialog"
        message="Mensagem de teste."
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Confirmar'));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('chama onCancel quando o botão Cancelar é clicado', () => {
    render(
      <DialogMessage
        open={true}
        title="Título de Teste"
        message="Esta é uma mensagem de teste."
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Cancelar'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});