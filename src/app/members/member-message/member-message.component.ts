import { Component, inject, input, OnInit, output, Output, ViewChild } from '@angular/core';
import { MessageService } from '../../_services/message.service';
import { FormsModule, NgForm } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { Message } from '../../_modules/message';

@Component({
  selector: 'app-member-message',
  standalone: true,
  imports: [TimeagoModule, FormsModule],
  templateUrl: './member-message.component.html',
  styleUrl: './member-message.component.css'
})
export class MemberMessageComponent{
  @ViewChild('messageForm') messageForm?: NgForm;
  // @ViewChild('scrollMe') scrollContainer?: any;
  messageService = inject(MessageService);
  username = input.required<string>();
  messageContent = '';
  loading = false;
  messages = input.required<Message[]>();
  updateMessage = output<Message>();

  sendMessage() {
    // this.loading = true;
    this.messageService.sendMessage(this.username(), this.messageContent).subscribe({
      next: message => {
        this.updateMessage.emit(message);
        this.messageForm?.reset();
      }
    })
  }

}
