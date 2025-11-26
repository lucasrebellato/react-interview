import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import AddIcon from '@mui/icons-material/Add';
import toast from 'react-hot-toast';

import GenericList, { GenericListItem, ListAction } from '../../../shared/components/genericList';
import { TodoService } from '../services/todos.service';
import { TodoListService } from '../../todoLists/services/todoLists.service';
import GenericTitle from '../../../shared/components/genericTitle';
import GenericButton from '../../../shared/components/genericButton';
import GenericDialog from '../../../shared/components/genericDialog';
import GenericForm from '../../../shared/components/genericForm';
import { useSignalRContext } from '../../../contexts/SignalRContext';


export default function TodoListPage() {
  const { onTodoCompleted } = useSignalRContext();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  const [todoDescription, setTodoDescription] = useState('');
  const [editingItem, setEditingItem] = useState<GenericListItem | null>(null);
  const [todos, setTodos] = useState<GenericListItem[]>([]);
  const [listName, setListName] = useState('');
  const [loading, setLoading] = useState(true);
  const [completingAll, setCompletingAll] = useState(false); 

  const allCompleted = todos.length > 0 && todos.every(t => t.isCompleted);

  const handleRealtimeCompleted = useCallback((payload: number | number[]) => {
    console.log('📡 SignalR - TodoCompleted recibido:', payload);
    const ids = Array.isArray(payload) ? payload : [payload];
    setTodos(prev => prev.map(t => (ids.includes(t.id) ? { ...t, isCompleted: true } : t)));
  }, []);


  useEffect(() => {
    const unsubscribe = onTodoCompleted(handleRealtimeCompleted);
    return unsubscribe;
  }, [onTodoCompleted, handleRealtimeCompleted]);

  
  const loadTodos = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const listData = await TodoListService.getById(Number(id));
      setListName(listData.name);
      const mappedTodos: GenericListItem[] = (listData.todos || []).map(todo => ({
        id: todo.id,
        primaryText: todo.title,
        secondaryText: todo.description,
        isCompleted: todo.isCompleted,
      }));
      setTodos(mappedTodos);
    } catch (error: any) {
      if (String(error).includes('404')) {
        navigate('/404');
        return;
      }
      toast.error('Error al cargar las tareas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [id]);

  const handleCheckboxChange = async (todoId: number, checked: boolean) => {
    if (!id) return;
    setTodos(prev => prev.map(t => (t.id === todoId ? { ...t, isCompleted: checked } : t)));
    try {
      if (checked) {
        await TodoService.markAsCompleted(Number(id), todoId);
        toast.success('Tarea marcada como completada');
      } else {
        await TodoService.markAsUncompleted(Number(id), todoId);
        toast.success('Tarea marcada como incompleta');
      }
    } catch (error) {
      setTodos(prev => prev.map(t => (t.id === todoId ? { ...t, isCompleted: !checked } : t)));
      toast.error('Error al actualizar la tarea');
      console.error(error);
    }
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setTodoTitle('');
    setTodoDescription('');
    setOpenDialog(true);
  };

  const handleOpenEdit = (item: GenericListItem) => {
    setEditingItem(item);
    setTodoTitle(item.primaryText);
    setTodoDescription(item.secondaryText || '');
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!id) return;
    try {
      if (editingItem) {
        await TodoService.update(Number(id), editingItem.id, {
          title: todoTitle,
          description: todoDescription,
        });
        toast.success('Tarea actualizada correctamente');
      } else {
        await TodoService.create(Number(id), {
          title: todoTitle,
          description: todoDescription,
        });
        toast.success('Tarea creada correctamente');
      }
      setOpenDialog(false);
      await loadTodos(); 
    } catch (error) {
      toast.error('Error al guardar la tarea');
      console.error(error);
    }
  };

  const handleDelete = async (todoId: number) => {
    if (!id) return;
    try {
      await TodoService.delete(Number(id), todoId);
      toast.success('Tarea eliminada correctamente');
      await loadTodos(); // fuerza recarga desde backend
    } catch (error) {
      toast.error('Error al eliminar la tarea');
      console.error(error);
    }
  };

  const handleMarkAllAsCompleted = async () => {
    if (!id) return;
    try {
      setCompletingAll(true);
      await TodoService.markAllAsCompleted(Number(id));
      toast.success('Marcando todas las tareas como completadas...');
    } catch (error) {
      toast.error('Error al marcar todas como completadas');
      console.error(error);
    } finally {
      setCompletingAll(false);
    }
  };

  const getTodoActions = (item: GenericListItem): ListAction[] => [
    {
      label: 'Editar',
      onClick: () => handleOpenEdit(item),
    },
    {
      label: 'Eliminar',
      onClick: () => handleDelete(item.id),
    },
  ];

  if (loading) {
    return (
      <Container>
        <GenericTitle text="Cargando..." />
      </Container>
    );
  }

  return (
    <Container>
      <GenericTitle text={listName} sx={{ mb: 2 }} />

      <GenericButton
        text="Nueva Tarea"
        onClick={handleOpenCreate}
        icon={<AddIcon />}
        sx={{ mb: 2, mr: 2 }}
      />
      
      <GenericButton
        text="Completar Todas"
        onClick={handleMarkAllAsCompleted}
        color="secondary"
        sx={{ mb: 2 }}
        disabled={completingAll || allCompleted || todos.length === 0}
      />

      <GenericList
        items={todos}
        showCheckbox
        onCheckboxChange={handleCheckboxChange}
        actions={getTodoActions}
      />

      <GenericDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title={editingItem ? 'Editar Tarea' : 'Nueva Tarea'}
        onSubmit={handleSubmit}
      >
        <GenericForm
          fields={[
            {
              label: 'Título',
              value: todoTitle,
              onChange: setTodoTitle,
            },
            {
              label: 'Descripción',
              value: todoDescription,
              onChange: setTodoDescription,
              multiline: true,
              rows: 3,
            },
          ]}
        />
      </GenericDialog>
    </Container>
  );
}