export interface Task {
    id: number;
    nomeTarefa: string;
    custo: number;
    dataLimite: string;
    ordemApresentacao: number;
}

export interface PageSelectorProps {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    tasksPerPage: number;
    tasks: Task[];
}

export interface SearchBarProps {
    query: string;
    onSearch: (query: string) => void;
}

export interface TaskTableProps {
    tasks: Task[];
    filteredTasks: Task[];
    paginateTasks: (tasks: Task[]) => Task[];
    handleOpenDialog: (task: Task) => void;
    openDeleteConfirmation: (task: Task) => void;
    handleReorder: (id: number, direction: 'up' | 'down') => void;
}

export interface DialogMessageProps {
    open: boolean;
    onClose: () => void;
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}