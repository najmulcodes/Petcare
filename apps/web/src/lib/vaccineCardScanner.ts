import type { CreateVaccinationInput } from "../hooks/useVaccinations";

type TesseractMessage = {
  progress?: number;
  status?: string;
};

type TesseractResult = {
  data: {
    text: string;
    confidence?: number;
  };
};

type TesseractApi = {
  recognize: (
    image: Blob | File | string,
    language: string,
    options?: { logger?: (message: TesseractMessage) => void }
  ) => Promise<TesseractResult>;
};

declare global {
  interface Window {
    Tesseract?: TesseractApi;
  }
}

export interface VaccinationScanResult {
  extractedText: string;
  confidence: number;
  fields: Partial<CreateVaccinationInput>;
}

const TESSERACT_CDN = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";

let tesseractLoader: Promise<TesseractApi> | null = null;

function normalizeSpacing(input: string): string {
  return input.replace(/[ \t]+/g, " ").replace(/\r/g, "").trim();
}

function normalizeDate(dateValue: string): string | null {
  const cleaned = dateValue.trim().replace(/[.,]/g, "/").replace(/\s+/g, "/");
  const separators = ["-", "/"];

  for (const separator of separators) {
    const parts = cleaned.split(separator).map((part) => part.trim());
    if (parts.length !== 3) continue;

    let year = "";
    let month = "";
    let day = "";

    if (parts[0].length === 4) {
      [year, month, day] = parts;
    } else if (parts[2].length === 4) {
      [day, month, year] = parts;
    } else {
      continue;
    }

    const y = Number(year);
    const m = Number(month);
    const d = Number(day);

    if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) continue;
    if (y < 2000 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) continue;

    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  return null;
}

function findLabeledValue(lines: string[], labels: string[]): string | null {
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    const match = labels.find((label) => lowerLine.includes(label));
    if (!match) continue;

    const splitPattern = new RegExp(`${match}\\s*[:\\-]?\\s*`, "i");
    const value = line.replace(splitPattern, "").trim();
    if (value) return value;
  }

  return null;
}

function parseVaccinationText(text: string): Partial<CreateVaccinationInput> {
  const lines = text
    .split("\n")
    .map((line) => normalizeSpacing(line))
    .filter((line) => line.length > 1);

  const vaccineKeywords = [
    "rabies",
    "dhpp",
    "dhppi",
    "distemper",
    "parvo",
    "bordetella",
    "fvrcp",
    "lepto",
    "influenza",
    "booster",
    "vaccine",
    "vaccination",
  ];

  const vaccineName =
    findLabeledValue(lines, ["vaccine name", "vaccine", "vaccination", "product"]) ??
    lines.find((line) => vaccineKeywords.some((keyword) => line.toLowerCase().includes(keyword))) ??
    "";

  const dateCandidates = lines
    .flatMap((line) => {
      const matches = line.match(/\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b|\b\d{1,2}[-/]\d{1,2}[-/]\d{4}\b/g);
      return matches ?? [];
    })
    .map(normalizeDate)
    .filter((value): value is string => Boolean(value));

  const administeredAt =
    normalizeDate(findLabeledValue(lines, ["date administered", "administered", "date given", "vaccinated on"]) ?? "") ??
    dateCandidates[0];

  const nextDueAt =
    normalizeDate(findLabeledValue(lines, ["next due", "due date", "next vaccine", "booster due"]) ?? "") ??
    dateCandidates[1];

  return {
    vaccine_name: vaccineName,
    administered_at: administeredAt,
    next_due_at: nextDueAt,
  };
}

async function loadTesseract(): Promise<TesseractApi> {
  if (window.Tesseract) return window.Tesseract;

  if (!tesseractLoader) {
    tesseractLoader = new Promise<TesseractApi>((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${TESSERACT_CDN}"]`);

      if (existingScript) {
        existingScript.addEventListener("load", () => {
          if (window.Tesseract) resolve(window.Tesseract);
          else reject(new Error("Tesseract did not initialize correctly."));
        });
        existingScript.addEventListener("error", () => reject(new Error("Unable to load OCR support.")));
        return;
      }

      const script = document.createElement("script");
      script.src = TESSERACT_CDN;
      script.async = true;
      script.onload = () => {
        if (window.Tesseract) resolve(window.Tesseract);
        else reject(new Error("Tesseract did not initialize correctly."));
      };
      script.onerror = () => reject(new Error("Unable to load OCR support."));
      document.head.appendChild(script);
    });
  }

  return tesseractLoader;
}

export async function scanVaccinationCard(
  file: File,
  onProgress?: (message: string) => void
): Promise<VaccinationScanResult> {
  const tesseract = await loadTesseract();
  onProgress?.("Reading vaccine card...");

  const result = await tesseract.recognize(file, "eng", {
    logger: (message) => {
      if (!message.status) return;
      if (typeof message.progress === "number") {
        onProgress?.(`${message.status} ${Math.round(message.progress * 100)}%`);
        return;
      }
      onProgress?.(message.status);
    },
  });

  const extractedText = normalizeSpacing(result.data.text);
  return {
    extractedText,
    confidence: result.data.confidence ?? 0,
    fields: parseVaccinationText(result.data.text),
  };
}
