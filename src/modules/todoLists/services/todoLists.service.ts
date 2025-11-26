import { handleApiResponse } from "../../../shared/utils/api.utils";
import { CreateTodoListDto, TodoListResponseDto, UpdateTodoListDto } from "../types/todoLists.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class TodoListService {

  static async getAll(): Promise<TodoListResponseDto[]> {
    const response = await fetch(`${API_BASE_URL}/api/todolists`);
    return handleApiResponse<TodoListResponseDto[]>(response);
  }

  static async getById(id: number): Promise<TodoListResponseDto> {
    const response = await fetch(`${API_BASE_URL}/api/todolists/${id}`);
    return handleApiResponse<TodoListResponseDto>(response);
  }

  static async create(payload: CreateTodoListDto): Promise<TodoListResponseDto> {
    const response = await fetch(`${API_BASE_URL}/api/todolists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return handleApiResponse<TodoListResponseDto>(response);
  }

  static async update(id: number, payload: UpdateTodoListDto): Promise<TodoListResponseDto> {
    const response = await fetch(`${API_BASE_URL}/api/todolists/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return handleApiResponse<TodoListResponseDto>(response);
  }

  static async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/todolists/${id}`, {
      method: 'DELETE',
    });
    return handleApiResponse<void>(response);
  }
}