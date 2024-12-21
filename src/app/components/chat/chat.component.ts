import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  EventEmitter,
  Input,
  Renderer2,
  HostListener,
  NgZone,
} from "@angular/core";
import { ChatService } from "src/app/service/chat.service";
import * as SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ToastrService } from "ngx-toastr";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { getNumberOfCurrencyDigits } from "@angular/common";
import { CreateChatGroupComponent } from "./create-group/create-group.component";
import { Console } from "console";
import { AddGroupMembersComponent } from "./add-group-members/add-group-members.component";
import { RemoveParticipantsPromptComponent } from "./remove-participants-prompt/remove-participants-prompt.component";
import { EmojiEvent } from "@ctrl/ngx-emoji-mart/ngx-emoji";
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import * as moment from "moment";
import { NewChatComponent } from "./new-chat/new-chat.component";
import { PopoverController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { CommonService } from "src/app/service/common.service";
import { LocalService } from "src/environments/local.service";
import { localData } from "src/environments/mimetypes";

const CUSTOM_EMOJIS = [
  {
    name: 'Party Parrot',
    shortNames: ['parrot'],
    keywords: ['party'],
    imageUrl: './assets/images/parrot.gif',
  },
  {
    name: 'Octocat',
    shortNames: ['octocat'],
    keywords: ['github'],
    imageUrl: '',
  },
  {
    name: 'Squirrel',
    shortNames: ['shipit', 'squirrel'],
    keywords: ['github'],
    imageUrl: '',
  },
];

@Component({
  selector: "chat",
  templateUrl: "./chat.component.html",
  styleUrls: [
    "./chat.component.scss",
    "./../../../assets/chatstyles/dist/css/lib/bootstrap.min.css",
    "./../../../assets/chatstyles/dist/css/swipe.min.css",
  ],
})
export class ChatComponent implements OnInit {
  @ViewChild("scrollMe") private myScrollContainer: ElementRef;
  @ViewChild("messageInput") public focusInputField: ElementRef;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @ViewChild("chatItems") private parentRef: ElementRef<HTMLElement>;


  detailsClicked: EventEmitter<any> = new EventEmitter();
  showTab: any;
  contactList: any;
  filterContactList: any;
  groupList: any;
  filterGroupList: any;
  token: string;
  userId: any;
  userToken: any;
  filterchatList: any;
  chatLists: any;
  filterchatList1: any;
  chatLists1: any;
  chatsWithUser: any;
  roomId: any;
  subId: any;
  public stompClient;
  touser: any;
  toId: any;
  metaData: {
    userId: any;
    userToken: any;
    toId: string;
    messages: string;
    roomId: any;
    searchName: string;
    fileName: string;
    path: string;
    receiverId: string;
    receiverName: string;
    pageNo: number;
    pageSize: number;
  };
  ws: any;
  filteredMessages: any;
  newMessage: any = "";
  constactSelected: boolean = false;
  // createGroupPage: boolean = false;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  participents: any = [];
  groupContacts: any = [];
  showGroupContacts: any[];
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  pageNo: number;
  messageCounts: number;
  pageSize: number;
  dividend: number;
  remainder: number;
  historyType: any;
  messageForm: FormGroup;
  errorMessage: any;
  messageLoadedCount: number;
  totalNoMsg: any;
  inContact: boolean;
  chatListCont: number = 0;
  requestListCount: number = 0;
  file: File = null;
  openMenu: boolean = false;
  groupMemberName: any;
  listener: any;
  show_spiner: boolean = false;
  filterRequestList: any;
  requestLists: any;
  row: any = 1;
  dateOnChats: string;
  chatsDate: any;
  innerWidth: any;
  recentChatList: boolean = false;
  chatInfo: boolean = false;
  info: boolean = false;
  chatWindowSize: any = 8;
  infoWindowSize: any = 0;
  infoTitle: any;
  groupMembers: any;
  UserInfo: any;
  UserInfo1: any = [];
  groupInfo: any;
  groupOwnerId: any;
  showEditIcon: boolean = false;
  showGroupNameEdit: boolean = false;
  groupName: any;
  showScrollDownBtn: boolean;
  lastScrolledHeight: any = 0;
  CUSTOM_EMOJIS = CUSTOM_EMOJIS;
  showEmoji: boolean = false;
  darkMode: boolean = false;
  isTypingSubscription: any;
  isTyping: boolean = false;
  isClintTyping: boolean = false;
  chatAvathar: any;
  imgUrl: any;
  UserInfoCount: any;
  searchValue: string;
  groupnames1: any;
  viewDetails: boolean = false;
  popover: any;
  newContactRoomId: any;
  showRequestList: boolean = true;
  allowSignup: boolean;
  subscriptionUpdates: Subscription;
  roomIds: any;
  maintanance: any;
  bannerHidden: any;
  groupRid: any;

  constructor(
    public chatService: ChatService,
    public dialogRef: MatDialogRef<ChatComponent>,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private tosterService: ToastrService,
    public dialog: MatDialog,
    private renderer: Renderer2,
    private _ngZone: NgZone,
    private commonService: CommonService,
    private popoverController: PopoverController,
    private localService: LocalService
  ) {
    this.subscriptionUpdates = this.chatService.getstoredChatList().subscribe((message) => {
      this.chatList();
    });
  }
  
  ngOnInit() {
    setInterval( () => {
      this.maintanance = this.localService.getJsonValue(localData.maintenance);
      this.bannerHidden = this.localService.getJsonValue('4b1c6ff6-108f-4810-b20a-8c73fdab6f8b');
    },1)
    console.log("bannerHidden", this.bannerHidden)
    this.allowSignup = this.localService.getJsonValue(localData.allowPage) === 'true';
    this.showTab = "chats";
    this.roomId = "";
    this.userId = this.localService.getJsonValue(localData.chatId);
    this.userToken = this.localService.getJsonValue(localData.chatToken);
    this.token = this.localService.getJsonValue(localData.token);

    this.messageForm = this.fb.group({
      message: new FormControl(""),
    });

    this.getContacts();
    this.getGroupList();
    this.requestList();
    this.chatList();
    this.storeChatData();

    this.chatService.reciveMessage().subscribe((message: any) => {
      // console.table("rcv msg sub", this.chatService.roomId);
      let messageResult: any = JSON.parse(message.body);
      this.handleResult(message);
    });

    this.chatService.showNofificationMessage().subscribe((message: any) => {
      // console.table("rcv msg notfi", this.chatService.roomId);
      let messageResult: any = JSON.parse(message.body);
      this.showNotification(messageResult);
    });

    this.chatService.reciveTypingIndicator().subscribe((result: any) => {
      this.isClintTyping = result;
    });

    this.innerWidth = window.innerWidth;
    this.mobileMode();

    this.isTypingSubscription = this.messageForm.controls.message.valueChanges
      .pipe(
        tap(()=>{
          if(this.messageForm.controls.message.value.length > 0){
            this.isTyping = true;
            this.callTypingIndicator(true);
          }
        }),
        debounceTime(2000),
        // distinctUntilChanged(),
      )
      .subscribe(value => {
        console.log(value);
        this.isTyping = false;
        this.callTypingIndicator(false);
      });
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    // console.table("resize event", this.innerWidth);
  }

  mobileMode() {
    if (this.innerWidth <= 768) {
      this.recentChatList = !this.recentChatList;
    } else {
      this.recentChatList = !this.recentChatList;
    }
  }

  // get groupFormControls() {
  //   // return this.groupForm.controls;
  // }

  initializeItems() {
    this.filterContactList = this.contactList;
    this.filterGroupList = this.groupList;
    this.filterchatList = this.chatLists;
    this.groupContacts = this.contactList;
    this.filterRequestList = this.requestLists;
  }
  openSocket(roomId) {
    var subscribed = this.chatService.subscribedRoomIds.includes(roomId);
    if (!subscribed) {
      // console.table(subscribed);
      // this.openSocket(id);
      this.chatService.subscribedRoomIds.push(roomId);

      // this.isCustomSocketOpened = true;/
      this.subId = this.chatService.stompClient.subscribe(
        "/channel/" + roomId,
        (message) => {
          let messageResult: any = JSON.parse(message.body);
          console.log(messageResult);
          this.afterMessageRecived(messageResult, message);
        }
      );
    }
  }

  afterMessageRecived(messageResult, message) {
    if (messageResult.roomId !== this.roomId) {
      // console.table("if");
      // this.showNotification(messageResult);
    } else {
      this.showEmoji = false;
      console.log(message, "else");
      this.handleResult(message);
    }
  }
  switchTab(type) {
    this.showTab = type;
    this.closeChatWindow();
    this.groupRid = '';
    console.log("searchValue", this.searchValue)
    var inputValue = (<HTMLInputElement>document.getElementById("conversations")).value = "";
    // document.getElementById("conversations").value = "";
  }

  getContacts() {
    var data = {
      userToken: this.localService.getJsonValue(localData.chatToken),
      userId: this.localService.getJsonValue(localData.chatId),
    };
    this.chatService.searchChatContact(data).subscribe((result: any) => {
      this.contactList = result.users;
      this.filterContactList = result.users;
      this.groupContacts = result.users;
      this.showGroupContacts = result.users;
    });
  }

  getGroupList() {
    console.log("---getGroupList---")
    var request = {
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
    };
    this.chatService.getAllGroup(request).subscribe((result: any) => {
      this.groupList = result;
      this.filterGroupList = result;
    });
  }
  chatList() {
    let metaData = {
      userId: this.userId,
      userToken: this.userToken,
      toId: "",
      messages: "",
      roomId: "",
      searchName: "",
      fileName: "",
      path: "",
    };
    this.chatService.getChatList(metaData).subscribe((result: any) => {
      if(result != ''){
        this.chatLists = result;
        this.filterchatList = result;
      }
      else if(result === ''){
        // console.log("----Empty list----")
        // this.chatLists =  this.chatLists1;
        // this.filterchatList =  this.filterchatList1;
        this.storeChatData();
      }
    });
  }

  storeChatData(){
    this.chatList();
    this.chatLists1 = this.chatLists;
    this.filterchatList1 = this.filterchatList;
    //   this.filterchatList1 = result;
    // console.log("Stored chat")
    // let metaData = {
    //   userId: this.userId,
    //   userToken: this.userToken,
    //   toId: "",
    //   messages: "",
    //   roomId: "",
    //   searchName: "",
    //   fileName: "",
    //   path: "",
    // };
    // this.chatService.getChatList(metaData).subscribe((result: any) => {
    //   this.chatLists1 = result;
    //   this.filterchatList1 = result;
    // });
  }

  requestList() {
    let metaData = {
      userId: this.userId,
      userToken: this.userToken,
      toId: "",
      messages: "",
      roomId: "",
      searchName: "",
      fileName: "",
      path: "",
    };
    this.chatService.getRrequestList(metaData).subscribe((result: any) => {
      this.requestLists = result;
      this.filterRequestList = result;
      this.requestListCount = result.length;
      // if(this.requestListCount > 0){
      //   this.tosterService.success("You have a new message request")
      // }
      console.log(this.requestListCount, "requestListCount" + result.length);
    });
  }

  getItems(ev) {
    // Reset items back to all of the items
    this.initializeItems();
    this.searchValue = ev.target.value;
    console.log("searchValue", this.searchValue)

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (this.searchValue && this.searchValue.trim() != "") {
      this.filterchatList = this.filterchatList.filter((item) => {
        return item.name.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1;
      });
      this.filterContactList = this.filterContactList.filter((item) => {
        return item.name.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1;
      });
      this.filterGroupList = this.filterGroupList.filter((item) => {
        return item.fname.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1;
      });
      this.filterRequestList = this.filterRequestList.filter((item) => {
        return item.fname.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1;
      });
    }
  }

  chatWith(data: any, type: any, img:any = '', info) {
    console.log("roomID++++", info)
    setTimeout(() => {
      var elem = this.renderer.selectRootElement("#textArea");
      this.renderer.listen(elem, "focus", () => {});
      this.renderer.listen(elem, "blur", () => {});
      elem.focus();
    }, 500);
    this.chatAvathar = data.avatarETag;
    console.log(data, "=====");
    this.closeInfo();
    this.pageNo = 0;
    this.pageSize = 50;
    this.constactSelected = true;
    this.isTyping = false;
    this.historyType = type;
    this.chatsWithUser = data;

    // let metaData:any;
    if (type == "chatlist" || type == "") {
      this.infoTitle = "Contact";
      this.toId = this.chatsWithUser.toId;
      this.touser = this.chatsWithUser.name;
      this.inContact = this.chatsWithUser.inContact;
      this.roomId = this.chatsWithUser.id;
      this.chatService.roomId = this.chatsWithUser.id;
      this.metaData = {
        userId: this.userId,
        userToken: this.userToken,
        toId: this.toId,
        messages: "",
        roomId: this.chatsWithUser.id,
        searchName: "",
        fileName: "",
        path: "",
        receiverId: "",
        receiverName: "",
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      this.chatHistory(this.metaData);
      // this.getAllRoomId();
      this.commonService.storeRoomId(true);
    } else if (type == "groupList") {
      this.infoTitle = "Group";
      console.log(this.chatsWithUser);
      this.inContact = true;
      this.toId = this.chatsWithUser.id;
      this.chatService.roomId = this.chatsWithUser.id;
      if(info == 'groupInfo'){
        this.roomId = this.chatsWithUser.rid;
        this.groupRid = info;
      }
      else{
        this.roomId = this.chatsWithUser.id;
      }
      this.touser = this.chatsWithUser.fname ? this.chatsWithUser.fname : this.chatsWithUser.name;
      this.metaData = {
        userId: this.userId,
        userToken: this.userToken,
        toId: "",
        messages: "",
        roomId: this.roomId,
        searchName: "",
        fileName: "",
        path: "",
        receiverId: "",
        receiverName: "",
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      this.groupHistory();
    } else if (type == "contacts") {
      this.infoTitle = "Contact";
      this.inContact = true;
      this.roomId = this.chatsWithUser.roomId;
      this.chatService.roomId = this.chatsWithUser.roomId;
      this.toId = this.chatsWithUser.id;
      this.touser = this.chatsWithUser.name;
      this.metaData = {
        userId: this.userId,
        userToken: this.userToken,
        toId: this.chatsWithUser.id,
        messages: "",
        roomId: this.chatsWithUser.roomId,
        searchName: "",
        fileName: "",
        path: "",
        receiverId: "",
        receiverName: this.chatsWithUser.username,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      this.chatHistory(this.metaData);
    }
    else if (type == "groupList1") {
      this.infoTitle = "Group";
      console.log(this.chatsWithUser);
      this.inContact = true;
      this.toId = this.chatsWithUser.id;
      this.roomId = this.chatsWithUser.rid;
      this.chatService.roomId = this.chatsWithUser.id;
      this.touser = this.chatsWithUser.fname ? this.chatsWithUser.fname : this.chatsWithUser.name;
      this.metaData = {
        userId: this.userId,
        userToken: this.userToken,
        toId: "",
        messages: "",
        roomId: this.roomId,
        searchName: "",
        fileName: "",
        path: "",
        receiverId: "",
        receiverName: "",
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      this.groupHistory();
    }
    else {
      this.infoTitle = "";
      this.inContact = true;
      this.roomId = this.chatsWithUser.id;
      this.chatService.roomId = this.chatsWithUser.id;
      this.toId = this.chatsWithUser.toId;
      this.touser = this.chatsWithUser.name;
      this.metaData = {
        userId: this.userId,
        userToken: this.userToken,
        toId: this.chatsWithUser.toId,
        messages: "",
        roomId: this.chatsWithUser.id,
        searchName: "",
        fileName: "",
        path: "",
        receiverId: "",
        receiverName: this.chatsWithUser.username,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      this.chatHistory(this.metaData);
    }
    this.scrollToBottom();
    // this.openSocket();
  }
  

  // createRoomId(data, type) {
  //   var request = {
  //     userId: this.userId,
  //     userToken: this.userToken,
  //     receiverName: data.username,
  //     toId: data.id,
  //   };
  //   this.chatService.createRoomId(request).subscribe((result: any) => {
  //     this.roomId = result.room.id;
  //     this.chatService.roomId = result.room.id;
  //     this.openSocket(this.roomId);
  //     this.chatWith(data, type);
  //   });
  // }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  chatHistory(metaData) {
    this.chatInfo = true;
    this.recentChatList = false;
    metaData.pageSize = 50;
    metaData.pageNo = 0;
    this.chatService.getChatHistory(metaData).subscribe((result: any) => {
      this.newMessage = "";
      this.showEmoji = false;
      this.filteredMessages = result;
      this.messageCounts = result.total;
      this.totalNoMsg = result.total;
      this.dividend = ~~(this.totalNoMsg / this.pageSize)-1;
      this.remainder = this.totalNoMsg % this.pageSize;
      this.messageLoadedCount = result.total;
      this.messageCounts = this.messageCounts - this.messageLoadedCount;
      // console.table(this.messageLoadedCount);
      // this.pageNo = this.pageNo;
      // console.table(this.filteredMessages.messages);
      // if (this.dividend > 0) {
        // this.pageSize = this.pageSize + this.messageLoadedCount;
      // } else {
        // this.pageSize = this.pageSize + this.remainder;
      // }
      console.log(this.totalNoMsg, this.dividend, this.remainder, this.messageLoadedCount,this.messageCounts);
    });
    // this.pageNo = this.pageNo + this.pageSize;
  }

  groupHistory() {
    this.newMessage = "";
    this.metaData.userId = this.localService.getJsonValue(localData.chatId);
    this.chatInfo = true;
    this.recentChatList = false;
    this.chatService.getGroupHistory(this.metaData).subscribe((result: any) => {
      this.filteredMessages = result;
    });
  }

  sendMessage(message) {
    this.newMessage = message.replace(/^\s+|\s+$/g, '');
    if (this.newMessage && this.newMessage.length >= 1) {
      this.metaData["message"] = this.newMessage;
      this.metaData["timeStamp"] = new Date();
      this.metaData["userId"] = this.token;
      this.chatService.stompClient.send(
        "/app/messages",
        {},
        JSON.stringify(this.metaData)
      );
      this.newMessage = "";
    }
  }

  handleResult(message) {
    var today = new Date();
    if (message.body) {
      let messageResult: any = JSON.parse(message.body);
      // console.table();
      // console.table(messageResult);
      var msg = {
        msg: messageResult.message,
        ts: today.setMinutes(today.getMinutes() - today.getTimezoneOffset()),
        unread: true,
        attachments: [],
        u: {
          name: messageResult.receiverFullName,
          id: messageResult.userId,
          username: messageResult.receiverName,
        },
      };
      // console.table(msg);
      this.showEmoji = false;
      this.filteredMessages.messages?.push(msg);
    }
    this.chatList();
    this.getGroupList();
  }

  getRandomColor2() {
    var length = 6;
    var chars = "0123456789ABCDEF";
    var hex = "#";
    while (length--) hex += chars[(Math.random() * 16) | 0];
    return hex;
  }

  closeChatBox() {
    console.log("closeChatBox")
    this.roomId = "";
    this.chatService.roomId = "";
    this.dialogRef.close();
    this.closeInfo();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();
    if (value && this.groupContacts.length == 1) {
      var addContact = this.groupContacts[0];
    }
    // Clear the input value
    event.input.value = "";
  }

  remove(fruit: any): void {
    const index = this.participents.indexOf(fruit);
    this.groupContacts.push(fruit);
    if (index >= 0) {
      this.participents.splice(index, 1);
    }
  }

  SearchContactsInGroups(ev) {
    // Reset items back to all of the items
    this.whileSearching();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != "") {
      this.groupContacts = this.groupContacts.filter((item) => {
        return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }

  addParticipents(value) {
    if (value) {
      this.participents.push(value);
    }
    this.afterAddParticipents(value.id);
  }

  afterAddParticipents(ids: any) {
    this.groupContacts = this.groupContacts.filter(function (p) {
      return p.id != ids;
    });
    this.showGroupContacts = this.groupContacts;
  }
  whileSearching() {
    this.groupContacts = this.showGroupContacts;
  }

  showNotification(message: any) {
    console.log("not2")
    var notifiTo;
    // let messageResult: any = JSON.parse(message.body);
    this.chatLists.find(function (item, i) {
      // console.table(item.toId, message.userId);
      if (item.toId === message.userId) {
        notifiTo = item.name;
      }
    });
    if (!notifiTo) {
      this.groupList.find(function (item, i) {
        // console.table(item.toId, message.userId);
        if (item.toId === message.userId) {
          notifiTo = item.fname;
        }
      });
    }
    this.tosterService.info("New message from " + notifiTo);
    this.chatList();
  }

  loadMoreMessages() {
    console.log("loading");
    this.pageNo = this.pageNo + this.pageSize;
    console.log(this.totalNoMsg, this.dividend, this.remainder, this.messageLoadedCount,this.messageCounts);
    this.show_spiner = true;
    this.metaData["pageNo"] = this.pageNo;
    this.metaData["pageSize"] = this.pageSize;
    if (this.messageCounts != 0) {
      if (this.historyType == "chatlist") {
        this.chatService
          .getChatHistory(this.metaData)
          .subscribe((result: any) => {
            this.filteredMessages.messages = result.messages.concat(
              this.filteredMessages.messages
            );
            this.messageLoadedCount = result.messages.length;
            this.messageCounts = this.messageCounts - this.messageLoadedCount;
            // this.dividend = this.dividend - 1;
            // console.table(this.filteredMessages.messages);
            // if (this.dividend > 0) {
              // this.pageSize = this.pageSize;
            // } else {
              // this.pageSize = this.pageSize + this.remainder;
            // }
          });
      } else if (this.historyType == "groupList") {
        this.chatService
          .getGroupHistory(this.metaData)
          .subscribe((result: any) => {
            this.filteredMessages.messages = result.messages.concat(
              this.filteredMessages.messages
            );
            this.messageLoadedCount = result.messages.length;
            this.messageCounts = this.messageCounts - this.messageLoadedCount;
            // this.dividend = this.dividend - 1;
            // if (this.dividend > 0) {
              // this.pageSize = this.pageSize + this.messageLoadedCount;
            // } else {
              // this.pageSize = this.pageSize + this.remainder;
            // }
          });
      }
    }
    this.show_spiner = false;
  }

  addListener() {
    this.listener = this.renderer.listen(document, "click", (event) => {
      const targetEl = event.target as HTMLElement;
      const clickedOutside =
        targetEl.innerHTML.search("panel-menu") > 0 ? true : false;
      clickedOutside ? this.handleClose() : console.table("");
    });
  }

 
  OnopenMenu() {
    this.openMenu ? this.handleClose() : this.handleOpen();
  }

  handleOpen() {
    this.openMenu = true;
    this.addListener();
  }

  handleClose() {
    this.openMenu = false;
    this.removeListener();
  }

  removeListener() {
    this.listener();
  }

  showRoomCreation() {
    const dialogRef2 = this.dialog.open(CreateChatGroupComponent, {
      // width: "800px",
      // height: "420px",
      disableClose: true,
      data: {},
    });
    dialogRef2.afterClosed().subscribe((result) => {
      this.openSocket(result.roomId);
      this.getGroupList();
      this.chatService.roomId = result.roomId;
      this.constactSelected = true;
      this.chatWith(result.chatWith, "groupList", '', '');
    });
    this.constactSelected = false;
    this.openMenu = false;
  }

  // createNewGroup() {
  //   if (this.groupForm.value.groupName == "") {
  //     this.errorMessage = "Group name is required.";
  //     return;
  //   } else if (this.participents.length == 0) {
  //     this.errorMessage = "At least one participent should be selected.";
  //     return;
  //   }
  //   this.errorMessage = false;

  //   var request: any = {
  //     fileName: "string",
  //     message: "string",
  //     pageNo: 0,
  //     pageSize: 0,
  //     path: "string",
  //     receiverId: "string",
  //     receiverName: "string",
  //     roomId: "string",
  //     searchName: "string",
  //     timeStamp: "2022-02-08T04:21:04.058Z",
  //     toId: "string",
  //     userId: this.userId,
  //     userToken: this.userToken,
  //     groupName: this.groupForm.value.groupName,
  //   };
  //   this.chatService.createGroup(request).subscribe((result: any) => {
  //     request["roomId"] = result.group._id;
  //     console.table(request);
  //     this.chatService.roomId = result.group._id;
  //     var participants = [];
  //     this.participents.forEach(function (p) {
  //       participants.push(p.name);
  //     });
  //     this.openSocket(this.chatService.roomId);
  //     request["addId"] = participants;
  //     this.addMembersToGroup(request, result);
  //     this.getGroupList();
  //   });
  // }
  addMembersToGroup(request, result) {
    this.chatService.addMembersToGroup(request).subscribe((result2: any) => {
      this.chatWith(result.group, "groupList", '', '');
      this.constactSelected = true;
    });
  }

  accept() {
    var data = {
      receiverName: this.chatsWithUser.name,
      roomId: this.roomId,
      userToken: this.userToken,
    };
    // console.table(this.roomId);
    this.chatService.addContact(data).subscribe((responce) => {
      this.getContacts();
      this.inContact = true;
      this.showTab = "chats";
      this.openSocket(this.roomId);
    });
    this.getContacts();
  }

  reject() {
    this.constactSelected = false;
    this.roomId = "";
    this.chatService.roomId = "";
  }

  attachment(event) {
    // console.table("Files");
    this.file = event.target.files[0];
    let payload = new FormData();
    payload.append("userId", this.userId);
    payload.append("userToken", this.userToken);
    payload.append("roomId", this.roomId);
    payload.append("toId", this.chatsWithUser.toId);
    payload.append("file", this.file);
    this.chatService.sendAttachments(payload).subscribe((result: any) => {
      // console.table(result);
      var today = Date.now();
      this.filteredMessages.messages.push(result.message);
    });
  }

  sendAttachment(data) {
    // console.table(data);
    if (data) {
      this.chatService.sendAttachments(data).subscribe((result: any) => {
        // console.table(result);
      });
      // this.newMessage = "";
    }
  }

  closeChatWindow() {
    this.closeInfo();
    this.chatService.roomId = "";
    this.constactSelected = false;
    this.showGroupNameEdit = false;
    this.chatService.roomId = "";
    this.chatInfo = false;
    this.recentChatList = true;
    this.roomId = "";
  }

  // dateCheck(data){
  //   console.table(data)
  //   var date = new Date();
  //   var checkDate = new Date(data);
  //   var diffDates = date.getTime() - checkDate.getTime();
  //   console.table(date.getTime() - checkDate.getTime());
  //   if(diffDates == 0){
  //     this.dateOnChats = 'Today';
  //   }
  //   else if(diffDates == 1){
  //     this.dateOnChats = 'Yesterday';
  //   }
  //   else {
  //     this.dateOnChats = checkDate.getDate()+'/'+checkDate.getMonth()+'/'+checkDate.getFullYear();
  //   }
  //   console.table(this.dateOnChats);
  //   if(!this.chatsDate){
  //     console.table('if');
  //     this.chatsDate = data;
  //     return true;
  //   }
  //   else if(this.chatsDate != data){
  //     this.chatsDate = data;
  //     return true;
  //   }
  //   else{
  //     return false;
  //   }
  // }

  // getChatsOnDates(){
  //   return this.dateOnChats;
  // }
  onScroll(e:any) {
    console.log(e.scrollTop);
    console.log(this.myScrollContainer.nativeElement.offsetTop, this.myScrollContainer.nativeElement.offsetHeight);
    if(!this.lastScrolledHeight || this.lastScrolledHeight < this.myScrollContainer.nativeElement.scrollTop){
      this.lastScrolledHeight += this.myScrollContainer.nativeElement.scrollTop;
    }
    else{
      this.lastScrolledHeight -= this.myScrollContainer.nativeElement.scrollTop;
    }
    // console.log(this.lastScrolledHeight);
    // if(this.myScrollContainer.nativeElement.scrollTop < 2600){
      // this.showScrollDownBtn = true;
      // console.log(this.myScrollContainer.nativeElement.scrollTop);
    // }
    // else{
      // this.showScrollDownBtn = false;
      // console.log();
    // }
  }

//   onScrollNew(event: any) {
//     // visible height + pixel scrolled >= total height 
//     if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
//       console.log("End");
//       this.showScrollDownBtn = true;
//     }else{
//       this.showScrollDownBtn = false;
//     }
// }

  // ngAfterViewInit() {
  //   this.loadMoreMessages();
  // }

  showChatInfo(){
    this.info = true;
    this.viewDetails = true;
    this.chatInfo = false;
    this.chatWindowSize = 5;
    this.infoWindowSize = 3;
    if(this.historyType == "groupList" || this.historyType == "groupList1"){
      this.getGroupMembers();
      this.getGroupInfo();
    }
    else{
      this.getUserInfo();
    }
  }

  closeInfo(){
    this.info = false;
    this.chatInfo = true;
    this.viewDetails = false;
    this.showGroupNameEdit = false;
    this.chatWindowSize = 8;
    this.infoWindowSize = 0;
  }

  getGroupMembers(){
    let roomId : any;
    if(this.groupRid == 'groupInfo'){
      roomId = this.chatsWithUser.rid;
      console.log("Inside GroupInfo", roomId)
    }
    else{
      roomId = this.chatsWithUser.id;
      console.log("Else part GroupInfo", roomId)
    }
    var data = {
      userId: this.userId,
      userToken: this.userToken,
      toId: "",
      messages: "",
      roomId: roomId,
      searchName: "",
      fileName: "",
      path: "",
      receiverId: "",
      receiverName: "",
    };
    this.chatService.getGroupMembers(data).subscribe((data:any)=>{
      this.groupMembers = data;
    })
  }

  addGroupMembers(){

    var dialogRef = this.dialog.open(AddGroupMembersComponent,{
      // width: "800px",
      // height: "340px",
      disableClose: true,
      data: {
        groupId : this.groupInfo.group.id,
        groupName : this.groupInfo.group.fname
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getGroupMembers();
      this.groupHistory();
    });

    // this.chatService.addMembersToGroup(data).subscribe((result2: any) => {
    //   this.getGroupMembers();
    // });
  }

  getUserInfo(){
    console.log("toId", this.toId)
    var response = {
      "toId": this.toId,
      "userId": this.userId,
      "userToken": this.userToken
    };
    this.chatService.getUserInfo(response).subscribe((result:any)=>{
      this.UserInfo = result;
      this.UserInfo1 = result.user.rooms;
      if(this.UserInfo1 == null || this.UserInfo1 == ''){
        this.UserInfoCount = 0;
      }
      else{
        this.UserInfoCount = this.UserInfo1.length
      }
      // console.table("UserInfo1 length", this.UserInfoCount);
    })
  }

  getGroupInfo(){
    var data = {
      "roomId": this.roomId,
      "userId": this.userId,
      "userToken": this.userToken,
    };
    this.chatService.getGropInfo(data).subscribe((result:any)=>{
      this.groupInfo = result;
      console.log("Group Info:", this.groupInfo)
      this.groupnames1 = result.group.fname;
      this.groupOwnerId = result.group.u.id;
    });
  }

  showEdit(){
    this.showEditIcon = true;
    this.groupName = this.touser;
  }

  hideEdit(){
    this.showEditIcon = false;
  }

  groupNameEdit(){
    this.showGroupNameEdit = true;
  }

  SaveGroupName(){
    console.log("groupnames1", this.groupnames1)
    if(this.groupnames1 === this.groupName){
      this.showGroupNameEdit = false;
      return;
    }
    else if(this.groupName == '' || this.groupName == null){
      this.tosterService.error("Please enter group name");
      return;
    }
    else{
      var data = {
        "groupName" : this.groupName,
        "roomId": this.roomId,
        "userId": this.userId,
        "userToken": this.userToken,
      };
      this.chatService.changeGroupName(data).subscribe((result)=>{
        if(result.success == true){
          this.getGroupList();
          this.getGroupInfo();
          this.touser = result.group.fname;
          this.groupHistory();
          this.showGroupNameEdit = false;
        }
        else if(result.code == 404){
          this.tosterService.error("Only group owner can edit");
          this.showGroupNameEdit = false;
        }
      });
    } 
  }

  exitFromGroup(){
    var data = {
      "roomId": this.roomId,
      "userId": this.userId,
      "userToken": this.userToken,
    };
    this.chatService.exitGroup(data).subscribe((result)=>{
      this.getGroupMembers();
      this.getGroupList();
      this.closeInfo();
      this.constactSelected = false;
      this.recentChatList = true;
      this.chatService.roomId = '';
    });
  }

  removeFromGroup(toId,name){
    console.log(toId);
    console.log(name)
    var removeParticipant:any;
    var dialogRef = this.dialog.open(RemoveParticipantsPromptComponent,{data:{userName:name}});
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      removeParticipant = result.status;
      if(removeParticipant){
        var data = {
          "groupName": this.touser,
          "toId" : toId,
          "roomId": this.roomId,
          "userId": this.userId,
          "userToken": this.userToken,
        };
        this.chatService.removeParticipant(data).subscribe((result)=>{
          this.getGroupMembers();
          this.groupHistory();
        });
      }
    });
    }

    handleClick($event: EmojiEvent) {
      console.log($event.emoji.native);
      this.focusInputField.nativeElement.focus();
      this.newMessage += $event.emoji.native;
    }

    callTypingIndicator(status){
        // this.metaData["message"] = '...';
        // this.metaData["timeStamp"] = new Date();
        // this.metaData["userId"] = this.token;
        // this.chatService.stompClient.send(
        //   "/app/messages",
        //   {data:123},
        //   JSON.stringify(this.metaData)
        // );
    }

    trimString(myString: any) {
      myString.value = myString.value.replace(/^\s+|\s+$/g, '');
    }

    focusTextArea(){
      this.focusInputField.nativeElement.focus()
    }

  async newChat(){
    this.popover = await this.popoverController.create({
      component: NewChatComponent,
      cssClass: "modal-fullscreen",
      backdropDismiss: false,
    });
    await this.popover.present();
    this.openMenu = false;
    return this.popover.onDidDismiss().then((data) => {
      this.pageSize = 50;
      this.pageNo = 0;
      this.newContactRoomId = data.data;
      console.log("roomId", data.data)
      this.toId = data.data.toId;
      console.log("toId", this.toId);
    //  var metaData = {
    //     userId: this.userId,
    //     userToken: this.userToken,
    //     roomId: this.newContactRoomId ,
    //     pageNo: this.pageNo,
    //     pageSize: this.pageSize,
    //   };
      this.getContacts();
      this.chatList();
      this.chatWith(this.newContactRoomId, '', '','');
      // this.inContact = true;
      // this.showTab = "chats";
      // this.openSocket(this.roomId);     
    });
  }

  OncloseMenu() {
    this.openMenu = false;
    this.viewDetails = false;
  }

}
