import * as React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  let navigate = useNavigate();
  function goToImport(event) {
    event.preventDefault();
    navigate("/import");
  }

  return (
    <div className="header">
      <button type="button" onClick={goToImport} className="choice-btn">
        Upload your own
      </button>
    </div>
  );
}
