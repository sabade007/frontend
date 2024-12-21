import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { PopoverController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { ChatService } from 'src/app/service/chat.service';
import { LocalService } from 'src/environments/local.service';
import { localData } from 'src/environments/mimetypes';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.scss'],
})
export class NewChatComponent implements OnInit {

  groupForm: any;
  contactList: any;
  errorMessage: any;
  participents: any = [];
  groupContacts: any = [];
  showGroupContacts: any = [];
  userId: string;
  userToken: string;
  token: string;
  addOnBlur = true;
  inContactChat : boolean = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  filterContactList: any = [];
  userInput: any;

  constructor(public chatService: ChatService,
              private fb: FormBuilder,
              private tosterService: ToastrService,
              private localService: LocalService,
              private popoverController: PopoverController) { }

  ngOnInit() {
    this.groupForm = this.fb.group({
      groupMembers: new FormControl(""),
    });
    this.userId = this.localService.getJsonValue(localData.chatId);
    this.userToken = this.localService.getJsonValue(localData.chatToken);
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
    var data = {
      receiverName: event.option.value.userName,
      roomId: null,
      userToken: this.userToken,
      userId: this.userId 
    };
    this.chatService.addToContact(data).subscribe((result) => {
      let contactDetails = result
      setTimeout(() => {
        this.popoverController.dismiss(contactDetails);
      }, 500);
    });
    // if(event.option.value.inContact == true){
    //   this.inContactChat = true;
    //   this.tosterService.success("In contact");
      
    // }
    // else if(event.option.value.inContact == false){
    //   this.tosterService.error("Not in contact")
    // }
    // // this.username.nativeElement.value = "";
    // for (let i = 1; i < this.participents.length; i++) {
    //   let j = i - 1;
    //   if (this.participents[j].firstName == event.option.value.firstName) {
    //     this.remove(event.option.value);
    //     // this.errorMessage = event.option.value.firstName + " " + "is already exists";
    //     this.tosterService.error(event.option.value.firstName + " " + "is already exists")
    //   }
    // }
    // this.afterAddParticipents(event.option.value.id);
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

  closeAddMembers(){
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }

}
