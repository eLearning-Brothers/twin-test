import * as React from "react";

interface Props {
  passages: any;
}

export default function Choice({ passages }: Props) {
  const [currentChoice, setCurrentChoice] = React.useState<number>(0);

  function setChoice(pid: number) {
    setCurrentChoice(pid - 1);
  }

  function getUndoText() {
    const undoLink: string =
      passages[currentChoice].text.match(/\(link-undo:.+\)/g);
    const txt = undoLink[0].match(/\".+\"/);
    return txt[0].replace(/\"/g, "");
  }
  return (
    <div className="choice-card">
      <p>
        {passages[currentChoice].text
          .replace(/\[\[.+]]/g, "")
          .replace(/\(link-undo:.+\)/g, "")}
      </p>
      {passages[currentChoice].links &&
        passages[currentChoice].links.map((link) => (
          <button
            type="button"
            onClick={() => setChoice(link.pid)}
            aria-label={link.name}
            key={link.pid}
            className="choice-btn"
          >
            {link.name}
          </button>
        ))}
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
