import { useEffect, useRef, useState } from "react";
import { cards } from "./cards";
import { readProgress, saveProgress } from "./storage";
import type { Rating } from "./storage";

type IconName =
  | "arrow"
  | "back"
  | "check"
  | "flip"
  | "book"
  | "sun"
  | "repeat"
  | "save"
  | "pencil";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, string> = {
    arrow: "M5 12h14m-6-6 6 6-6 6",
    back: "M19 12H5m6-6-6 6 6 6",
    check: "m5 12 4 4L19 6",
    flip: "M4 8a8 8 0 0 1 14-3l2 3M20 3v5h-5M20 16a8 8 0 0 1-14 3l-2-3M4 21v-5h5",
    book: "M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Zm0 0v14",
    sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
    repeat:
      "M20 7H7a4 4 0 0 0 0 8h2m8-12 4 4-4 4M4 17h13a4 4 0 0 0 0-8h-2m-8 4-4 4 4 4",
    save: "M5 3h12l4 4v14H3V3h2Zm2 0v6h10V3M7 21v-8h10v8",
    pencil: "m15 4 5 5M4 15 15 4a3.5 3.5 0 0 1 5 5L9 20l-6 1 1-6Z",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}

function WaveMark() {
  return (
    <svg
      className="wave-art"
      viewBox="0 0 240 112"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 56h240M120 10v92"
        stroke="currentColor"
        strokeOpacity=".15"
        strokeDasharray="3 5"
      />
      {[0, 1, 2, 3, 4].map((index) => (
        <path
          key={index}
          d={`M0 ${22 + index * 17}C65 ${22 + index * 17} 70 ${56 - index * 4} 120 56S175 ${90 - index * 17} 240 ${90 - index * 17}`}
          stroke="currentColor"
          strokeWidth="1.2"
          opacity={0.35 + index * 0.1}
        />
      ))}
      <ellipse
        cx="120"
        cy="56"
        rx="10"
        ry="44"
        stroke="currentColor"
        strokeOpacity=".65"
      />
      <circle cx="120" cy="56" r="4" fill="currentColor" />
    </svg>
  );
}

export default function App() {
  const [loaded] = useState(readProgress);
  const [progress, setProgress] = useState(loaded.progress);
  const [saveError, setSaveError] = useState(false);
  const [showLoadWarning, setShowLoadWarning] = useState(
    Boolean(loaded.warning),
  );
  const [queue, setQueue] = useState(cards.map((card) => card.id));
  const [mode, setMode] = useState<"all" | "review">("all");
  const [revealed, setRevealed] = useState(false);
  const [complete, setComplete] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const didMount = useRef(false);
  const card =
    cards.find((item) => item.id === progress.currentCard) ?? cards[0];
  const position = Math.max(0, queue.indexOf(card.id));
  const known = cards.filter(
    (item) => progress.ratings[item.id] === "known",
  ).length;
  const again = cards.filter((item) => progress.ratings[item.id] === "again");
  const reviewed = Object.keys(progress.ratings).length;

  useEffect(() => {
    setSaveError(!saveProgress(progress));
  }, [progress]);
  useEffect(() => {
    if (didMount.current) {
      headingRef.current?.focus({ preventScroll: true });
      if (window.matchMedia("(max-width: 760px)").matches) {
        cardRef.current?.scrollIntoView({ block: "start", behavior: "auto" });
      }
    }
    didMount.current = true;
  }, [card.id, revealed, complete]);

  function goTo(id: string) {
    setProgress((previous) => ({ ...previous, currentCard: id }));
    setRevealed(false);
    setComplete(false);
    setShowNotes(false);
    setResetRequested(false);
  }

  function startSession(ids: string[], nextMode: "all" | "review") {
    if (!ids.length) return;
    setQueue(ids);
    setMode(nextMode);
    goTo(ids[0]);
  }

  function rate(rating: Rating) {
    setProgress((previous) => ({
      ...previous,
      ratings: { ...previous.ratings, [card.id]: rating },
    }));
    if (position + 1 < queue.length) goTo(queue[position + 1]);
    else setComplete(true);
  }

  function resetRatings() {
    setProgress((previous) => ({ ...previous, ratings: {} }));
    startSession(
      cards.map((item) => item.id),
      "all",
    );
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#study">
        Skip to study card
      </a>
      <header className="site-header">
        <button
          className="brand"
          onClick={() =>
            startSession(
              cards.map((item) => item.id),
              "all",
            )
          }
          aria-label="Lumen, open full deck"
        >
          <span className="brand-icon">
            <Icon name="sun" size={24} />
          </span>
          <span>
            lumen<span className="brand-dot">.</span>
          </span>
        </button>
        <span className="header-caption">A LITTLE LEARNING, EVERY DAY</span>
        <span className="pilot-tag">
          <span />
          Optics pilot
        </span>
      </header>

      <main className="workspace">
        <aside className="deck-panel" aria-label="Optics deck">
          <div className="deck-intro">
            <p className="eyebrow">YOUR STUDY SPACE</p>
            <h1>
              See things
              <br />
              <em>more clearly.</em>
            </h1>
            <p className="intro-copy">
              A few minutes. A little curiosity.
              <br />
              One concept that stays with you.
            </p>
          </div>
          <div className="deck-cover">
            <div className="cover-top">
              <Icon name="book" />
              <span>DECK 001</span>
            </div>
            <h2>
              Optical
              <br />
              Physics
            </h2>
            <WaveMark />
            <div className="cover-bottom">
              <span>EXPERIMENTAL PHYSICS</span>
              <span>YEAR 04</span>
            </div>
          </div>
          <div className="deck-meta">
            <span>5 cards</span>
            <span>~12 min</span>
            <span>Based on Lipson et al.</span>
          </div>
          <nav className="topic-list" aria-label="Choose a card">
            {cards.map((item, index) => (
              <button
                key={item.id}
                className={`topic-button ${item.id === card.id && !complete ? "active" : ""}`}
                aria-current={
                  item.id === card.id && !complete ? "step" : undefined
                }
                onClick={() => {
                  setQueue(cards.map((entry) => entry.id));
                  setMode("all");
                  goTo(item.id);
                }}
              >
                <span className="topic-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.topic}</span>
                <span
                  className={`topic-state ${progress.ratings[item.id] ?? ""}`}
                >
                  {progress.ratings[item.id] === "known" ? (
                    <Icon name="check" size={15} />
                  ) : progress.ratings[item.id] === "again" ? (
                    <Icon name="repeat" size={15} />
                  ) : (
                    <span className="empty-dot" />
                  )}
                  <span className="sr-only">
                    {progress.ratings[item.id] === "known"
                      ? "Got it"
                      : progress.ratings[item.id] === "again"
                        ? "Review again"
                        : "Not reviewed"}
                  </span>
                </span>
              </button>
            ))}
          </nav>
          <div className="book-note">
            <Icon name="book" size={17} />
            <p>
              Adapted from <em>Optical Physics</em>, 4th edition. Each answer
              includes its exercise reference.
            </p>
          </div>
        </aside>

        <section className="study-panel" id="study" aria-label="Study session">
          <div className="session-heading">
            <div>
              <p className="eyebrow">
                {mode === "review"
                  ? "ANOTHER LOOK"
                  : "THINK. REVEAL. REMEMBER."}
              </p>
              <h2>
                {mode === "review"
                  ? "Your review session"
                  : "Make room for a new idea."}
              </h2>
            </div>
            <span className="session-count">
              {complete ? queue.length : position + 1}
              <span> / {queue.length}</span>
            </span>
          </div>
          <div
            className="session-track"
            role="img"
            aria-label={`Card ${complete ? queue.length : position + 1} of ${queue.length}`}
          >
            {queue.map((id) => (
              <span
                key={id}
                className={`${id === card.id && !complete ? "current" : ""} ${progress.ratings[id] === "known" ? "known" : ""} ${progress.ratings[id] === "again" ? "again" : ""}`}
              />
            ))}
          </div>

          {showLoadWarning && (
            <div className="notice" role="status">
              <span>{loaded.warning}</span>
              <button
                aria-label="Dismiss saved progress notice"
                onClick={() => setShowLoadWarning(false)}
              >
                ×
              </button>
            </div>
          )}
          {saveError && (
            <p className="notice" role="status">
              Your browser cannot save progress right now. You can study, but
              changes may be lost when you close this page.
            </p>
          )}

          {complete ? (
            <article
              ref={cardRef}
              className="flashcard completion"
              data-testid="session-complete"
            >
              <span className="completion-icon">
                <Icon name="sun" size={38} />
              </span>
              <p className="eyebrow">A LITTLE FURTHER THAN BEFORE</p>
              <h2 ref={headingRef} tabIndex={-1}>
                Good work.
                <br />
                <em>Let it settle.</em>
              </h2>
              <p>
                You’ve reached the end of this session. Revisit the ideas that
                need another look, or come back when you’re ready.
              </p>
              <div className="completion-stats">
                <div>
                  <strong>{known}</strong>
                  <span>got it</span>
                </div>
                <div>
                  <strong>{again.length}</strong>
                  <span>to revisit</span>
                </div>
                <div>
                  <strong>{cards.length - reviewed}</strong>
                  <span>unreviewed</span>
                </div>
              </div>
              {again.length > 0 && (
                <button
                  className="button primary"
                  onClick={() =>
                    startSession(
                      again.map((item) => item.id),
                      "review",
                    )
                  }
                >
                  <Icon name="repeat" />
                  Review {again.length} {again.length === 1 ? "card" : "cards"}
                </button>
              )}
              <button
                className="button secondary"
                onClick={() =>
                  startSession(
                    cards.map((item) => item.id),
                    "all",
                  )
                }
              >
                Study the full deck
                <Icon name="arrow" />
              </button>
            </article>
          ) : (
            <article
              ref={cardRef}
              key={`${card.id}-${revealed}`}
              className={`flashcard ${revealed ? "answer-side" : "question-side"}`}
              data-testid="flashcard"
            >
              <div className="card-top">
                <span className="topic-tag">{card.topic}</span>
                <span className="card-side">
                  {revealed ? "THE ANSWER" : "THE QUESTION"}
                  <Icon name={revealed ? "check" : "sun"} size={16} />
                </span>
              </div>
              {revealed ? (
                <div className="answer-content" data-testid="answer">
                  <p className="card-kicker">CHECK YOUR THINKING</p>
                  <h2 ref={headingRef} tabIndex={-1}>
                    {card.answer}
                  </h2>
                  <div className="equation">{card.equation}</div>
                  <ol className="solution-steps">
                    {card.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  <div className="takeaway">
                    <span>TAKE IT WITH YOU</span>
                    <p>{card.takeaway}</p>
                  </div>
                  <details className="source">
                    <summary>
                      <Icon name="book" size={16} />
                      Source & exercise reference
                    </summary>
                    <p>
                      Adapted from A. Lipson, S. G. Lipson & H. Lipson,{" "}
                      <em>Optical Physics</em>, 4th edition, exercise{" "}
                      {card.source.exercise}. Book p. {card.source.bookPage}{" "}
                      (PDF p. {card.source.pdfPage}); solutions, chapter{" "}
                      {card.source.solutionChapter}, pp.{" "}
                      {card.source.solutionPages}. Wording and numerical
                      examples are adapted for this pilot.
                    </p>
                  </details>
                </div>
              ) : (
                <div className="question-content">
                  <p className="card-kicker">
                    {card.kind.toUpperCase()}
                    <span> · </span>
                    {card.minutes} MIN
                  </p>
                  <h2 ref={headingRef} tabIndex={-1}>
                    {card.title}
                  </h2>
                  <p className="prompt">{card.prompt}</p>
                  <p className="given">{card.given}</p>
                  <div className="challenge">
                    <span>GO ONE STEP FURTHER</span>
                    <p>{card.challenge}</p>
                  </div>
                  <button
                    className="notes-toggle"
                    aria-expanded={showNotes}
                    aria-controls="thoughts"
                    onClick={() => setShowNotes((visible) => !visible)}
                  >
                    <Icon name="pencil" size={16} />
                    {showNotes
                      ? "Hide your notes"
                      : progress.notes[card.id]
                        ? "Your saved thoughts"
                        : "Jot down a thought"}
                    <span>optional</span>
                  </button>
                  {showNotes && (
                    <div id="thoughts" className="notes">
                      <label className="sr-only" htmlFor="note">
                        Your thoughts for this card
                      </label>
                      <textarea
                        id="note"
                        value={progress.notes[card.id] ?? ""}
                        maxLength={4000}
                        rows={3}
                        placeholder="An equation, an intuition, a question…"
                        onChange={(event) => {
                          const value = event.currentTarget.value;
                          setProgress((previous) => ({
                            ...previous,
                            notes: { ...previous.notes, [card.id]: value },
                          }));
                        }}
                      />
                      <span>
                        {(progress.notes[card.id] ?? "").length}/4000 ·{" "}
                        {saveError ? "Not saved" : "Saved on this device"}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="card-actions">
                {revealed ? (
                  <>
                    <p>How did you do?</p>
                    <div className="rating-buttons">
                      <button
                        className="button secondary"
                        onClick={() => rate("again")}
                        data-testid="rate-again"
                      >
                        <Icon name="repeat" />
                        Review again
                      </button>
                      <button
                        className="button primary"
                        onClick={() => rate("known")}
                        data-testid="rate-known"
                      >
                        Got it
                        <Icon name="check" />
                      </button>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => setRevealed(false)}
                    >
                      Back to question
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="button primary reveal-button"
                      onClick={() => setRevealed(true)}
                      data-testid="reveal"
                    >
                      Show answer
                      <Icon name="flip" />
                    </button>
                    <p>Take your time. Try recalling it before you flip.</p>
                  </>
                )}
              </div>
            </article>
          )}

          {!complete && (
            <div className="card-navigation">
              <button
                className="text-button"
                disabled={position === 0}
                onClick={() => goTo(queue[position - 1])}
              >
                <Icon name="back" size={17} />
                Previous
              </button>
              <span>Small steps. Deeper understanding.</span>
              <button
                className="text-button"
                disabled={position === queue.length - 1}
                onClick={() => goTo(queue[position + 1])}
              >
                Next
                <Icon name="arrow" size={17} />
              </button>
            </div>
          )}

          <section className="progress-summary" aria-label="Your progress">
            <div className="progress-label">
              <span className="eyebrow">YOUR PROGRESS</span>
              <span>
                <strong data-testid="known-count">{known}</strong> / 5
                understood
              </span>
            </div>
            <progress
              value={known}
              max={cards.length}
              aria-label="Cards understood"
            />
            <div className="progress-footer">
              <span>
                <i className="legend-dot known" />
                {known} got it <i className="legend-dot again" />
                {again.length} to revisit
              </span>
              <button
                className="text-button"
                disabled={!again.length}
                onClick={() =>
                  startSession(
                    again.map((item) => item.id),
                    "review",
                  )
                }
              >
                Review cards
                <Icon name="arrow" size={15} />
              </button>
            </div>
          </section>
          <div className="storage-footer">
            <span>
              <Icon name="save" size={14} />
              {saveError
                ? "Changes are not saved"
                : "Progress saved on this device"}
            </span>
            <button
              className="text-button"
              disabled={!reviewed}
              onClick={() => setResetRequested((requested) => !requested)}
            >
              Reset progress
            </button>
          </div>
          {resetRequested && (
            <div
              className="reset-confirm"
              role="group"
              aria-label="Confirm reset"
            >
              <p>Clear your card ratings? Your written notes will stay.</p>
              <button
                className="button secondary"
                onClick={() => setResetRequested(false)}
              >
                Keep progress
              </button>
              <button className="button primary" onClick={resetRatings}>
                Clear ratings
              </button>
            </div>
          )}
        </section>
      </main>
      <footer className="site-footer">
        <span>Made for moments of understanding.</span>
        <span>No account. Just you and an idea.</span>
      </footer>
    </div>
  );
}
