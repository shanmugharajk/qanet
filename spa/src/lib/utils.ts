import cookie from 'cookie';
import moment from 'moment';

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
  },
  dateTime: {
    format: function(
      dateTime: string,
      // tslint:disable-next-line: quotemark
      dateFormatterString = "MMM DD'YY HH:mm"
    ) {
      return moment(dateTime).format(dateFormatterString);
    }
  }
};
