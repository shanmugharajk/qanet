import React from 'react';
import styled from 'styled-components';
import { Menu, Input, Dropdown } from 'semantic-ui-react';
import MenuLinkButton from './menuLinkButton';
import MenuLink from './menuLink';
import DDLink from './ddLink';

interface IUserInfo {
  userId: string;
  userName: string;
}

interface IProps {
  className?: string;
  isLoggedIn: boolean;
  userInfo: IUserInfo;
}

const Header = function(props: IProps) {
  return (
    <Menu className={props.className}>
      <MenuLink href="/" text="QaNet" header />

      <Menu.Item>
        <Input
          transparent
          className="icon"
          icon="search"
          placeholder="Search questions"
        />
      </Menu.Item>

      <Menu.Menu position="right">
        <MenuLink
          href="/questions/ask"
          text="Ask Question"
          iconClass="question circle icon"
        />

        {props.isLoggedIn && (
          <Dropdown item text={props.userInfo.userId}>
            <Dropdown.Menu>
              <Dropdown.Item>
                <DDLink
                  href={`/profile/${props.userInfo.userId}`}
                  text="Your profile"
                />
              </Dropdown.Item>
              <Dropdown.Item>
                <DDLink href="/logout" text="Logout" />
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}

        {!props.isLoggedIn && (
          <Menu.Item>
            <MenuLinkButton href="/signin" text="Sign In" />
          </Menu.Item>
        )}
      </Menu.Menu>
    </Menu>
  );
};

export default styled(Header)`
  border-radius: 0px !important;
`;
