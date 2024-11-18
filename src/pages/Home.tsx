import React, { useState, useEffect } from 'react';
import { Button, Box, CircularProgress, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Modal } from 'antd';
import { baseUrlTasks } from '../util/constants';
import axios from 'axios';
import { Task } from '../util/types';
import PageSelector from '../components/PageSelector';
import SearchBar from '../components/SearchBar';
import TaskTable from '../components/TaskTable';

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState<string>('');
  const [dialogTitle, setDialogTitle] = useState<string>('');
  const tasksPerPage = 7;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Carregar Tarefas
  const fetchTasks = () => {
    setLoading(true);
    setLoadingMessage('Carregando tarefas...');
    axios
      .get(baseUrlTasks, { timeout: 15000 })
      .then((response) => {
        if (response.status === 200) {
          const dados = response.data;
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
          setFilteredTasks(sortedTasks);
        } else {
          setDialogMessage('Erro ao buscar tarefas no servidor!');
          setDialogTitle('Erro');
          setOpenErrorDialog(true);
        }
      })
      .catch((error) => {
        if (error.code === 'ECONNABORTED') {
          setDialogMessage('O servidor caiu por inatividade ou tempo limite de requisição! Por favor aguarde alguns momentos.');
          fetchTasks();
        } else {
          setDialogMessage('Erro ao conectar com o servidor!');
        }
        setDialogTitle('Erro');
        setOpenErrorDialog(true);
      })
      .finally(() => {
        if (!openErrorDialog) {
          setLoading(false);
          setLoadingMessage('');
        }
      });
  };

  // Pesquisa
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter((task) => task.nomeTarefa.toLowerCase().includes(query.toLowerCase())));
    }
  };

  const paginateTasks = (tasks: Task[]) => {
    const startIndex = (currentPage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    return tasks.slice(startIndex, endIndex);
  };

  // Criar Tarefa
  const handleCreate = (task: Task) => {
    setLoading(true);
    setLoadingMessage('Criando tarefa...');
  
    // Verificação para impedir Tarefas com mesmo nome
    const taskExists = tasks.some((existingTask) => existingTask.nomeTarefa === task.nomeTarefa);
    if (taskExists) {
      setDialogMessage('Já existe uma tarefa com esse nome!');
      setDialogTitle('Erro');
      setOpenErrorDialog(true);
      setLoading(false);
      return;
    }
  
    const taskToCreate = {
      nomeTarefa: task.nomeTarefa,
      custo: task.custo,
      dataLimite: task.dataLimite || '',
    };
  
    axios
      .post(baseUrlTasks, taskToCreate)
      .then((response) => {
        fetchTasks();
        if (response.status === 201) {
          setTasks([...tasks, response.data]);
          setDialogMessage('Tarefa criada com sucesso!');
          setDialogTitle('Sucesso');
          setOpenSuccessDialog(true);
          handleCloseDialog();
        } else {
          setDialogMessage('Erro ao criar tarefa no servidor!');
          setDialogTitle('Erro');
          setOpenErrorDialog(true);
        }
      })
      .catch((error) => {
        console.error(error);
        setDialogMessage('Erro ao conectar com o servidor!');
        setDialogTitle('Erro');
        setOpenErrorDialog(true);
      })
      .finally(() => {
        setLoading(false);
        setLoadingMessage('');
      });
  };
  
  // Editar Tarefa
  const handleEdit = () => {
    if (currentTask) {
      setLoading(true);
      setLoadingMessage('Editando tarefa...');
  
      // Verificação para impedir Tarefas com mesmo nome
      const taskExists = tasks.some(
        (existingTask) =>
          existingTask.nomeTarefa === currentTask.nomeTarefa && existingTask.id !== currentTask.id
      );
      if (taskExists) {
        setDialogMessage('Já existe uma tarefa com esse nome!');
        setDialogTitle('Erro');
        setOpenErrorDialog(true);
        setLoading(false);
        return;
      }
  
      axios
        .put(`${baseUrlTasks}/${currentTask.id}`, currentTask)
        .then((response) => {
          fetchTasks();
          if (response.status === 200) {
            setTasks(tasks.map((task) => task.id === currentTask.id ? response.data : task));
            setDialogMessage('Tarefa editada com sucesso!');
            setDialogTitle('Sucesso');
            setOpenSuccessDialog(true);
          } else {
            setDialogMessage('Erro ao editar tarefa no servidor!');
            setDialogTitle('Erro');
            setOpenErrorDialog(true);
          }
        })
        .catch((error) => {
          console.error(error);
          setDialogMessage('Erro ao conectar com o servidor!');
          setDialogTitle('Erro');
          setOpenErrorDialog(true);
        })
        .finally(() => {
          setLoading(false);
          setLoadingMessage('');
          handleCloseDialog();
        });
    }
  };

  // Deletar Tarefa
  const handleDelete = () => {
    if (taskToDelete) {
      setLoading(true);
      setLoadingMessage('Excluindo tarefa...');
      axios
        .delete(`${baseUrlTasks}/${taskToDelete.id}`)
        .then(() => {
          setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskToDelete.id));
          setDialogMessage('Tarefa excluída com sucesso!');
          setDialogTitle('Sucesso');
          setOpenSuccessDialog(true);
        })
        .catch((error) => {
          console.error(error);
          setDialogMessage('Erro ao conectar com o servidor!');
          setDialogTitle('Erro');
          setOpenErrorDialog(true);
        })
        .finally(() => {
          setLoading(false);
          setLoadingMessage('');
          setOpenConfirmDialog(false);
        });
    }
  };

  // Reordenação
  const handleReorder = (id: number, direction: 'up' | 'down') => {
    setDialogMessage("Em implementação...");
    setDialogTitle("Atenção");
    setOpenErrorDialog(true);
  };

  // Modal
  const handleOpenDialog = (task: Task) => {
    setCurrentTask(task);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTask(null);
  };

  // Confirmação de Deletação
  const openDeleteConfirmation = (task: Task) => {
    setTaskToDelete(task);
    setOpenConfirmDialog(true);
  };

  const closeDeleteConfirmation = () => {
    setOpenConfirmDialog(false);
    setTaskToDelete(null);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" sx={{ marginBottom: 3 }}>
        Lista de Fazeres
      </Typography>
      
      <SearchBar query={searchQuery} onSearch={handleSearch} />

      {loading && (
        <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            {loadingMessage}
          </Typography>
        </Box>
      )}

      <TaskTable
        tasks={tasks}
        filteredTasks={filteredTasks}
        paginateTasks={paginateTasks}
        handleOpenDialog={handleOpenDialog}
        openDeleteConfirmation={openDeleteConfirmation}
        handleReorder={handleReorder}
      />

      <PageSelector
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        tasksPerPage={tasksPerPage}
        tasks={tasks}
      />

      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={{ marginTop: 3, backgroundColor: 'green' }}
        onClick={() =>
          handleOpenDialog({
            id: 0,
            nomeTarefa: '',
            custo: 0,
            dataLimite: '',
            ordemApresentacao: tasks.length + 1,
          })}>
        Inserir Tarefa
      </Button>

      <Modal
        title={currentTask?.id ? 'Editar Tarefa' : 'Criar Tarefa'}
        open={openDialog}
        onCancel={handleCloseDialog}
        onOk={() => currentTask?.id ? handleEdit() : handleCreate(currentTask!)}
      >
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
          slotProps={{inputLabel: { shrink:true } }}
        />
      </Modal>

      <Dialog
        open={openConfirmDialog}
        onClose={closeDeleteConfirmation}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja excluir esta tarefa?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeDeleteConfirmation}
            sx={{ color: 'red' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            sx={{
              backgroundColor: 'green',
              color: 'white',
              '&:hover': {
                backgroundColor: 'darkgreen',
              },
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openErrorDialog}
        onClose={() => setOpenErrorDialog(false)}
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenErrorDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSuccessDialog}
        onClose={() => setOpenSuccessDialog(false)}
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSuccessDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;