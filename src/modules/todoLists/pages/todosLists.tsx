import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import toast from 'react-hot-toast';

import GenericList, { GenericListItem, ListAction } from '../../../shared/components/genericList';
import { TodoListService } from '../services/todoLists.service';
import GenericButton from '../../../shared/components/genericButton';
import GenericDialog from '../../../shared/components/genericDialog';
import GenericTitle from '../../../shared/components/genericTitle';
import GenericForm from '../../../shared/components/genericForm';


export default function HomePage() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [listName, setListName] = useState('');
  const [editingItem, setEditingItem] = useState<GenericListItem | null>(null);
  const [todoLists, setTodoLists] = useState<GenericListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [originalLists, setOriginalLists] = useState<any[]>([]);
  const [formValid, setFormValid] = useState(false);

  const loadTodoLists = async () => {
    try {
      setLoading(true);
      const data = await TodoListService.getAll();
      setOriginalLists(data);

      const mappedData: GenericListItem[] = data.map(list => ({
        id: list.id,
        primaryText: list.name || 'Sin nombre',
        secondaryText: `${list.todos?.length || 0} tareas`,
      }));
      setTodoLists(mappedData);
    } catch (error) {
      toast.error('Error al cargar las listas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodoLists();
  }, []);

  const handleListClick = (id: number) => {
    const selected = originalLists.find(l => l.id === id);
    navigate(`/todolists/${id}`, {
      state: {
        todos: selected?.todos ?? [],
        listName: selected?.name ?? 'Lista',
      },
    });
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setListName('');
    setOpenDialog(true);
  };

  const handleOpenEdit = (item: GenericListItem) => {
    setEditingItem(item);
    setListName(item.primaryText);
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await TodoListService.update(editingItem.id, { name: listName });
        toast.success('Lista actualizada correctamente');
      } else {
        await TodoListService.create({ name: listName });
        toast.success('Lista creada correctamente');
      }
      setOpenDialog(false);
      await loadTodoLists();
    } catch (error) {
      toast.error('Error al guardar la lista');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await TodoListService.delete(id);
      toast.success('Lista eliminada correctamente');
      await loadTodoLists();
    } catch (error) {
      toast.error('Error al eliminar la lista');
    }
  };

  const getListActions = (item: GenericListItem): ListAction[] => [
    { label: 'Editar', onClick: () => handleOpenEdit(item) },
    { label: 'Eliminar', onClick: () => handleDelete(item.id) },
  ];

  if (loading) {
    return (
      <Container>
        <Typography>Cargando...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <GenericTitle text="Mis Listas" sx={{ mb: 2 }} />

      <GenericButton
        text="Nueva Lista"
        onClick={handleOpenCreate}
        icon={<AddIcon />}
        sx={{ mb: 2 }}
      />

      <GenericList
        items={todoLists}
        onItemClick={handleListClick}
        actions={getListActions}
      />

      <GenericDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title={editingItem ? 'Editar Lista' : 'Nueva Lista'}
        onSubmit={handleSubmit}
        submitDisabled={!formValid}
      >
        <GenericForm
          fields={[
            { label: 'Nombre de la lista', 
              value: listName, 
              onChange: setListName, 
              required: true,
              requiredMessage: 'El nombre de la lista es obligatorio'
            },
          ]}
          onValidityChange={setFormValid}
          validateOnMount={false}
        />
      </GenericDialog>
    </Container>
  );
}