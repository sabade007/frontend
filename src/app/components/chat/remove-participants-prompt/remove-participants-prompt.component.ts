import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-participants-prompt',
  templateUrl: './remove-participants-prompt.component.html',
  styleUrls: ['./remove-participants-prompt.component.scss'],
})
export class RemoveParticipantsPromptComponent implements OnInit {

  userName: any;

  constructor(public addGroupMembersComponent: MatDialogRef<RemoveParticipantsPromptComponent>,
              @Inject(MAT_DIALOG_DATA) public data ,
              public dialogRef: MatDialogRef<RemoveParticipantsPromptComponent>,) {}

  ngOnInit() {
    this.userName = this.data.userName ;
    console.log("userName", this.userName)
  }

  remove() {
    this.addGroupMembersComponent.close({status: true});
  }

  closepopup() {
    this.addGroupMembersComponent.close({status: false});
  }

}
