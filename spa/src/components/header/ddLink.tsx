import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const A = styled('a')`
  color: #000000de;
  &:hover {
    color: #000000de;
  }
`;

const CustomA = React.forwardRef(({ onClick, href, text }: any, ref: any) => (
  <A href={href} onClick={onClick} ref={ref}>
    {text}
  </A>
));

interface IProps {
  href: string;
  text: string;
}

const DDLink = function({ href, text }: IProps) {
  return (
    <Link href={href}>
      <CustomA text={text} href={href} />
    </Link>
  );
};

export default DDLink;
