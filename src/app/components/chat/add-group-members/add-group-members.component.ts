import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ChatService } from 'src/app/service/chat.service';
import { environment } from 'src/environments/environment.prod';
import { LocalService } from 'src/environments/local.service';
import { localData } from 'src/environments/mimetypes';

@Component({
  selector: 'app-add-group-members',
  templateUrl: './add-group-members.component.html',
  styleUrls: ['./add-group-members.component.scss',
    "./../../../../assets/chatstyles/dist/css/lib/bootstrap.min.css",
    "./../../../../assets/chatstyles/dist/css/swipe.min.css",
  ],
})

export class AddGroupMembersComponent implements OnInit {
  
  contactList: any;
  filterContactList: any;
  groupContacts: any;
  showGroupContacts: any;
  participents: any = [];
  userId: string;
  userToken: string;
  token: string;
  groupForm: any;
  errorMessage: any;
  addOnBlur = true;
  productName = environment.productname;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  
  constructor(public addGroupMembersComponent: MatDialogRef<AddGroupMembersComponent>,
    public chatService: ChatService,
    private fb: FormBuilder,
    private tosterService: ToastrService,
    private localService: LocalService,
    @Inject(MAT_DIALOG_DATA) public data:any,) { }

  ngOnInit() {
    // this.getContacts();
    this.userId = this.localService.getJsonValue(localData.chatId);
    this.userToken = this.localService.getJsonValue(localData.chatToken);
    this.token = this.localService.getJsonValue(localData.token);

    this.groupForm = this.fb.group({
      groupMembers: new FormControl(""),
    });
  }

  initializeItems() {
    this.filterContactList = this.contactList;
    this.groupContacts = this.contactList;
  }

  closeAddMembers() {
    this.addGroupMembersComponent.close();
  }

  getContacts() {
    var data = {
      roomId: this.data.groupId,
      userToken: this.localService.getJsonValue(localData.chatToken),
      userId: this.localService.getJsonValue(localData.chatId),
    };
    this.chatService.filteredContactList(data).subscribe((result: any) => {
      this.contactList = result.users;
      this.filterContactList = result.users;
      this.groupContacts = result.users;
      this.showGroupContacts = result.users;
    });
  }

  remove(data: any): void {
    const index = this.participents.indexOf(data);
    this.groupContacts.push(data);
    if (index >= 0) {
      this.participents.splice(index, 1);
    }
  }

  SearchContactsInGroups(ev) {
    // Reset items back to all of the items
    // this.whileSearching();

    // set val to the value of the ev target
    // var val = ev.target.value;

    // if the value is an empty string don't filter the items
    // if (val && val.trim() != "") {
    //   this.groupContacts = this.groupContacts.filter((item) => {
    //     return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
    //   });
    // }

    var data = {
      searchName: ev.target.value,
      userId: this.userId,
      userToken: this.userToken,
      roomId: this.data.groupId,
    }
    this.chatService.searchUser(data).subscribe((result:any)=>{
      console.log(result);
      this.groupContacts = result;
    })
  }

  whileSearching() { 
    this.groupContacts = this.showGroupContacts;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();

    // Add our fruit
    if (value && this.groupContacts.length == 1) {
      var addContact = this.groupContacts[0];
      // this.participents.push(addContact);
      // this.afterAddParticipents(addContact.id);
    }

    // Clear the input value
    event.input.value = "";
  }

  addParticipents(value) {
    if (value) {
      this.participents.push(value);
    }
    this.afterAddParticipents(value.id);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event.option,'event');
    console.log(this.participents);
    this.participents.push(event.option.value);
    // this.username.nativeElement.value = "";
    for (let i = 1; i < this.participents.length; i++) {
      let j = i - 1;
      if (this.participents[j].firstName == event.option.value.firstName) {
        this.remove(event.option.value);
        this.tosterService.error(event.option.value.firstName + " " + "is already exists")
        // this.errorMessage = event.option.value.firstName + " " + "is already exits";
      }
    }
    this.afterAddParticipents(event.option.value.id);
  }
  
  afterAddParticipents(ids: any) {
    console.log(ids);
    this.groupContacts = this.groupContacts.filter(function (p) {
      return p.id != ids;
    });
    console.log(this.groupContacts);
    this.showGroupContacts = this.groupContacts;
  }

  addGroupMembers() {

    if (this.participents.length == 0) {
      this.tosterService.error("You should choose at least one participant from your contacts.")
      // this.errorMessage = "At least one participant should be selected.";
      return;
    }

    this.errorMessage = false;

    var participants = [];
    this.participents.forEach(function (p) {
      participants.push(p.userName);
    });

    var request: any = {
      addId: participants,
      fileName: "string",
      message: "string",
      pageNo: 0,
      pageSize: 0,
      path: "string",
      receiverId: "string",
      receiverName: "string",
      roomId: this.data.groupId,
      searchName: "string",
      timeStamp: "2022-02-08T04:21:04.058Z",
      toId: "string",
      userId: this.userId,
      userToken: this.userToken,
      groupName: this.groupForm.value.groupName,
    };

    this.chatService.addMembersToGroup(request).subscribe((result2: any) => {
      this.addGroupMembersComponent.close();
    });
  }
}
