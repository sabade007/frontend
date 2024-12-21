import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { ChatService } from 'src/app/service/chat.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { ToastrService } from "ngx-toastr";
import { LocalService } from "src/environments/local.service";
import { localData } from "src/environments/mimetypes";

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: [
    './create-group.component.scss',
    "./../../../../assets/chatstyles/dist/css/lib/bootstrap.min.css",
    "./../../../../assets/chatstyles/dist/css/swipe.min.css",
  ],
})
export class CreateChatGroupComponent implements OnInit {
  contactList: any;
  errorMessage: any;
  groupForm: any;
  participents: any = [];
  groupContacts: any = [];
  showGroupContacts: any = [];
  userId: string;
  userToken: string;
  token: string;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  filterContactList: any = [];
  clicked = false;
  userInput: any;
  @ViewChild("username") username: ElementRef<HTMLInputElement>;

  constructor(public createGroupComponent: MatDialogRef<CreateChatGroupComponent>,
    public chatService: ChatService,
    private fb: FormBuilder,
    private tosterService: ToastrService,
    private localService: LocalService
  ) { }

  ngOnInit() {
    this.groupForm = this.fb.group({
      gname: new FormControl('', [Validators.required]),
    });
    this.getContacts();
    this.userId = this.localService.getJsonValue(localData.chatId),
    this.userToken = this.localService.getJsonValue(localData.chatToken);
    this.token = this.localService.getJsonValue(localData.token);
  }

  initializeItems() {
    this.filterContactList = this.contactList;
    this.groupContacts = this.contactList;
  }

  closeChatBox() {
    this.createGroupComponent.close();
  }

  getContacts() {
    var data = {
      userToken: this.localService.getJsonValue(localData.chatToken),
      userId: this.localService.getJsonValue(localData.chatId),
    };
    this.chatService.searchChatContact(data).subscribe((result: any) => {
      this.contactList = result.users;
      this.filterContactList = result.users;
      // this.groupContacts = result.users;
      this.showGroupContacts = result.users;
    });
  }

  remove(data: any): void {
    const index = this.participents.indexOf(data);
    // this.groupContacts.push(data);
    if (index >= 0) {
      this.participents.splice(index, 1);
    }
  }

  setInputField(data) {
    this.userInput = data;
    console.log("SearchContactsInGroups", this.userInput)
    this.SearchContactsInGroups();
  }

  SearchContactsInGroups() {
    if(this.userInput == ""){
      this.groupContacts = [];
      return
    }
    else{
      var data = {
        searchName: this.userInput,
        userId: this.userId,
        userToken: this.userToken,
        roomId: null,
      }
      this.chatService.searchUser(data).subscribe((result:any)=>{
        console.log(result);
        this.groupContacts = result;
      })
    }
  }

  whileSearching() {
    this.groupContacts = this.showGroupContacts;
  }

  // add(event: MatChipInputEvent): void {
  //   const value = (event.value || "").trim();

  //   // Add our fruit
  //   if (value && this.groupContacts.length == 1) {
  //     var addContact = this.groupContacts[0];
  //     // this.participents.push(addContact);
  //     // this.afterAddParticipents(addContact.id);
  //   }

  //   // Clear the input value
  //   event.input.value = "";
  // }

  // addParticipents(event: MatAutocompleteSelectedEvent):void {
  //   console.log(event.option,'event');
  //   if (event.option.value) {
  //     this.participents.push(event.option.value);
  //   }
  //   this.afterAddParticipents(event.option.value.id);
  // }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event.option,'event');
    console.log(this.participents);
    this.participents.push(event.option.value);
    this.username.nativeElement.value = "";
    for (let i = 1; i < this.participents.length; i++) {
      let j = i - 1;
      if (this.participents[j].firstName == event.option.value.firstName) {
        this.remove(event.option.value);
        // this.errorMessage = event.option.value.firstName + " " + "is already exists";
        this.tosterService.error(event.option.value.firstName + " " + "is already exists")
      }
    }
    this.afterAddParticipents(event.option.value.id);
  }

  afterAddParticipents(ids: any) {
    console.log(ids);
    console.log(this.groupContacts);
    this.groupContacts = this.groupContacts.filter(function (p) {

      return p.id != ids;
    });
    console.log(this.groupContacts);
    this.showGroupContacts = this.groupContacts;
  }

  createNewGroup() {
    this.errorMessage = false;
    if (this.groupForm.value.gname == "") {
      this.tosterService.error("Group name is required.")
      // this.errorMessage = "Group name is required.";
      return;
    } else if (this.participents.length == 0) {
      this.tosterService.error("You should choose at least one participant from your contacts.")
      // this.errorMessage = "At least one participant should be selected.";
      return;
    } 
    else if (this.groupForm.value.gname.length > 30) {
      this.tosterService.error("Group name must be less than 30 character.")
      // this.errorMessage = "Group name must be less than 30 character.";
      return;
    }
    else{
      this.clicked = true;
      var request: any = {
        fileName: "string",
        message: "string",
        pageNo: 0,
        pageSize: 0,
        path: "string",
        receiverId: "string",
        receiverName: "string",
        roomId: "string",
        searchName: "string",
        timeStamp: "2022-02-08T04:21:04.058Z",
        toId: "string",
        userId: this.userId,
        userToken: this.userToken,
        groupName: this.groupForm.value.gname,
      };
      console.log(request);
      this.chatService.createGroup(request).subscribe((result: any) => {
        request["roomId"] = result.group.id;
        this.chatService.roomId = result.group.id;
        var participants = [];
        this.participents.forEach(function (p) {
          participants.push(p.userName);
        });
        request["addId"] = participants;
        this.addGroupMembers(request, result);
      });
    }
  }

  addGroupMembers(request, result) {
    this.chatService.addMembersToGroup(request).subscribe((result2: any) => {
      // this.chatWith(result.group, "groupList");
      // this.constactSelected = true;
      // this.createGroupPage = false;
      this.createGroupComponent.close({ chatWith: result.group, roomId: this.chatService.roomId, });
    });
  }

  closepopup() {
    this.createGroupComponent.close();
  }

}
