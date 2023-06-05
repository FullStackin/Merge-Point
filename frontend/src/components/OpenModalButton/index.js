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

// improves performance by preventing unnecessary re-renders
  const memoizedModalComponent = useMemo(
    () => modalComponent,
    [modalComponent]
  );

  const onClick = () => {
    if (typeof onButtonClick === "function") onButtonClick();
    if (typeof onModalClose === "function") setOnModalClose(onModalClose);
    setModalContent(memoizedModalComponent);
  };

  return <button onClick={onClick}>{buttonText}</button>;
}

//Prop Type Checking: checking if the expected props are being passed correctly.
OpenModalButton.propTypes = {
  modalComponent: PropTypes.element.isRequired,
  buttonText: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func,
  onModalClose: PropTypes.func,
};

export default OpenModalButton;
