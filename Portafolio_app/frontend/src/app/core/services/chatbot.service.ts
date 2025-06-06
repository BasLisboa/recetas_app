// client/src/app/services/chatbot.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  //private apiUrl = 'http://localhost:3000/api/chatbot';

  constructor(private http: HttpClient) {}

  sendMessage(userId: string, message: string) {
    return this.http.post<{ reply: string }>(`${environment.apiUrl}/chatbot/message`, { userId, message });
  }
}
