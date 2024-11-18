import React from 'react';
import { Box, Pagination } from '@mui/material';
import { Task } from '../util/types';

interface PageSelectorProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  tasksPerPage: number;
  tasks: Task[];
}

const PageSelector: React.FC<PageSelectorProps> = ({
  currentPage,
  setCurrentPage,
  tasksPerPage,
  tasks,
}) => {
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        shape="rounded"
        color="primary"
        siblingCount={1}
        boundaryCount={1}
      />
    </Box>
  );
};

export default PageSelector;
