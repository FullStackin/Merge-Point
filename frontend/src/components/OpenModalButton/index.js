// frontend/src/components/OpenModalButton/index.js
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useModal } from "../../context/Modal";

function OpenModalButton({
  modalComponent,
  buttonText,
  onButtonClick,
  onModalClose,
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (typeof onButtonClick === "function") onButtonClick();
    if (typeof onModalClose === "function") setOnModalClose(onModalClose);
    setModalContent(memoizedModalComponent);
  };

  return <button onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;
