import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { Edit, Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { TaskTableProps } from '../util/types';

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  filteredTasks,
  paginateTasks,
  handleOpenDialog,
  openDeleteConfirmation,
  handleReorder,
}) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Nome</strong></TableCell>
            <TableCell><strong>Custo (R$)</strong></TableCell>
            <TableCell><strong>Data Limite</strong></TableCell>
            <TableCell><strong>Ações</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginateTasks(filteredTasks).map((task) => (
            <TableRow
              key={task.id}
              sx={{
                '&:hover': {
                  backgroundColor: '#f1f1f1',
                },
                backgroundColor: task.custo >= 1000 ? 'yellow' : 'transparent',
              }}
            >
              <TableCell>{task.nomeTarefa}</TableCell>
              <TableCell>{task.custo}</TableCell>
              <TableCell>{task.dataLimite}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpenDialog(task)} sx={{ color: 'primary.main' }}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => openDeleteConfirmation(task)} sx={{ color: 'error.main' }}>
                  <Delete />
                </IconButton>
                <IconButton onClick={() => handleReorder(task.id, 'up')} sx={{ color: 'primary.main' }}>
                  <ArrowUpward />
                </IconButton>
                <IconButton onClick={() => handleReorder(task.id, 'down')} sx={{ color: 'primary.main' }}>
                  <ArrowDownward />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTable;