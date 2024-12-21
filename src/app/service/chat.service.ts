import * as SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

export const isServer = true;
export const isDevelopment = false;

import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";
import { CommonService } from "./common.service";
import * as forge from "node-forge";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Howl, Howler } from "howler";
import { environment } from "../../environments/environment.prod";
import { LocalService } from "src/environments/local.service";
import { localData } from "src/environments/mimetypes";

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: "root",
})
export class ChatService {
  refreshToken: any;
  getCaptcha: any;
  uploadProgress = 0;
  webSocketUrl: string = environment.apiUrl + "ichat";
  webSocketEndpoin: string = "/channel";
  roomId: any;
  public stompClient;
  userId: any = this.localService.getJsonValue(localData.chatId);
  userToken: any = this.localService.getJsonValue(localData.chatToken);
  token: any =this.localService.getJsonValue(localData.token)
  ws: any;
  subscribedRoomIds: any = [];
  tune1: any;
  tune2: any;

  constructor(
    private readonly http: HttpClient,
    private router: Router,
    private commonService: CommonService,
    private localService: LocalService,
  ) {
    var that = this;

    this.tune1 = new Howl({
      src: ["assets/chatstyles/ringtune/tune1.mp3"],
      loop: false,
      volume: 1,
      onend: function () {
        console.log("Finished!");
        that.stopTune1();
      },
    });

    this.tune2 = new Howl({
      src: ["assets/chatstyles/ringtune/tune2.mp3"],
      loop: false,
      volume: 0.5,
      onend: function () {
        console.log("Finished!");
        that.stopTune2();
      },
    });
  }

  private messageSubject = new Subject();
  ClickValue = new BehaviorSubject("");

  private messageNotificationSubject = new Subject();
  ClickValue1 = new BehaviorSubject("");

  private typingIndicator = new Subject();
  ClickValue2 = new BehaviorSubject("");

  private roomIdSubscription = new Subject();
  ClickValue3 = new BehaviorSubject("");

  private subject5 = new Subject();
  profileUpdates = new BehaviorSubject("");

  stopTune1() {
    this.tune1.stop();
  }
  stopTune2() {
    this.tune2.stop();
  }

  storeChatList(val) {
    this.subject5.next(val);
  }

  getstoredChatList() {
    return this.subject5.asObservable();
  }

  reciveNofificationMessage(message: any) {
    this.messageNotificationSubject.next(message);
  }

  showNofificationMessage(): Observable<any> {
    return this.messageNotificationSubject.asObservable();
  }

  sendMessage(message: any) {
    this.messageSubject.next(message);
  }

  reciveMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  sendTypingIndicator(message: any) {
    this.typingIndicator.next(message);
  }

  reciveTypingIndicator(): Observable<any> {
    return this.typingIndicator.asObservable();
  }

  sendRoomIdForSubscription(roomId){
    this.roomIdSubscription.next(roomId);
  }

  subscribRoomId(): Observable<any> {
    return this.roomIdSubscription.asObservable();
  }

  getWebsocketUrl() {
    return this.webSocketUrl;
  }

  getChatList(data) {
    return this.http.post<any>(API_URL + "chatList", data);
  }

  searchChatContact(data: any) {
    return this.http.post<any>(API_URL + "CustomUsers", data);
  }

  getChatHistory(data) {
    return this.http.post<any>(API_URL + "ChatHistory", data);
  }

  createRoomId(data) {
    return this.http.post<any>(API_URL + "createRoomId", data);
  }

  getAllGroup(data) {
    return this.http.post<any>(API_URL + "getAllGroups", data);
  }

  getGroupMembers(data) {
    return this.http.post<any>(API_URL + "getGroupMembers", data);
  }

  getGroupHistory(data) {
    return this.http.post<any>(API_URL + "groupHistory", data);
  }

  sendAttachments(data) {
    return this.http.post<any>(API_URL + "sendAttachments", data);
  }

  addMembersToGroup(data) {
    return this.http.post<any>(API_URL + "addMember", data);
  }

  createGroup(data) {
    return this.http.post<any>(API_URL + "creteGroup", data);
  }

  addContact(data) {
    return this.http.post<any>(API_URL + "addContact", data);
  }

  getAllRoomId(data) {
    return this.http.post<any>(API_URL + "getAllRoomId", data);
  }

  getRrequestList(data) {
    return this.http.post<any>(API_URL + "requestList", data);
  }

  getGropInfo(data) {
    return this.http.post<any>(API_URL + "groupInfo", data);
  }

  getUserInfo(data) {
    return this.http.post<any>(API_URL + "userInfo", data);
  }

  changeGroupName(data) {
    return this.http.post<any>(API_URL + "groupRename", data);
  }

  exitGroup(data) {
    return this.http.post<any>(API_URL + "exitFromGroup", data);
  }

  removeParticipant(data) {
    return this.http.post<any>(API_URL + "removeParticipant", data);
  }

  filteredContactList(data) {
    return this.http.post<any>(API_URL + "filteredList", data);
  }

  searchUser(data) {
    return this.http.post<any>(API_URL + "SearchUser", data);
  }

  addToContact(data){
    return this.http.post<any>(API_URL + "addContactNew", data);
  }
}
