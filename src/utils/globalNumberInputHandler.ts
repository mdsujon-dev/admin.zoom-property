/**
 * Global handler for all numeric inputs (Ant Design InputNumber & HTML type="number" inputs).
 * Prevents typing non-numeric text characters anywhere in the application.
 */
export const initGlobalNumberInputHandler = () => {
  if (typeof window === "undefined") return;

  // Intercept keydown events globally during capture phase
  window.addEventListener(
    "keydown",
    (e: KeyboardEvent) => {
      const target = e.target as HTMLInputElement | null;
      if (!target) return;

      const isInputNumber =
        target.classList?.contains("ant-input-number-input") ||
        target.closest?.(".ant-input-number") !== null ||
        target.type === "number";

      if (!isInputNumber) return;

      // Allow navigation, editing keys (Backspace, Tab, Enter, Arrows, etc.), and Ctrl/Cmd shortcuts
      if (e.ctrlKey || e.metaKey || e.key.length > 1) {
        return;
      }

      // Block any key that is not a digit (0-9), decimal point (.), or minus sign (-)
      if (!/[\d.-]/.test(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true // Capture phase: intercepts event before component handles it
  );

  // Intercept paste events globally to strip non-numeric text characters
  window.addEventListener(
    "paste",
    (e: ClipboardEvent) => {
      const target = e.target as HTMLInputElement | null;
      if (!target) return;

      const isInputNumber =
        target.classList?.contains("ant-input-number-input") ||
        target.closest?.(".ant-input-number") !== null ||
        target.type === "number";

      if (!isInputNumber) return;

      const pastedText = e.clipboardData?.getData("text");
      if (pastedText && /[^\d.-]/.test(pastedText)) {
        e.preventDefault();
        const cleanText = pastedText.replace(/[^\d.-]/g, "");

        const start = target.selectionStart ?? 0;
        const end = target.selectionEnd ?? 0;
        const currentVal = target.value || "";
        const newVal = currentVal.slice(0, start) + cleanText + currentVal.slice(end);

        const nativeSetter = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          "value"
        )?.set;
        nativeSetter?.call(target, newVal);
        target.dispatchEvent(new Event("input", { bubbles: true }));
      }
    },
    true
  );
};
