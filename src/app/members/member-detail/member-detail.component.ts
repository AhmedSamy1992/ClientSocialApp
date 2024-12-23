import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../_modules/member';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { DatePipe } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
import { MemberMessageComponent } from "../member-message/member-message.component";
import { MessageService } from '../../_services/message.service';
import { Message } from '../../_modules/message';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule, DatePipe, TimeagoModule, MemberMessageComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs') memberTabs?: TabsetComponent;
  private messageService = inject(MessageService);
  private memberService = inject(MembersService);
  private route = inject(ActivatedRoute);
  member?: Member;
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
  messages: Message[] = [];
  

  ngOnInit(): void {
     this.loadMember(); 
  }
  

  loadMember(){
    const username = this.route.snapshot.paramMap.get('username');
    if(!username) return
    this.memberService.getMember(username).subscribe({
      next: member => 
        {
          this.member = member;
          member.photos.map(p => {
            this.images.push(new ImageItem({src: p.url, thumb: p.url}))
          })
        }
    })

  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length == 0 && this.member) {
      this.messageService.getMessageThread(this.member.username).subscribe({
        next: messages => this.messages = messages
      })
  }
}

onUpdateMessage(event: Message){
  this.messages.push(event);
}

selectTab(heading: string) {
  if (this.memberTabs) {
    const messageTab = this.memberTabs.tabs.find(x => x.heading === heading);
    if (messageTab) messageTab.active = true;
  }
}


}

