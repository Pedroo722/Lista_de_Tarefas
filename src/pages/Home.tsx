import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Edit, Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';

interface Task {
  id: number;
  name: string;
  cost: number;
  dueDate: string;
  order: number;
}

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  const handleOpenDialog = (task: Task) => {
    setCurrentTask(task);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTask(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja apagar?')) {
      // Logic de Apagar
    }
  };

  const handleEdit = () => {
    // Lógica de Editar
    handleCloseDialog();
  };

  const handleReorder = (id: number, direction: 'up' | 'down') => {
    // Lógica de Ordenação
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Lista de Fazeres</h1>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Custo (R$)</TableCell>
              <TableCell>Data Limite</TableCell>
              <TableCell>Ordem</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.name}</TableCell>
                <TableCell>{task.cost}</TableCell>
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>{task.order}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(task)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(task.id)}><Delete /></IconButton>
                  <IconButton onClick={() => handleReorder(task.id, 'up')}><ArrowUpward /></IconButton>
                  <IconButton onClick={() => handleReorder(task.id, 'down')}><ArrowDownward /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" color="primary" size="large" style={{ marginTop: '20px' }}>
        Inserir Tarefa
      </Button>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Editar Tarefa</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome da Tarefa"
            fullWidth
            margin="normal"
            value={currentTask?.name || ''}
            onChange={(e) => setCurrentTask({ ...currentTask!, name: e.target.value })}
          />
          <TextField
            label="Custo (R$)"
            fullWidth
            margin="normal"
            type="number"
            value={currentTask?.cost || ''}
            onChange={(e) => setCurrentTask({ ...currentTask!, cost: parseFloat(e.target.value) })}
          />
          <TextField
            label="Data Limite"
            fullWidth
            margin="normal"
            type="date"
            value={currentTask?.dueDate || ''}
            onChange={(e) => setCurrentTask({ ...currentTask!, dueDate: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancelar</Button>
          <Button onClick={handleEdit} color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;