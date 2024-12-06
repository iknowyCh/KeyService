import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id?: number;
  username: string;
  password: string;
  locked?: number;  // 使用 number 對應 locked 欄位
  creator?: string;
  date?: string | null; // 使用 ? 將 date 設為選填屬性
  plan?: number;
  times?: number | null;
  // 新增的屬性，用於格式化顯示內容
  formattedDisplay?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private currentUserSubject = new BehaviorSubject<string>(''); // 用於保存當前使用者名稱
  currentUser$ = this.currentUserSubject.asObservable();

  
  private apiUrl = 'https://localhost:7142/api/Users'; // 改成線上 API 路徑

  constructor(private http: HttpClient) {
    this.loadCurrentUser(); // 初始化時調用以取得當前使用者
   }

   
  // 調用 API 獲取當前使用者名稱
  public loadCurrentUser(): void {
    this.http.get<{ success: boolean; username: string }>('https://localhost:7142/api/Users/current-user')
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.currentUserSubject.next(response.username);
          }
        },
        error: (error) => {
          console.error('無法獲取當前使用者', error);
        }
      });
  }

  // 登入方法
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }, { withCredentials: true });
  }

  // 登出方法
  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }

   // 檢查 Session 方法
   checkSession(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/check-session`, { withCredentials: true });
  }

 //註冊方法
 register(user: User): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/register`, user, { withCredentials: true });  // 使用正確的 API 路徑
}

 // 獲取用戶列表
 getMembers(): Observable<User[]> {
  return this.http.get<User[]>(this.apiUrl);
}

 //獲取當前管理員所建立的用戶
 getUsersByCreator(): Observable<User[]>{
   return this.http.get<User[]>(`${this.apiUrl}/users-by-creator`, {withCredentials:true});
 }

 // 在 MemberService 內添加這個方法
getCurrentUser(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/current-user`, { withCredentials: true });
}

 // 新增用戶
 addMember(user: User): Observable<User> {
  return this.http.post<User>(this.apiUrl, user);
}

//編輯用戶
// member.service.ts
updateUser(username: string, user: User): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/${username}`, user);  // 使用 PUT 方法傳入用戶 ID 和更新的資料
}

getUserByUsername(username: string): Observable<User>{
  return this.http.get<User>(`${this.apiUrl}/${username}`, { withCredentials: true}); // { withCredentials: true} 確保攜帶憑證/// 使用正確的 API 路徑
}

deleteUser(username: string): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/${username}`);  // 使用模板字串來替換 `username`
}
}
