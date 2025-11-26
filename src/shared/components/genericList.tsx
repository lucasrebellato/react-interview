import { List, ListItem, ListItemButton, ListItemText, IconButton, Menu, MenuItem, Checkbox } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState, MouseEvent } from 'react';

export interface ListAction {
  label: string;
  onClick: () => void;
}

export interface GenericListItem {
  id: number;
  primaryText: string;
  secondaryText?: string;
  isCompleted?: boolean;
}

interface GenericListProps {
  items: GenericListItem[];
  onItemClick?: (id: number) => void;
  actions?: (item: GenericListItem) => ListAction[];
  showCheckbox?: boolean;
  onCheckboxChange?: (id: number, checked: boolean) => void;
}

export default function GenericList({ 
  items, 
  onItemClick, 
  actions, 
  showCheckbox = false,
  onCheckboxChange 
}: GenericListProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<GenericListItem | null>(null);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>, item: GenericListItem) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleActionClick = (action: ListAction) => {
    action.onClick();
    handleMenuClose();
  };

  return (
    <>
      <List>
        {items.map((item) => (
          <ListItem
            key={item.id}
            secondaryAction={
              actions && (
                <IconButton 
                  edge="end" 
                  onClick={(e) => handleMenuOpen(e, item)}
                >
                  <MoreVertIcon />
                </IconButton>
              )
            }
            disablePadding
          >
            <ListItemButton onClick={() => onItemClick?.(item.id)}>
              {showCheckbox && (
                <Checkbox
                  edge="start"
                  checked={item.isCompleted || false}
                  onChange={(e) => {
                    e.stopPropagation();
                    onCheckboxChange?.(item.id, e.target.checked);
                  }}
                  sx={{ mr: 2 }}
                />
              )}
              <ListItemText
                primary={item.primaryText}
                secondary={item.secondaryText}
                sx={{
                  textDecoration: item.isCompleted ? 'line-through' : 'none',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedItem && actions?.(selectedItem).map((action, index) => (
          <MenuItem key={index} onClick={() => handleActionClick(action)}>
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}