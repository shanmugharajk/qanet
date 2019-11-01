declare module 'redraft' {
    export default function redraft(content: any, renderer: any): any;

    export class CompositeDecorator {
        constructor(decorators: any);

        getComponentForKey(key: any): any;

        getDecorations(block: any, contentState: any): any;

        getPropsForKey(key: any): any;

    }

    export class RawParser {
        constructor(_ref: any);

        nodeIterator(node: any, start: any, end: any): any;

        parse(block: any): any;

        relevantStyles(offset: any): any;

    }

    export function createBlockRenderer(callback: any, blockMap: any): any;

    export function createStylesRenderer(wrapper: any, stylesMap: any): any;

    export function renderNode(node: any, inlineRenderers: any, entityRenderers: any, styleRenderers: any, entityMap: any, options: any, keyGenerator: any): any;
}