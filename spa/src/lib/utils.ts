import cookie from 'cookie';

export default {
  cookies: {
    parseCookies: function(req?: any, options = {}) {
      return cookie.parse(
        req ? req.headers.cookie || '' : document.cookie,
        options
      );
    },

    isLoggedIn(req: any): boolean {
      return !!(this.parseCookies(req) || {})['token'];
    },

    getByKey(req: any, key: string): any {
      return (this.parseCookies(req) || {})[key];
    }
  }
};
