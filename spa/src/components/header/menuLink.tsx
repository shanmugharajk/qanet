import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

interface IProps {
  header?: boolean;
  href: string;
  text: string;
  iconClass?: string;
}

const MenuLink = function(props: IProps) {
  const { href, text, iconClass, header } = props;

  let cls = '';

  if (header) {
    cls = 'header item';
  } else {
    cls = 'item';
  }

  return (
    <Link href={href}>
      <a className={cls}>
        {iconClass && <i aria-hidden="true" className={iconClass}></i>}
        {text}
      </a>
    </Link>
  );
};

export default MenuLink;
