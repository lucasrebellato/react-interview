import { TodoResponseDto } from "../../todos/types/todos.types";

export interface TodoListResponseDto {
  id: number;
  name: string;
  todos: TodoResponseDto[];
}

export interface CreateTodoListDto {
  name: string;
}

export interface UpdateTodoListDto {
  name?: string;
}