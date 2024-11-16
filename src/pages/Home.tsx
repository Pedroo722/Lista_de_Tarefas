import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Edit, Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { baseUrlTasks } from '../util/constants';
import axios from 'axios';
import { Task } from '../util/types';

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  const fetchTasks = () => {
    axios
      .get(baseUrlTasks)
      .then((response) => {
        if (response.status === 200) {
          const dados = response.data;
          console.log('Dados Recebidos: ', dados);
          const sortedTasks = dados
            .map((task: Task) => ({
              id: task.id,
              nomeTarefa: task.nomeTarefa,
              custo: task.custo,
              dataLimite: task.dataLimite,
              ordemApresentacao: task.ordemApresentacao,
            }))
            .sort((a: Task, b: Task) => a.ordemApresentacao - b.ordemApresentacao);

          setTasks(sortedTasks);
          console.log('Tasks fetched and sorted successfully!');
        } else {
          alert('Erro ao buscar tarefas no servidor!');
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Erro ao conectar com o servidor!');
      });
  };

  const handleCreate = (task: Task) => {
    const taskToCreate = {
      nomeTarefa: task.nomeTarefa,
      custo: task.custo,
      dataLimite: task.dataLimite || ''
    };
  
    axios
      .post(baseUrlTasks, taskToCreate)
      .then((response) => {
        if (response.status === 201) {
          setTasks([...tasks, response.data]);
          console.log('Task created successfully!');
          handleCloseDialog();
        } else {
          alert('Erro ao criar tarefa no servidor!');
        }
      })
      .catch((error) => {
        console.error(error);
        console.log("Task enviada: ", task);
        alert('Erro ao conectar com o servidor!');
      });
  };

  const handleEdit = () => {
    if (currentTask) {
      axios
        .put(`${baseUrlTasks}/${currentTask.id}`, currentTask)
        .then((response) => {
          if (response.status === 200) {
            setTasks(tasks.map((task) => task.id === currentTask.id ? response.data : task));
            console.log('Task edited successfully!');
          } else {
            alert('Erro ao editar tarefa no servidor!');
          }
        })
        .catch((error) => {
          console.error(error);
          alert('Erro ao conectar com o servidor!');
        })
        .finally(() => {
          handleCloseDialog();
        });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja apagar?')) {
      axios
        .delete(`${baseUrlTasks}/${id}`)
        .then((response) => {
          if (response.status === 200) {
            console.log('Task deleted successfully!');
            fetchTasks();
          }
        })
        .catch((error) => {
          console.error(error);
          alert('Erro ao conectar com o servidor!');
        });
    }
  };

  const handleReorder = (id: number, direction: 'up' | 'down') => {
    // const index = tasks.findIndex((task) => task.id === id);
    alert("Em implementação...");
  };

  const handleOpenDialog = (task: Task) => {
    setCurrentTask(task);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTask(null);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.nomeTarefa}</TableCell>
                <TableCell>{task.custo}</TableCell>
                <TableCell>{task.dataLimite}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(task)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(task.id)}>
                    <Delete />
                  </IconButton>
                  <IconButton onClick={() => handleReorder(task.id, 'up')}>
                    <ArrowUpward />
                  </IconButton>
                  <IconButton onClick={() => handleReorder(task.id, 'down')}>
                    <ArrowDownward />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        color="primary"
        size="large"
        style={{ marginTop: '20px' }}
        onClick={() =>
          handleOpenDialog({
            id: 0,
            nomeTarefa: '',
            custo: 0,
            dataLimite: '',
            ordemApresentacao: tasks.length + 1,
          })
        }
      >
        Inserir Tarefa
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentTask?.id ? 'Editar Tarefa' : 'Criar Tarefa'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nome da Tarefa"
            fullWidth
            margin="normal"
            value={currentTask?.nomeTarefa || ''}
            onChange={(e) =>
              setCurrentTask({ ...currentTask!, nomeTarefa: e.target.value })
            }
          />
          <TextField
            label="Custo (R$)"
            fullWidth
            margin="normal"
            type="number"
            value={currentTask?.custo || ''}
            onChange={(e) =>
              setCurrentTask({ ...currentTask!, custo: parseFloat(e.target.value) })
            }
          />
          <TextField
            label="Data Limite"
            fullWidth
            margin="normal"
            type="date"
            value={currentTask?.dataLimite || ''}
            onChange={(e) =>
              setCurrentTask({ ...currentTask!, dataLimite: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() =>
              currentTask?.id ? handleEdit() : handleCreate(currentTask!)
            }
            color="primary"
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;