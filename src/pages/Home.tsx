import React, { useState, useEffect, useCallback } from 'react';
import { Button, Box, CircularProgress, Typography, TextField } from '@mui/material';
import { Modal } from 'antd';
import { baseUrlTasks } from '../util/constants';
import { Task } from '../util/types';
import axios from 'axios';
import PageSelector from '../components/PageSelector';
import SearchBar from '../components/SearchBar';
import TaskTable from '../components/TaskTable';
import DialogMessage from '../components/DialogMessage';
import { useForm, Controller } from 'react-hook-form';

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
  const [dialogMessage, setDialogMessage] = useState<string>('');
  const [dialogTitle, setDialogTitle] = useState<string>('');
  const [errorDisplayed, setErrorDisplayed] = useState(false);
  const tasksPerPage = 7;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // React Hook Form
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      nomeTarefa: '',
      custo: 0,
      dataLimite: '',
    }
  });

  // Carregar Tarefas
  const fetchTasks = useCallback(() => {
    setLoading(true);
    setLoadingMessage('Carregando tarefas...');
    axios
      .get(baseUrlTasks, { timeout: 15000 }) // 15 segundos e então mostra o erro
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
        if (error.code === 'ECONNABORTED' && !errorDisplayed) {
          setDialogMessage('O servidor caiu por inatividade! Por favor aguarde um pouco até o servidor reiniciar. O processo pode levar alguns minutos.');
          setDialogTitle('Erro');
          setOpenErrorDialog(true);
          setErrorDisplayed(true);
        } else if (!errorDisplayed) {
          setDialogMessage('Erro ao conectar com o servidor!');
          setDialogTitle('Erro');
          setOpenErrorDialog(true);
          setErrorDisplayed(true);
        }
      })
      .finally(() => {
        if (!openErrorDialog) {
          setLoading(false);
          setLoadingMessage('');
        }
      });
  }, [openErrorDialog, errorDisplayed]);

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
  const handleCreate = (data: any) => {
    setLoading(true);
    setLoadingMessage('Criando tarefa...');

    // Verificação para impedir Tarefas com mesmo nome
    const taskExists = tasks.some((existingTask) => existingTask.nomeTarefa === data.nomeTarefa);
    if (taskExists) {
      setDialogMessage('Já existe uma tarefa com esse nome!');
      setDialogTitle('Erro');
      setOpenErrorDialog(true);
      setLoading(false);
      return;
    }

    const taskToCreate = {
      nomeTarefa: data.nomeTarefa,
      custo: data.custo,
      dataLimite: data.dataLimite || '',
    };

    axios
      .post(baseUrlTasks, taskToCreate)
      .then((response) => {
        fetchTasks();
        if (response.status === 201) {
          setTasks([...tasks, response.data]);
          setDialogMessage('Tarefa criada com sucesso!');
          setDialogTitle('Sucesso');
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
  const handleEdit = (data: any) => {
    if (currentTask) {
      setLoading(true);
      setLoadingMessage('Editando tarefa...');

      // Verificação para impedir Tarefas com mesmo nome
      const taskExists = tasks.some(
        (existingTask) =>
          existingTask.nomeTarefa === data.nomeTarefa && existingTask.id !== currentTask.id
      );
      if (taskExists) {
        setDialogMessage('Já existe uma tarefa com esse nome!');
        setDialogTitle('Erro');
        setOpenErrorDialog(true);
        setLoading(false);
        return;
      }

      axios
        .put(`${baseUrlTasks}/${currentTask.id}`, data)
        .then((response) => {
          fetchTasks();
          if (response.status === 200) {
            setTasks(tasks.map((task) => task.id === currentTask.id ? response.data : task));
            setDialogMessage('Tarefa editada com sucesso!');
            setDialogTitle('Sucesso');
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
          fetchTasks();
          setDialogMessage('Tarefa excluída com sucesso!');
          setDialogTitle('Sucesso');
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
    const taskIndex = tasks.findIndex((task) => task.id === id);
  
    if ((direction === 'up' && taskIndex === 0) || (direction === 'down' && taskIndex === tasks.length - 1)) {
      return;
    }
  
    const newTasks = [...tasks];
    const swapIndex = direction === 'up' ? taskIndex - 1 : taskIndex + 1;
  
    // Troca a ordem das tarefas
    [newTasks[taskIndex], newTasks[swapIndex]] = [newTasks[swapIndex], newTasks[taskIndex]];
  
    newTasks[taskIndex].ordemApresentacao = taskIndex + 1;
    newTasks[swapIndex].ordemApresentacao = swapIndex + 1;
  
    setTasks(newTasks);
    setFilteredTasks(newTasks);
  
    // Salvar reordenação no back
    axios
      .put(`${baseUrlTasks}/reorder`, newTasks)
      .then(() => {
        console.log('Sucesso');
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  // Modal
  const handleOpenDialog = (task: Task) => {
    setCurrentTask(task);
    reset(task);
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
  }, [fetchTasks]);

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
        onOk={handleSubmit(currentTask?.id ? handleEdit : handleCreate)}
      >
        <form onSubmit={handleSubmit(currentTask?.id ? handleEdit : handleCreate)}>
          <Controller
            name="nomeTarefa"
            control={control}
            rules={{ required: 'O nome da tarefa é obrigatório' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nome da Tarefa"
                fullWidth
                margin="normal"
                error={!!errors.nomeTarefa}
                helperText={errors.nomeTarefa?.message}
              />
            )}
          />

          <Controller
            name="custo"
            control={control}
            rules={{
              required: 'O custo é obrigatório e deve ser um número válido.',
              validate: {
                isNumber: (value) => !isNaN(value) || 'O custo deve ser um número',
                isPositive: (value) => value >= 0 || 'O custo não pode ser negativo',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Custo (R$)"
                fullWidth
                margin="normal"
                type="number"
                error={!!errors.custo}
                helperText={errors.custo?.message}
              />
            )}
          />

          <Controller
            name="dataLimite"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Data Limite"
                fullWidth
                margin="normal"
                type="date"
                slotProps={{inputLabel: { shrink:true } }}
              />
            )}
          />
        </form>
      </Modal>

      <DialogMessage
        open={openConfirmDialog}
        onClose={closeDeleteConfirmation}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir a tarefa "${taskToDelete?.nomeTarefa}"?`}
        onConfirm={handleDelete}
        onCancel={closeDeleteConfirmation}
      />

      {dialogMessage && (
        <DialogMessage
          open={true}
          onClose={() => setDialogMessage('')}
          title={dialogTitle}
          message={dialogMessage}
        />
      )}
    </Box>
  );
};

export default Home;