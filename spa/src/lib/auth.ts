import { PageContext } from '../@types';
import Router from 'next/router';

/**
 * Checks the user is signed in and redirects to the url passed if not signed in.
 * @param ctx page context
 * @param redirectUrl The Url to redirect when the user is not signed
 */
export default function (ctx: PageContext, redirectUrl: string) {
    const { res, isLoggedIn } = ctx;
    const url = `/signin?redirectUrl=${redirectUrl}`;

    if (!isLoggedIn) {
        if (typeof window === 'undefined') {
            (res as any).redirect(url);
        } else {
            Router.push(url);
        }
    }

    return {};
};