import * as React from "react";

interface Props {
  passages: any;
}
let twineVars = {};
export default function Choice({ passages }: Props) {
  const [currentChoice, setCurrentChoice] = React.useState<number>(0);

  function setChoice(pid: number) {
    setCurrentChoice(pid - 1);
  }
  function getPassageByName(pname) {
    return passages.filter(function (passage) {
      return passage.name === pname;
    })[0];
  }
  function buildButton(link) {
    if (link.broken) {
      const linkToPid = getPassageByName(link.name.match(/(?<=\|).+/g)[0]);
      return (
        <button
          type="button"
          onClick={() => setChoice(linkToPid.pid)}
          aria-label={linkToPid.name}
          key={linkToPid.pid}
          className="choice-btn"
        >
          {linkToPid.name}
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
      passages[currentChoice].text.match(/\(link-undo:.+\)/g);
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

  return (
    <div className="choice-card">
      <p
        dangerouslySetInnerHTML={{
          __html: parseLogic(passages[currentChoice].text),
        }}
      />
      {}

      {passages[currentChoice].links &&
        passages[currentChoice].links.map((link) => buildButton(link))}
      {passages[currentChoice].text.match(/\(link-undo:.+\)/g) && (
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
  );
}
