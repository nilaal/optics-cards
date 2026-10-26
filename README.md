# Optics Cards

**Lumen** is a React + TypeScript flashcard pilot: five optics questions, tap-to-reveal worked answers, review ratings, and personal notes saved in browser local storage. The layout supports iPhone-sized screens and desktop browsers.

## Run locally

Requires Node.js 22.12 or newer (install with `brew install node` on this Mac).

```sh
npm ci
npm run dev
```

Open `http://localhost:5173`. For an iPhone on the same Wi-Fi, open the Network URL printed by Vite. Your Mac must remain awake and its firewall must allow the connection.

To verify the production build and the study flow:

```sh
npm run build
npx playwright install webkit
npm test
npm run preview
```

The production preview is at `http://localhost:4173`. Local browser checks use the installed Google Chrome and WebKit with an iPhone 13 viewport. They cover answer reveal, ratings and notes after reload, the review queue, resetting ratings, invalid/unavailable storage, keyboard focus, narrow-screen overflow, and automated WCAG A/AA checks. Local tests open browser windows; CI installs Chromium and WebKit and runs headless. Browser emulation is not a physical-iPhone test.

**Local verification:** the production build and all 16 browser checks passed on 26 October 2026. Screenshots: [desktop](docs/previews/desktop-question.png), [iPhone question](docs/previews/iphone-question.png), [iPhone answer](docs/previews/iphone-answer.png).

## Content and storage

- [Textbook preflight](docs/book-preflight.md): 190 matched exercise/solution entries, five selected cards, and issues found in the supplied solutions.
- [Exercise index](docs/exercise-index.csv): chapter and page references for all 190 entries.
- Edit `src/cards.ts` to change the five pilot cards. Keep IDs stable to preserve their saved ratings and notes.
- `lumen.optics.v1` in local storage holds the current card, ratings, and notes. Data stays in that browser on that origin; localhost, a LAN IP, and GitHub Pages have separate storage. There is no account or cross-device synchronization. Clearing browser site data erases progress.
- The app reports unavailable storage and remains usable for the current session. It does not include an offline service worker; loading the website requires a connection.
- Fonts are bundled with the app; there are no third-party requests during study sessions.
- The source PDFs and MATLAB archive live outside this project and are not included in the website or repository.

## GitHub Pages

`.github/workflows/pages.yml` builds the app and runs both browser projects before deployment from `main`. Pull requests run the checks without deploying. Vite uses relative asset paths so the app works under a repository URL. Select **GitHub Actions** as the Pages source in the repository settings.

## Study resources

Optics study resources for a fourth-year experimental physics student focusing on condensed matter physics. The resource selection prioritizes authoritative textbooks with worked solutions, including official instructor solutions manuals.

## Selected textbook

**Ariel Lipson, Stephen G. Lipson and Henry Lipson — _Optical Physics_, 4th edition, Cambridge University Press (2010).**

- **Status:** Selected as the project's primary textbook on 26 October 2026.
- **Print ISBN:** 9780521493451.
- **Why this book:** Broad coverage of general optics with laboratory examples and connections to crystallography, making it a strong fit for experimental and condensed matter physics.
- **Relevant topics:** Fourier methods, polarization in crystals, diffraction, interferometry, coherence, imaging, dispersion, and quantum optics and lasers.
- **Textbook:** [Cambridge book page](https://www.cambridge.org/highereducation/books/optical-physics/0F91B6E321F1DC01BD87BB7B79DC5EB4).

### Solutions companion

The [publisher's preface](https://assets.cambridge.org/97805214/93451/frontmatter/9780521493451_frontmatter.pdf) explicitly specifies online solutions to **all 190 end-of-chapter problems**. Cambridge lists the [solutions among its restricted instructor resources](https://academic-preview.cambridge.org/highereducation/books/optical-physics/0F91B6E321F1DC01BD87BB7B79DC5EB4/resources/instructor-resources/0F55C8FEB240C5B975544EA3EC05B237).

The user supplied the fourth-edition textbook PDF and chapter solution PDFs locally. These were inspected in the [preflight](docs/book-preflight.md): all 190 exercise IDs have corresponding solution entries, and the five pilot answers were checked individually.

## Other recommendations retained for reference

These are supplementary options; Lipson is the selected primary text.

| Resource | Relevance | Solutions availability |
| --- | --- | --- |
| **Mark Fox — _Optical Properties of Solids_, 2nd ed., Oxford University Press** | Recommended follow-on for condensed matter: absorption, interband transitions, excitons, luminescence, quantum confinement, free-electron response and phonons. Aimed at final-year undergraduates and beyond. [Description and contents](https://books.google.com/books/about/Optical_Properties_of_Solids.html?id=5WkVDAAAQBAJ). | The [author's university website](https://professor-mark-fox.sites.sheffield.ac.uk/books) confirms an instructor solutions manual and links to Oxford's request process. The book also contains a shorter solutions section; seek the separate manual for detailed work. |
| **Bahaa E. A. Saleh and Malvin Carl Teich — _Fundamentals of Photonics_, 3rd ed., Wiley** | Broad reference for experimental optics and photonics, including Gaussian beams, resonators, polarization, photonic crystals, semiconductor optics, detectors and nonlinear optics. [Publisher's description and contents](https://www.wiley.com/en-us/fundamentals-of-photonics-2-volume-set-3rd-edition-p-9781119506874). | Official [password-protected Solutions Manual](https://bcs.wiley.com/he-bcs/Books?action=resource&bcsId=11424&itemId=1119506875&resourceId=45287) on Wiley's instructor companion site. |
| **Rayf Shiell and Iain McNab — _Pedrottis' Introduction to Optics_, 4th ed., Cambridge University Press** | Alternative for a more guided course, starting from observable phenomena and using simulations, worked examples and conceptual questions with answers. [Publisher](https://www.cambridge.org/highereducation/books/pedrottis-introduction-to-optics/58EB7148796F7E2FF696A6070843C125); [Optica review](https://www.optica-opn.org/home/book_reviews/2025/0425/pedrottis_introduction_to_optics_fourth_edition/). | Official [Solutions Manual among restricted instructor resources](https://academic-preview.cambridge.org/highereducation/books/pedrottis-introduction-to-optics/58EB7148796F7E2FF696A6070843C125/resources/instructor-resources/294DB947D324D49B662E09CAA85FA90F), alongside assessment materials. |
| **Ajoy Ghatak and K. Thyagarajan — _Problems and Solutions in Optics and Photonics_, Tata McGraw Hill** | Additional problem-solving companion to the main textbook. | Worked solutions are included in the book. The [coauthor describes step-by-step solutions with conceptual explanations](https://ktrajan.wixsite.com/physicsphilosophyzen/books-authored). |

The supplementary manual listings above were verified during resource selection, but those files were not inspected. Their existence alone does not establish that every exercise has a fully worked solution. The supplied Lipson material has now been inspected separately, as documented in the preflight.
