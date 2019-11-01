import Highlight, { defaultProps } from 'prism-react-renderer';
import Line from '../components/postRenderer/line';
import BlockQuote from '../components/postRenderer/blockQuote';

const getStringElements = (arr: any): Array<any> => {
  return arr
    .map((elem: any) => {
      if (!elem) {
        return null;
      }

      if (Array.isArray(elem)) {
        return getStringElements(elem);
      }

      if (typeof elem === 'string') {
        return elem;
      }

      if (elem.props && elem.props.children) {
        return getStringElements(elem.props.children);
      }

      return null;
    })
    .filter(Boolean)
    .reduce((final: any, elem: any) => {
      if (Array.isArray(elem)) {
        return [...final, ...elem];
      }

      return [...final, elem];
    }, []);
};

const hasStringElements = (arr: any): boolean => {
  if (Array.isArray(arr)) return arr.some(elem => hasStringElements(elem));
  return typeof arr === 'string';
};

export const renderer = {
  inline: {
    BOLD: (children: Array<Node>, { key }: any) => (
      <span style={{ fontWeight: 700 }} key={key}>
        {children}
      </span>
    ),
    ITALIC: (children: Array<Node>, { key }: any) => (
      <em key={key}>{children}</em>
    ),
    CODE: (children: Array<Node>, { key }: any) => (
      <code key={key}>{children}</code>
    )
  },

  blocks: {
    unstyled: (children: Array<Node>, { keys }: any) => {
      // If the children are text, render a paragraph
      if (hasStringElements(children)) {
        return children.map((child, index) => <p key={keys[index]}>{child}</p>);
      }

      return children;
    },

    'code-block': (children: Array<any>, { keys, data }: any) => {
      return children.map((child, index) => (
        <Highlight
          {...defaultProps}
          code={getStringElements(child).join('\n')}
          language={Array.isArray(data) && data[0].language}
          theme={undefined}
          key={keys[index]}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <Line className={className} style={style}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </Line>
          )}
        </Highlight>
      ));
    },
    blockquote: (children: Array<Node>, { keys }: any) =>
      children.map((child, index) => (
        <BlockQuote key={keys[index] || index}>{child}</BlockQuote>
      )),

    'header-one': (children: Array<Node>, { keys }: any) =>
      children.map((child, index) => <h1 key={keys[index]}>{child}</h1>),

    'header-two': (children: Array<Node>, { keys }: any) =>
      children.map((child, index) => <h2 key={keys[index]}>{child}</h2>),

    'header-three': (children: Array<Node>, { keys }: any) =>
      children.map((child, index) => <h3 key={keys[index]}>{child}</h3>),

    'unordered-list-item': (children: Array<Node>, { keys }: any) => (
      <ul key={keys.join('|')}>
        {children.map((child, index) => (
          <li key={keys[index]}>{child}</li>
        ))}
      </ul>
    ),

    'ordered-list-item': (children: Array<Node>, { keys }: any) => (
      <ol key={keys.join('|')}>
        {children.map((child, index) => (
          <li key={keys[index]}>{child}</li>
        ))}
      </ol>
    )
  },
  entities: {
    LINK: (children: Array<Node>, data: any, { key }: any) => {
      const link = data.url || data.href;

      return (
        <a key={key} href={link} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
  }
};
