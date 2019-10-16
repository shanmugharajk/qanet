import React from "react";
import { Button, Container, Message } from "semantic-ui-react";
import Link from "next/link";

import Header from "../components/header";
import A from "../components/anchor";

const Index = () => (
  <Container>
    <Header>
      <Link href="/">
        <A>Home</A>
      </Link>
      <Link href="/about">
        <A>About</A>
      </Link>
    </Header>

    <Message warning>Home</Message>
  </Container>
);

export default Index;
