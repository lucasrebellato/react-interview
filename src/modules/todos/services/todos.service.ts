// ...existing code...
import { handleApiResponse } from '../../../shared/utils/api.utils';
import { CreateTodoDto, TodoResponseDto, UpdateTodoDto } from '../types/todos.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class TodoService {
  static async create(todoListId: number, payload: CreateTodoDto): Promise<TodoResponseDto> {
    const response = await fetch(`${API_BASE_URL}/api/todolists/${todoListId}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleApiResponse<TodoResponseDto>(response);
  }

  static async getById(todoListId: number, id: number): Promise<TodoResponseDto> {
    const response = await fetch(`${API_BASE_URL}/api/todolists/${todoListId}/todos/${id}`);
    return handleApiResponse<TodoResponseDto>(response);
  }

  static async update(todoListId: number, id: number, payload: UpdateTodoDto): Promise<TodoResponseDto> {
    const response = await fetch(`${API_BASE_URL}/api/todolists/${todoListId}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleApiResponse<TodoResponseDto>(response);
  }

  static async delete(todoListId: number, id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/todolists/${todoListId}/todos/${id}`, {
      method: 'DELETE',
    });
    return handleApiResponse<void>(response);
  }

  static async markAsCompleted(todoListId: number, id: number): Promise<TodoResponseDto> {
    const response = await fetch(`${API_BASE_URL}/api/todolists/${todoListId}/todos/${id}/complete`, {
      method: 'PUT',
    });
    return handleApiResponse<TodoResponseDto>(response);
  }

  static async markAsUncompleted(todoListId: number, id: number): Promise<TodoResponseDto> {
    const response = await fetch(`${API_BASE_URL}/api/todolists/${todoListId}/todos/${id}/incomplete`, {
      method: 'PUT',
    });
    return handleApiResponse<TodoResponseDto>(response);
  }

  static async markAllAsCompleted(todoListId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/todolists/${todoListId}/todos/complete-all`, {
      method: 'PUT',
    });
    return handleApiResponse<void>(response);
  }
}