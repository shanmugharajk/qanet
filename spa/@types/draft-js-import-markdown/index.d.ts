// Type definitions for draft-js-import-markdown 1.4
// Project: https://github.com/sstur/draft-js-utils/blob/master/packages/draft-js-import-markdown/README.md
// Definitions by: shanmugharaj <https://github.com/me>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'draft-js-import-markdown' {
    export function stateFromMarkdown(markdown: any, options: any): any;

    export namespace MarkdownParser {
        function parse(src: any, options: any): any;

    }
}
