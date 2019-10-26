import React from 'react';
import styled from 'styled-components';
import { Menu, Input, Icon, Dropdown, Button } from 'semantic-ui-react';
import MenuButton from './menuButton';

interface IUserInfo {
  userId: string;
  userName: string;
}

interface IProps {
  className?: string;
  isLoggedIn: boolean;
  userInfo: IUserInfo;
}

const handleItemClick = () => {
  // TODO: place holder for now.
};

const Header = function(props: IProps) {
  return (
    <Menu className={props.className}>
      <Menu.Item header name="home" onClick={handleItemClick}>
        QaNet
      </Menu.Item>

      <Menu.Item>
        <Input
          transparent
          className="icon"
          icon="search"
          placeholder="Search questions"
        />
      </Menu.Item>

      <Menu.Menu position="right">
        <Menu.Item name="upcomingEvents" onClick={handleItemClick}>
          <Icon name="question circle" />
          Ask Question
        </Menu.Item>

        {props.isLoggedIn && (
          <Dropdown item text={props.userInfo.userId}>
            <Dropdown.Menu>
              <Dropdown.Item>Your profile</Dropdown.Item>
              <Dropdown.Item>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}

        {!props.isLoggedIn && (
          <Menu.Item>
            <MenuButton href="/signin" text="Sign In" />
          </Menu.Item>
        )}
      </Menu.Menu>
    </Menu>
  );
};

export default styled(Header)`
  border-radius: 0px !important;
`;
