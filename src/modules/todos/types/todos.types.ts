export interface TodoResponseDto {
  id: number;
  title: string;
  todoListId: number;
  description: string;
  isCompleted: boolean;
}

export interface CreateTodoDto {
  title: string;
  description: string; 
}

export interface UpdateTodoDto {
  title: string;
  description: string;
}