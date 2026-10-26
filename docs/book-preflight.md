# Textbook and solutions preflight

Inspected on 26 October 2026: the user-supplied `Optical Physics.pdf` and the thirteen PDFs in `General Resources/Solutions/`.

The book is **A. Lipson, S. G. Lipson and H. Lipson, Optical Physics, fourth edition**. It has 592 PDF pages, of which 587 contain extractable text. The solutions comprise 121 PDF pages, all with extractable text. Printed textbook pages are 20 lower than the PDF page numbers in the exercise sections.

**190 numbered solution entries match textbook exercises across chapters 2–14.** This is a numbering and coverage check, not a mathematical validation of all 190 solutions. Some entries point to other exercises, external reading, figures, or MATLAB programs. They are not all self-contained flashcards.

| Chapter | Topic | Matched entries |
| --- | --- | ---: |
| 2 | Waves | 10 |
| 3 | Geometrical optics | 21 |
| 4 | Fourier theory | 13 |
| 5 | Electromagnetic waves | 14 |
| 6 | Polarization and anisotropic media | 17 |
| 7 | Scalar diffraction | 13 |
| 8 | Fraunhofer diffraction and interference | 21 |
| 9 | Interferometry | 17 |
| 10 | Waveguides and modulated media | 9 |
| 11 | Coherence | 15 |
| 12 | Image formation | 20 |
| 13 | Classical dispersion | 9 |
| 14 | Quantum optics and lasers | 11 |
| **Total** | | **190** |

The [exercise index](exercise-index.csv) records textbook problem-section occurrences and the first solution page for each matched ID. Occurrence pages are navigation aids rather than an automatic segmentation of question text. Figure references were excluded from the exercise count by matching against the numbered solution entries.

## Five pilot cards

| Exercise | Card | Book printed page | Book PDF page | Solution PDF pages |
| --- | --- | ---: | ---: | --- |
| 6.1 | Measure circular and unpolarized fractions | 195 | 215 | Chapter 06, p. 1 |
| 9.1 | Amplitude-grating efficiencies | 319 | 339 | Chapter 09, p. 1 |
| 9.9 | Recover phase from four interferograms | 320 | 340 | Chapter 09, pp. 4–5 |
| 11.7 | Visibility with unequal beam intensities | 400 | 420 | Chapter 11, pp. 4–5 |
| 12.4 | Suppress periodic bars by spatial filtering | 465 | 485 | Chapter 12, p. 4 |

These five entries were read individually. The formula pages for 9.9 and 11.7 were also rendered and visually checked, because extracted PDF equations can lose layout or symbols. The cards use concise adaptations, independent explanations, and new numerical examples where helpful. Each has explicit assumptions and a source reference. Original textbook and solutions PDFs remain outside this repository.

## Issues caught before adaptation

- **Exercise 9.9:** the solution writes `cos(φ − Δ)` on p. 4 but gives the stepped intensities corresponding to `cos(φ + Δ)` on p. 5. The pilot explicitly defines `Iⱼ = a + b cos(φ + jπ/2)` and consistently uses `atan2(I₃ − I₁, I₀ − I₂)`. A single arctangent of the ratio would lose quadrant information. Phase is undefined when the modulation vanishes.
- **Exercise 11.3, excluded from the pilot:** the printed solution gives `fλ/(4πσI) = 2 μm`. Its stated inputs, `f = 5 mm`, `λ = 500 nm`, and `σI = 1 mm`, give approximately **0.199 μm**. This is visible in the PDF itself, not just an extraction issue. Its Gaussian pinhole transmission convention also needs review before use.
- **Exercise 12.4:** the proposed notch-filter solution assumes a weak additive pattern. Actual occlusion multiplies the image and cannot generally be undone by simply blocking a few Fourier orders. The pilot keeps this qualification.
- **Examples requiring extra material:** 6.12 refers to solution 5.7; 12.18 points to MATLAB code; 14.8 points to external reading. An entry count therefore does not imply 190 ready-to-publish worked answers.

## Extending the deck

Use one recall task per card, preserve equation conventions and units, and check the answer against the actual rendered PDF. Split long derivations into separate cards. Include any diagram needed to make a question self-contained using an original drawing. Keep the exercise and page references with each adaptation.
