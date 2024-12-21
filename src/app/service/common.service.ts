import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { map, timeout } from "rxjs/operators";
import { environment } from "src/environments/environment.prod";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import * as forge from "node-forge";
import { Upload } from "tus-js-client";
import { ToastController } from "@ionic/angular";
import { LocalService } from "src/environments/local.service";
import { localData } from "src/environments/mimetypes";

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: "root",
})
export class CommonService {
  updateOrder(detail: any) {
    return this.http.put<any>(API_URL + "pay/order", detail);
  }
  token: any;
  refreshToken: any;
  getCaptcha: any;
  uploadProgress = 0;
  AuthorizartionToken =this.localService.getJsonValue(localData.token)

  private subject = new Subject();
  getNotificationValue = new BehaviorSubject("");

  private subject1 = new Subject();
  ClickValue = new BehaviorSubject("");

  private subject2 = new Subject();
  clickvalue = new BehaviorSubject("");
  dashboardResult: any = [];

  private subject3 = new Subject();
  headerValue = new BehaviorSubject("");

  private subject4 = new Subject();
  searchedValue = new BehaviorSubject("");

  private subject5 = new Subject();
  profileUpdates = new BehaviorSubject("");

  private subject6 = new Subject();
  BackbtnVal = new BehaviorSubject("");

  private subject7 = new Subject();
  uploadData = new BehaviorSubject("");

  private subject8 = new Subject();
  storageinfo = new BehaviorSubject("");

  private subject9 = new Subject();
  donutstorageinfo = new BehaviorSubject("");

  private subject10 = new Subject();
  tourguide = new BehaviorSubject("");

  private subject11 = new Subject();
  CallRoomId = new BehaviorSubject("");

  private subject12 = new Subject();
  uploadedFiles = new BehaviorSubject("");

  refreshCount: number = 0;
  SearchedData: any;
  base64regex =
    /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  dragnDropProgress: any;
  cancelVal: any;

  constructor(
    private readonly http: HttpClient,
    private readonly toastCtrl: ToastController,
    private router: Router,
    private localService: LocalService
  ) {}

  // User SignUp Post Method
  signUp(data) {
    return this.http.post(API_URL + "auth/signup", data);
  }

  //Captcha get method
  captcha() {
    return this.http.get<any>(API_URL + "auth/getCaptcha");
  }

  // User SignIn Post Method
  userSignIn(user: any) {
    this.refreshCount = 1;
    return this.http.post<any>(API_URL + "auth/login", user).pipe(
      map((users) => {
        return users;
      })
    );
  }

  // Create new file Post Method
  CreateNewFile(FolderName, mimeType, parentId) {
    return this.http
      .post<any>(API_URL + "file/createfolder", {
        folderName: FolderName,
        mimeType: mimeType,
        parentId: parentId,
      })
      .pipe(timeout(120000));
  }

  CreateEmpthyFolderOnUpload(folders: [], parentId) {
    return this.http
      .post<any>(API_URL + "file/createFolders", {
        paths: folders,
        folderName: " ",
        parentId: parentId,
      })
      .pipe(timeout(120000));
  }

  // ReName files POST Method
  CreateReName(fileId, newName) {
    return this.http
      .post<any>(API_URL + "file/renaming", {
        fileId: fileId,
        newName: newName,
      })
      .pipe(timeout(120000));
  }

  //Dashboard Show all files POST Method
  showAllFiles(parentID) {
    return this.http.post<any>(API_URL + "dashboard/showRecentFiles", parentID);
  }

  //Show all files POST Method
  getshowAllFiles(filesdata) {
    return this.http.post<any>(API_URL + "file/showFiles", filesdata);
  }
  //save link
  saveLink(data) {
    return this.http.post<any>(API_URL + "file/savelink", data);
  }

  //Upload files POST Method
  uploadFiles(formdata: FormData): Observable<any> {
    return this.http.post<any>(API_URL + "file/uploadfile", formdata, {
      reportProgress: true,
      observe: "events",
    });
  }

  //
  emailVerification() {
    return this.http.post<any>(API_URL + "dashboard/verifyEmail", {});
  }

  emailUpdate(val: any) {
    return this.http.post<any>(API_URL + "dashboard/updateEmail", {
      newEmail: val.newEmail,
    });
  }

  getActivitiesList(date): Observable<any> {
    return this.http.post<any>(API_URL + "activities/activity", date);
  }

  // store token
  savetoken(token) {
    this.token = token;
  }

  //get Token
  gettoken() {
    return this.token;
  }

  // store refreshToken
  saverefreshToken(refreshToken) {
    this.refreshToken = refreshToken;
  }

  //get refreshToken
  getrefreshToken() {
    return this.refreshToken;
  }

  // get user Details
  userDetails() {
    return this.http.get<any>(API_URL + "dashboard/userDetails", {});
  }

  // get all notifications
  getAllNotifications() {
    return this.http.get<any>(API_URL + "dashboard/getAllNotification", {});
  }

  // get all notifications
  getNotifications() {
    return this.http.get<any>(API_URL + "dashboard/getNotification", {});
  }

  // dismiss notifications by id
  dismissAllNotificationById(dissmissNoti) {
    return this.http.put<any>(
      API_URL + "dashboard/UpdateNotification",
      dissmissNoti
    );
  }

  // dismiss all notification
  dismissAllNotifications() {
    return this.http.put<any>(API_URL + "dashboard/dismissAllNotification", "");
  }

  // get Storage Info
  getStorageInfos() {
    return this.http.get<any>(API_URL + "dashboard/storage", {});
  }

  // Get Dashboard Info
  getDashboardInfos() {
    return this.http.get<any>(API_URL + "dashboard/getDashboardEvents");
  }

  resetpassword(data) {
    return this.http.post<any>(API_URL + "auth/createNewPassword", data);
  }

  forgotpassword(data) {
    return this.http.post<any>(API_URL + "auth/ForgotPassword", data);
  }

  changepassword(data) {
    return this.http.post<any>(API_URL + "dashboard/resetPassword", data);
  }

  saveTextFile(data, isShared = false) {
    return this.http.post<any>(
      API_URL + "file/saveFile?isShared=" + isShared,
      data
    );
  }

  storeNotification(notification) {
    this.subject.next(notification);
  }

  getNotification() {
    return this.subject.asObservable();
  }

  storeClick(val) {
    this.subject1.next(val);
  }

  getClick() {
    return this.subject1.asObservable();
  }

  storeUpdates(val) {
    this.subject5.next(val);
  }

  getUpdates() {
    return this.subject5.asObservable();
  }

  storeStorageinfo(count: any) {
    this.subject8.next(count);
  }

  getStorageinfo() {
    return this.subject8.asObservable();
  }

  storeDonutStorageinfo(count: any) {
    this.subject9.next(count);
  }

  getDonutStorageinfo() {
    return this.subject9.asObservable();
  }

  storetourguide(count: any) {
    this.subject10.next(count);
  }

  gettourguide() {
    return this.subject10.asObservable();
  }

  storeRoomId(count: any) {
    this.subject11.next(count);
  }

  getRoomId() {
    return this.subject11.asObservable();
  }

  storeUploadedFiles(count: any) {
    this.subject12.next(count);
  }

  getUploadedFiles() {
    return this.subject12.asObservable();
  }

  storePath(val) {
    this.subject2.next(val);
  }

  getpath() {
    return this.subject2.asObservable();
  }

  storeBackBtnVal(val) {
    this.subject6.next(val);
  }

  getBackBtnVal() {
    return this.subject6.asObservable();
  }

  encryptpassword(password) {
    var rsa = forge.pki.publicKeyFromPem(environment.LOGIN_PUB_KEY);
    return window.btoa(rsa.encrypt(password));
  }

  disableBack() {
    history.pushState(null, null, location.href);
    history.back();
    history.forward();
    window.onpopstate = function () {
      history.go(1);
    };
  }

  // Get  Storage info
  getDashboardInfo() {
    this.getDashboardInfos().subscribe((result: any) => {
      this.dashboardResult = result;
      this.storeNotification(this.dashboardResult.numberOfNotifications);
    });
  }

  storeHeader(val) {
    this.subject3.next(val);
  }

  getHeader() {
    return this.subject3.asObservable();
  }

  // User Add Contact Post Method
  createContact(data) {
    return this.http.post(API_URL + "createContact", data);
  }

  //Get contact list GET Method
  showContactList(pageNo, pageSize) {
    return this.http.get<any>(
      API_URL + "getAllContacts/" + pageNo + "/" + pageSize
    );
  }

  //Invite User POST Method
  inviteUser(id) {
    return this.http.post(API_URL + "sendInvitation/" + id, "");
  }

  //Delete Contact
  deleteContact(id) {
    return this.http.delete(API_URL + "deleteContact/" + id);
  }

  // Update Contact Put Method
  updateContact(data) {
    return this.http.put(API_URL + "updateContact", data);
  }

  //Search contact
  searchContact(value, pageNo, pageSize) {
    return this.http.get<any>(
      API_URL + "getAllContacts/" + pageNo + "/" + pageSize + "/" + value
    );
  }

  //Search contact
  gobalSearch(data) {
    return this.http.post<any>(API_URL + "file/searchFiles", data);
  }

  storeSearchedValue(value) {
    this.subject4.next(value);
  }

  getstoreSearchedValue() {
    return this.subject4.asObservable();
  }

  // Update Profile Post Method
  updateProfile(formdata: FormData): Observable<any> {
    return this.http.post<any>(
      API_URL + "dashboard/updateUserDetails",
      formdata,
      {
        reportProgress: true,
        observe: "events",
      }
    );
  }

  uploadasChunkFile(file: File, parentId) {
    this.uploadProgress = 0;
    const upload = new Upload(file, {
      endpoint: `${API_URL}file/upload?parentId=${parentId}`,
      retryDelays: [0, 3000, 6000, 12000, 24000],
      chunkSize: 20000,
      metadata: {
        filename: file.name,
        filetype: file.type,
        token: this.AuthorizartionToken,
      },
      onError: async (error) => {
        const toast = await this.toastCtrl.create({
          message: "Upload failed: " + error,
          duration: 3000,
          position: "top",
        });
        toast.present();
      },
      onChunkComplete: (chunkSize, bytesAccepted, bytesTotal) => {
        this.uploadProgress = Math.floor((bytesAccepted / bytesTotal) * 100);
        //this.changeDetectionRef.detectChanges();
      },
      onSuccess: async () => {
        this.uploadProgress = 100;
        //this.changeDetectionRef.detectChanges();
        const toast = await this.toastCtrl.create({
          message: "Upload successful",
          duration: 3000,
          position: "top",
        });
        toast.present();
      },
    });

    upload.start();
  }

  signOut(token) {
    return this.http.post<any>(API_URL + "auth/LogOut", token);
  }

  storeUploadProgress(val) {
    this.subject7.next(val);
  }

  getUploadProgress() {
    return this.subject7.asObservable();
  }

  storedragnDropProgress(val) {
    this.dragnDropProgress = val;
  }

  getdragnDropProgress() {
    return this.dragnDropProgress;
  }

  storeCancelProgress(val) {
    this.cancelVal = val;
  }

  getCancelProgress() {
    return this.cancelVal;
  }

  getrefereshtoken(data) {
    return this.http.post<any>(API_URL + "auth/re-generate", data);
  }

  createbookmarks(data) {
    return this.http.post<any>(API_URL + "BookMarks/CreateLink", data);
  }

  getbookmarks() {
    return this.http.get<any>(API_URL + "BookMarks/GetAllLinks/1/100");
  }

  deletebookmarks(id) {
    return this.http.delete<any>(API_URL + "BookMarks/Deletelink/" + id);
  }

  // SetUp-wizared
  setupwizared(data) {
    return this.http.post<any>(API_URL + "auth/setup-wizard", data);
  }

  allowPage() {
    return this.http.get<any>(API_URL + "auth/allowPage");
  }

  getStorageMenu() {
    return this.http.get<any>(API_URL + "plans/plans");
  }

  requestStorageUpgrade(data) {
    console.log(data);
    return this.http.post<any>(API_URL + "pay/order", {
      customerName: "Pavan kumar N",
      email: "pavnakumar1597@gmail.com",
      phoneNumber: "9071333393",
      amount: "300",
      planId: data.upgradeOption,
    });
  }

  getServerMaintenance(data) {
    return this.http.post<any>(API_URL + "adminDashboard/getMaintenance", data);
  }

  sessionTimeOut() {
    return this.http.post<any>(API_URL + "dashboard/timeOut", "");
  }

  checkFolder(parentId, folderName) {
    return this.http.post<any>(
      API_URL +
        "file/folderExists?folderName=" +
        folderName +
        "&parentId=" +
        parentId,
      ""
    );
  }

  getmoreStorage(){
    return this.http.get<any>( API_URL + "dashboard/moreStorage");
  }

  // Group Create
  createGroup(data){
    return this.http.post<any>(API_URL +"groups/createGroup", data );
  }

  //Get group list GET Method
  showGroupList(pageNo, pageSize) {
    return this.http.get<any>(API_URL + "groups/getGroups/" + pageNo + "/" + pageSize);
  }

  //Search group list GET Method
  searchGroupList(pageNo, pageSize,value) {
    return this.http.get<any>(API_URL + "groups/getGroups/" + pageNo + "/" + pageSize + "/" + value);
  }

  // Get Group Details
  getGroupInfo(data){
    return this.http.post<any>(API_URL +"groups/groupInfo", data );
  }

 //Delete Group
  deleteGroup(id) {
    return this.http.delete(API_URL + "groups/deleteGroup/" + id);
  }

  // Edit Group
  editGroup(data) {
    return this.http.post<any>(API_URL +"groups/editGroup", data );
  }

  //Create WorkSpace
  createWorkSpace(data){
    return this.http.post<any>(API_URL +"workSpace/createWorkSpace", data );
  }

  // Show All WorkSpace
  showWorkSpace(pageNo, pageSize, workSpace) {
    return this.http.get<any>(API_URL + "workSpace/getAllWorkSpace/" + pageNo + "/" + pageSize + "/" + workSpace);
  }

  // Search WorkSpace
  searchWorkSpace(pageNo, pageSize, value, workSpace){
    return this.http.get<any>(API_URL + "workSpace/getAllWorkSpace/" + pageNo + "/" + pageSize + "/" + value + "/" + workSpace);
  }

  // WorkSpace info
  getWorkSpaceinfo(data){
    return this.http.get<any>(API_URL +"workSpace/workSpaceInfo/" + data );
  }

  // Change permission in Workspace 
  changePermission(data){
    return this.http.post<any>(API_URL + "workSpace/changePermission", data);
  }

  //Delete WorkSpace
  deleteWorkSpace(id) {
    return this.http.delete(API_URL + "workSpace/deleteWorkSpace/" + id);
  }

  // Edit Workspace 
  updateWorkSpace(data){
    return this.http.post<any>(API_URL + "workSpace/editWorkSpace", data);
  }

  // Show files inside workspace
  workSpaceFiles(id, pageNo, pageSize){
    return this.http.get<any>(API_URL + "workSpace/workSpaceFiles/" + id + "/" + pageNo + "/" + pageSize + "/" );
  }

  // Create folder inside workspace
  createWorkSpaceFolder(data){
    return this.http.post<any>(API_URL + "workSpace/createWorkSpaceFolder", data);
  }

  // File Rename inside workspace
  renameFileWorkSpace(data){
    return this.http.post<any>(API_URL + "workSpace/fileRename", data);
  }

  //Permission list for public share
  permissionList(data){
    return this.http.get<any>(API_URL +"share/listpermissions/" +  data);
  }

  // Create newPublicLink
  newPublicLink(data){
    return this.http.post<any>(API_URL +"share/newPublicLink", data );
  }

  getAllPublicLinks(data){
    return this.http.post<any>(API_URL +"share/allPublicLinks", data );
  }

  updatePulicLinkPermission(data){
    return this.http.put<any>(API_URL +"share/v1/updatePermissions", data );
  }

  publicLinkDetails(data){
    return this.http.post<any>(API_URL +"share/publicLinkDetails", data );
  }

  deletePublicLinks(id){
    return this.http.delete(API_URL + "share/disablePublicLink/" + id);
  }

  disableAllPublicLinks(id){
    return this.http.delete(API_URL + "share/disablePublicLinks/" + id);
  }

  createTag(data){
    return this.http.post<any>(API_URL + "tag/createTag", data);
  }

  //List tags by ID
  listTag(id){
    return this.http.get<any>(API_URL +"tag/listAllTagsByfile/" + id)
  }
  // search Tag
  searchTag(data){
    return this.http.post<any>(API_URL +"tag/searchTags" , data)
  }
  // Delete Tag
  deleteTag(tagMappingId){
    return this.http.delete(API_URL + "tag/deleteTagMapping/" + tagMappingId);
  }

  validToken(data){
    return this.http.post<any>(API_URL +"dashboard/validToken?token=" + data , '')
  }

  // getPreSignedUrl(data){
  //   return this.http.post<any>("http://localhost:8080/multipart/init", data)
  // }
  
}

