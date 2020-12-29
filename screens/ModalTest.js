import React, { useState } from "react";
import { Block, Button } from "galio-framework";
import { ChatModal } from "../components/molecules/ChatModal";


const ModalTest = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Block
        flex
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button onPress={() => setIsOpen(true)}>
          モーダル展開
      </Button>
      </Block>

      <ChatModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

export default ModalTest;
