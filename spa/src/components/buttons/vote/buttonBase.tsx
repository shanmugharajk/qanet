import styled, { css } from 'styled-components';

export interface IButtonBaseProps {
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void | undefined;
}

const ButtonBase = styled('button')`
  padding: 0;
  margin: 0;
  outline: none;
  border: none;
  background: none;
  cursor: pointer;
  display: block;

  ${(props: any) =>
    props.selfVote &&
    css`
      color: #ec8d42;
    `}

  ${(props: any) =>
    !props.selfVote &&
    css`
      color: #0000005c;
    `}
`;

export default ButtonBase;
