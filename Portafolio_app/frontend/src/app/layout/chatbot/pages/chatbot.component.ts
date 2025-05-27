// client/src/app/chatbot/chatbot.component.ts
import { ChatbotService } from 'src/app/core/services/chatbot.service';
import { v4 as uuidv4 } from 'uuid';
import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  standalone: true,
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  imports: [CommonModule, FormsModule], 
})
export class ChatbotComponent{
  userId = localStorage.getItem('chatbot_user_id') || uuidv4();
  messages: { role: string, content: string }[] = [
    { role: 'assistant', content: 'Hola, ¿en qué puedo ayudarte?' }
  ];
  userMessage = '';
  loading = false;

  constructor(private chatbotService: ChatbotService) {
    localStorage.setItem('chatbot_user_id', this.userId);
  }

  

  sendMessage() {
    if (!this.userMessage.trim()) return;

    this.messages.push({ role: 'user', content: this.userMessage });
    const msg = this.userMessage;
    this.userMessage = '';
    this.loading = true;

    this.chatbotService.sendMessage(this.userId, msg).subscribe({
      next: (res) => {
        this.messages.push({ role: 'assistant', content: res.reply });
        this.loading = false;
      },
      error: (err) => {
        this.messages.push({ role: 'assistant', content: 'Error al conectar con el bot.' });
        this.loading = false;
      }
    });
  }
}

