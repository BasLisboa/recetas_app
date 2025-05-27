// client/src/app/services/chatbot.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private apiUrl = 'http://localhost:3000/api/chatbot';

  constructor(private http: HttpClient) {}

  sendMessage(userId: string, message: string) {
    return this.http.post<{ reply: string }>(`${this.apiUrl}/message`, { userId, message });
  }
}
