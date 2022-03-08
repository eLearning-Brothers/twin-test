import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  serverTimestamp,
  collection,
  addDoc,
} from "firebase/firestore/lite";

export default function Importer() {
  let navigate = useNavigate();
  const [currentValue, setCurrentValue] = React.useState<string>("");
  function handleChange(event) {
    setCurrentValue(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    try {
      const twineJson = JSON.parse(currentValue);

      const db = getFirestore(window.app);
      const twineColRef = collection(db, "twines");
      addDoc(twineColRef, {
        created: serverTimestamp(),
        twine: twineJson,
      });
      navigate("/");
    } catch (err) {
      alert("ERROR:\n" + err);
    }
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <label>
          Twine JSON: <br />
          <textarea
            value={currentValue}
            onChange={handleChange}
            className="import-area"
          />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
