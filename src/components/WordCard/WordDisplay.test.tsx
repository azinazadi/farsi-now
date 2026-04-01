import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import WordDisplay from "./WordDisplay";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    button: ({ children, whileTap: _whileTap, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { whileTap?: unknown }) => (
      <button {...props}>{children}</button>
    ),
  },
}));

describe("WordDisplay", () => {
  it("uses an ASCII-safe image path for Farsi words", () => {
    render(
      <WordDisplay
        word={{ word: "سلام", english: "hello", transliteration: "salaam" }}
        onPlayAudio={() => {}}
      />
    );

    const image = screen.getByRole("img", { name: "hello" });
    expect(image).toHaveAttribute("src", "/assets/images/u0633-u0644-u0627-u0645.png");
    expect(image.getAttribute("src")).not.toContain("سلام");
  });
});
