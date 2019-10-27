import styled from 'styled-components';

const Container = styled('div')`
  color: red;
  padding-bottom: 15px;
`;

interface IProps {
  text: string;
}

const ErrorText = function({ text }: IProps) {
  return (
    <Container>
      <span>{text}</span>
    </Container>
  );
};

export default ErrorText;
