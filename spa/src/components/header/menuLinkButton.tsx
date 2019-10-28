import React from "react";
import Link from "next/link";
import styled from "styled-components";

const A = styled("a")`
  color: #fff;
  &:hover {
    color: #fff;
  }
`;

const CustomA = React.forwardRef(({ href, text }: IProps, ref: any) => (
  <A className="ui blue button" href={href} ref={ref}>
    {text}
  </A>
));

interface IProps {
  href: string;
  text: string;
}

const MenuLinkButton = function({ href, text }: IProps) {
  return (
    <Link href={href}>
      <CustomA text={text} href={href} />
    </Link>
  );
};

export default MenuLinkButton;
