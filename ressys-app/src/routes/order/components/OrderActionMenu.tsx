import { Menu, MenuItem } from '@mui/material';

export enum OrderMenuAction {
  Edit,
  Cancel,
  Confirm,
  Complete,
}

export interface OrderActionMenuItemData<T> {
  label: string;
  action: OrderMenuAction;
  data?: T;
}

interface OrderActionMenuProps<T> {
  items: OrderActionMenuItemData<T>[];
  anchorEl?: HTMLElement | null;
  onClose?: () => void;
  onClickMenuItem?: (menuItem: OrderActionMenuItemData<T>) => void;
}

export function OrderActionMenu<T>({
  items,
  anchorEl,
  onClose,
  onClickMenuItem,
}: OrderActionMenuProps<T>): JSX.Element {
  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      {...items.map((item) => (
        <MenuItem
          key={item.action}
          onClick={() => (onClickMenuItem ? onClickMenuItem(item) : undefined)}
        >
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  );
}
