export interface StudyCard {
  id: string;
  topic: string;
  title: string;
  kind: string;
  minutes: number;
  prompt: string;
  given: string;
  challenge: string;
  answer: string;
  equation: string;
  steps: string[];
  takeaway: string;
  source: {
    exercise: string;
    bookPage: number;
    pdfPage: number;
    solutionChapter: number;
    solutionPages: string;
  };
}

// Original concise adaptations, checked against the user's supplied 4th edition.
// The PDFs and full solution manual stay outside this project and deployment.
export const cards: StudyCard[] = [
  {
    id: "polarization",
    topic: "Polarization",
    title: "What is hiding in the beam?",
    kind: "Design an experiment",
    minutes: 2,
    prompt:
      "Your beam contains unpolarized light mixed with circularly polarized light of one handedness. How would you measure the fraction of each?",
    given:
      "Available: an ideal quarter-wave plate, a rotatable linear polarizer, and a power meter.",
    challenge:
      "After the wave plate, the analyzer gives a maximum of 8 mW and a minimum of 2 mW. Find both fractions.",
    answer: "60% circularly polarized · 40% unpolarized",
    equation: "Pᶜ = Pmax − Pmin     Pᵘ = 2Pmin",
    steps: [
      "Pass the beam through a quarter-wave plate designed for its wavelength. It converts the circular component to linear polarization and leaves the unpolarized component unpolarized.",
      "Rotate the analyzer. At the minimum it blocks the linear component and transmits half the unpolarized power: Pᵘ = 2 × 2 = 4 mW.",
      "At the maximum it also transmits all of the linear component: Pᶜ = 8 − 2 = 6 mW. The incident total is 8 + 2 = 10 mW, giving fractions 0.60 and 0.40.",
    ],
    takeaway:
      "A rotating linear analyzer alone cannot distinguish circularly polarized light from unpolarized light. Both give constant transmitted power.",
    source: {
      exercise: "6.1",
      bookPage: 195,
      pdfPage: 215,
      solutionChapter: 6,
      solutionPages: "1",
    },
  },
  {
    id: "grating",
    topic: "Diffraction",
    title: "Where does the light go?",
    kind: "Work it out",
    minutes: 3,
    prompt:
      "A thin amplitude grating has transmission t(x) = ½[1 + cos(Kx)]. Which diffraction orders appear, and what fraction of the incident power reaches each one?",
    given:
      "Use scalar, paraxial diffraction. The grating spans many periods; ignore finite-aperture broadening.",
    challenge:
      "Distinguish efficiency relative to incident power from the relative intensities of the transmitted orders.",
    answer: "Zero order: 25% · Each first order: 6.25%",
    equation: "t(x) = ½ + ¼eⁱᴷˣ + ¼e⁻ⁱᴷˣ",
    steps: [
      "Expand the cosine into two complex exponentials. The Fourier amplitudes are c₀ = ½, c₊₁ = ¼, and c₋₁ = ¼; all other orders vanish.",
      "Square each amplitude to obtain efficiency relative to incident power: η₀ = ¼ and η₊₁ = η₋₁ = ¹⁄₁₆.",
      "The total transmission is ¼ + ¹⁄₁₆ + ¹⁄₁₆ = ⅜ = 37.5%. Among the transmitted orders, the power ratio is 4 : 1 : 1.",
    ],
    takeaway:
      "Fourier coefficients describe field amplitudes. A detector measures their squared magnitudes.",
    source: {
      exercise: "9.1",
      bookPage: 319,
      pdfPage: 339,
      solutionChapter: 9,
      solutionPages: "1",
    },
  },
  {
    id: "phase",
    topic: "Interferometry",
    title: "Four frames, one phase.",
    kind: "Recover a measurement",
    minutes: 3,
    prompt:
      "You record four interferograms with phase steps of π/2. At one pixel, the measured intensities are I₀ = 14, I₁ = 7, I₂ = 6, and I₃ = 13. Recover the phase at that pixel.",
    given:
      "Define Iⱼ = a + b cos(φ + jπ/2), j = 0, 1, 2, 3, with b > 0 and constant a and b during the scan.",
    challenge:
      "Which inverse trigonometric function keeps the correct quadrant? How far must a normally incident reference mirror move per step?",
    answer: "φ ≈ 0.644 rad (36.9°) · Mirror step: λ/8",
    equation: "φ = atan2(I₃ − I₁, I₀ − I₂)",
    steps: [
      "Opposite frames eliminate the background: I₀ − I₂ = 2b cos φ = 8, while I₃ − I₁ = 2b sin φ = 6.",
      "Use atan2(6, 8) = 0.6435 rad. A single arctan of the ratio loses quadrant information. Here a = 10 and b = 5 are consistent with all four frames.",
      "A mirror displacement δ changes the round-trip path by 2δ, so Δφ = 4πδ/λ. Setting Δφ = π/2 gives δ = λ/8. The phase remains wrapped modulo 2π; spatial unwrapping requires additional assumptions.",
    ],
    takeaway:
      "Always define the phase-step sign. Reversing the scan reverses the recovered phase; at zero fringe contrast the phase is undefined.",
    source: {
      exercise: "9.9",
      bookPage: 320,
      pdfPage: 340,
      solutionChapter: 9,
      solutionPages: "4–5",
    },
  },
  {
    id: "coherence",
    topic: "Coherence",
    title: "Do faint fringes mean poor coherence?",
    kind: "Test your intuition",
    minutes: 2,
    prompt:
      "Two beams interfere with intensities I₁ = 4I₂. The measured fringe visibility is 0.48. What is the magnitude of their complex degree of coherence?",
    given:
      "The beams have the same polarization and matched spatial modes. The detector is linear and background light is negligible.",
    challenge:
      "Derive the visibility factor for unequal intensities. Would perfectly coherent beams necessarily give unit visibility here?",
    answer: "|γ₁₂| = 0.60 · The maximum visibility is 0.80",
    equation: "V = [2√(I₁I₂) / (I₁ + I₂)] |γ₁₂|",
    steps: [
      "Write the interference signal as I = I₁ + I₂ + 2√(I₁I₂)|γ₁₂| cos φ. The extrema have cosine equal to +1 and −1.",
      "Insert these extrema into V = (Imax − Imin)/(Imax + Imin). For I₁ = 4I₂, the intensity-balance factor is 2√4/(4 + 1) = 0.8.",
      "Therefore |γ₁₂| = 0.48/0.8 = 0.60. Even with perfect coherence, unequal powers limit the visibility to 0.80.",
    ],
    takeaway:
      "Check intensity balance, polarization, and overlap before interpreting fringe contrast as a coherence measurement.",
    source: {
      exercise: "11.7",
      bookPage: 400,
      pdfPage: 420,
      solutionChapter: 11,
      solutionPages: "4–5",
    },
  },
  {
    id: "filtering",
    topic: "Fourier optics",
    title: "Remove the pattern. Keep the image.",
    kind: "Design an experiment",
    minutes: 2,
    prompt:
      "An image is overlaid with narrow, equally spaced vertical bars. In a coherent 4f imaging system, how could you suppress those bars while preserving as much of the image as possible?",
    given:
      "A mask can be placed in the common Fourier plane of the two lenses. Treat the bars as a weak additive disturbance.",
    challenge:
      "Where do their diffraction orders lie? Why would blocking a whole line through the Fourier plane damage more of the image?",
    answer: "Use small notch stops at the bar-pattern orders.",
    equation:
      "Vertical bars → discrete orders on the horizontal frequency axis",
    steps: [
      "The vertical bars vary periodically across x, so their Fourier components lie at discrete horizontal spatial frequencies. Their spacing is inversely proportional to the bar period.",
      "Place small opaque stops over the unwanted nonzero orders in the Fourier plane. Keep the zero order and the other spatial frequencies to preserve the mean level and most image detail.",
      "Small notches remove fewer useful image frequencies than a continuous opaque line. Image information at the stopped frequencies is still lost. If the bars actually occlude the scene, the image is multiplied by the mask: simple notches cannot fully reconstruct hidden detail.",
    ],
    takeaway:
      "A spatial filter separates frequencies, not semantic objects. The additive-pattern approximation is part of the answer.",
    source: {
      exercise: "12.4",
      bookPage: 465,
      pdfPage: 485,
      solutionChapter: 12,
      solutionPages: "4",
    },
  },
];
