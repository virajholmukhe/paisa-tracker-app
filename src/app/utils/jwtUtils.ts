export class JwtUtils {
    public static getUserInfo() {
        const token = this.getToken();
        let payload;
        if (token) {
          payload = token.split(".")[1];
          payload = window.atob(payload);
          return JSON.parse(payload);
        } else {
          return null;
        }
      }
      
    public static getToken() {
        return localStorage.getItem("token");
    }

    public static getUsername(){
        var userInfo = this.getUserInfo();
        return userInfo.sub;
    }
    
    public static isTokenExpired(){
      var userInfo = this.getUserInfo();
      const expiry = userInfo.exp as number;
      const currentDate = (Math.floor((new Date).getTime() / 1000));
      return currentDate >= expiry;
    }
}