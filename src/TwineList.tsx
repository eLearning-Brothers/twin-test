import * as React from "react";
import { NavLink } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";

export default function TwineList() {
  const [twineList, setTwineList] = React.useState([]);

  React.useEffect(() => {
    const getList = async () => {
      const db = getFirestore(window.app);
      const twineColRef = collection(db, "twines");
      const twinesSnapshot = await getDocs(twineColRef);
      const twineDocList = twinesSnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      console.log(twineDocList);
      setTwineList(twineDocList);
    };
    getList().catch(console.error);
  }, []);

  function buildLink(doc) {
    console.log(doc);
    return (
      <div>
        <NavLink
          key={doc.data.twine.ifid}
          to={`/play/${doc.id}`}
          className="choice-btn"
        >
          {doc.data.twine.name} name
        </NavLink>
      </div>
    );
  }
  //
  return (
    <div className="">
      twine List {twineList && twineList.map((doc) => buildLink(doc))}
    </div>
  );
}
