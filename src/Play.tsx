import * as React from "react";
import { useParams } from "react-router-dom";
import { getFirestore, getDoc, doc } from "firebase/firestore/lite";
import ReactJson from "react-json-view";

let twineVars = {};
//let thisTwine = twine;
export default function Play() {
  const params = useParams();
  const [currentChoice, setCurrentChoice] = React.useState<number>(0);
  const [thisTwine, setThisTwine] = React.useState(null);

  React.useEffect(() => {
    const getTwine = async () => {
      const db = getFirestore(window.app);
      const docRef = doc(db, "twines", params.twine);
      const twinesSnapshot = await getDoc(docRef);
      if (twinesSnapshot.exists()) {
        setThisTwine(twinesSnapshot.data().twine);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    getTwine().catch(console.error);
  }, [params]);

  function setChoice(pid: number) {
    setCurrentChoice(pid - 1);
    const varElems = document.getElementsByClassName("variable-row");
    const currentPageName = thisTwine.passages[currentChoice].name;
    const displayString = `"name":string"${currentPageName}"`;
    console.log(displayString);
    for (var elem in varElems) {
      if (varElems[elem].textContent === displayString) {
        document.getElementById("json_display").scrollTop =
          varElems[elem].offsetTop;
      }
    }
  }
  function getPassageByName(pname) {
    return thisTwine.passages.filter(function (passage) {
      return passage.name === pname;
    })[0];
  }
  function buildButton(link) {
    if (link.broken) {
      const linkToPid = getPassageByName(link.name.match(/(?<=\|).+/g)[0]);
      let linkName = link.name.split("|")[0];
      console.log("linkName", linkName);
      return (
        <button
          type="button"
          onClick={() => setChoice(linkToPid.pid)}
          aria-label={linkName}
          key={linkToPid.pid}
          className="choice-btn"
        >
          {linkName}
        </button>
      );
    } else {
      return (
        <button
          type="button"
          onClick={() => setChoice(link.pid)}
          aria-label={link.name}
          key={link.pid}
          className="choice-btn"
        >
          {link.name}
        </button>
      );
    }
  }

  function getUndoText() {
    const undoLink: string =
      thisTwine.passages[currentChoice].text.match(/\(link-undo:.+\)/g);
    const txt = undoLink[0].match(/".+"/);
    return txt[0].replace(/"/g, "");
  }

  function parseLogic(passage: string) {
    let textToDelete = [];
    const logicRegexp = new RegExp("<<.+?>>", "g");
    let matches = passage.matchAll(logicRegexp);
    for (const match of matches) {
      const logicString = match[0];
      if (logicString.startsWith("<<set")) {
        const tvar = logicString.match(/(?<=\$).+?(?= )/g);
        twineVars[tvar[0]] = logicString.includes("true");
      } else if (logicString.startsWith("<<if")) {
        const ifStartPos = match.index + match[0].length;
        let ifEndPos = passage.indexOf("<<else>>", ifStartPos);
        ifEndPos =
          ifEndPos < passage.indexOf("<</if>>", match.index)
            ? ifEndPos
            : passage.indexOf("<</if>>", match.index);
        const elseStartPos = passage.indexOf("<<else>>", match.index) + 8;
        const elseEndPos = passage.indexOf("<</if>>", elseStartPos);
        const ifString = passage.substring(ifStartPos, ifEndPos);
        const elseString = passage.substring(elseStartPos, elseEndPos);
        const tvar = logicString.match(/(?<=\$).+?(?= )/g)[0];
        if (twineVars[tvar] === logicString.includes("true")) {
          textToDelete.push(elseString);
        } else {
          textToDelete.push(ifString);
        }
      } else if (logicString.startsWith("<<nobr")) {
        const startPos = passage.indexOf("<<nobr>>", match.index);
        const endPos = passage.indexOf("<</nobr>>", startPos);
        const badString = passage.substring(startPos, endPos);
        passage = passage.replace(badString, badString.replace(/\n/g, ""));
      }
    }

    //remove dynamic text
    for (const txt in textToDelete) {
      passage = passage.replace(textToDelete[txt], "");
    }
    //remove the wierd stuff
    passage = passage
      .replace(/\n/g, "<br/>")
      .replace(/\[\[.+]]/g, "")
      .replace(/\(link-undo:.+\)/g, "")
      .replace(/<<.+?>>/g, "");
    return passage;
  }

  function selectedNode(selected) {
    console.log(selected);
    if (selected.name === "pid") {
      setChoice(selected.value);
    }
  }

  if (thisTwine === null) {
    return null;
  }

  return (
    <main className="play-wrapper">
      <div className="play-area">
        <h3>{thisTwine.name}</h3>
        {thisTwine !== null ? (
          <div className="choice-card">
            <p
              dangerouslySetInnerHTML={{
                __html: parseLogic(thisTwine.passages[currentChoice].text),
              }}
            />
            {}

            {thisTwine.passages[currentChoice].links &&
              thisTwine.passages[currentChoice].links.map((link) =>
                buildButton(link)
              )}
            {thisTwine.passages[currentChoice].text.match(
              /\(link-undo:.+\)/g
            ) && (
              <button
                type="button"
                onClick={() => setChoice(1)}
                aria-label={getUndoText()}
                className="choice-btn"
              >
                {getUndoText()}
              </button>
            )}
          </div>
        ) : (
          <p>loading</p>
        )}
      </div>
      <div className="json-display" id="json_display">
        Click a pid to jump to that page:
        <br />
        <ReactJson src={thisTwine} onSelect={selectedNode} />
      </div>
    </main>
  );
}
