import { useState, useEffect } from "react";

function PasswordChecker({ password, setPasswordStrength }) {
  const [strength, setStrength] = useState("");
  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    const checkPassword = () => {
      const length = password.length >= 8;
      const uppercase = /[A-Z]/.test(password);
      const lowercase = /[a-z]/.test(password);
      const number = /[0-9]/.test(password);
      const special = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      const newCriteria = { length, uppercase, lowercase, number, special };
      setCriteria(newCriteria);

      const metCriteria = Object.values(newCriteria).filter(Boolean).length;
      let strengthLevel = "";

      if (metCriteria === 0) {
        strengthLevel = "";
      } else if (metCriteria <= 2) {
        strengthLevel = "Weak";
      } else if (metCriteria <= 4) {
        strengthLevel = "Medium";
      } else {
        strengthLevel = "Strong";
      }

      setStrength(strengthLevel);
      setPasswordStrength(strengthLevel); // Pass strength to parent
    };

    checkPassword();
  }, [password, setPasswordStrength]);

  return (
    <div className="mt-2 text-xs font-sans">
      {password && (
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              Security Strength
            </span>
            <span
              className={`text-[11px] font-bold ${
                strength === "Strong"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : strength === "Medium"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {strength || "Incomplete"}
            </span>
          </div>

          <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                strength === "Weak"
                  ? "w-1/3 bg-rose-500"
                  : strength === "Medium"
                  ? "w-2/3 bg-amber-500"
                  : strength === "Strong"
                  ? "w-full bg-emerald-500"
                  : "w-0"
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[11px]">
            <span
              className={`flex items-center gap-1 ${
                criteria.length
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-zinc-400 dark:text-zinc-500"
              }`}
            >
              {criteria.length ? "✓" : "○"} 8+ characters
            </span>
            <span
              className={`flex items-center gap-1 ${
                criteria.uppercase
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-zinc-400 dark:text-zinc-500"
              }`}
            >
              {criteria.uppercase ? "✓" : "○"} 1 uppercase
            </span>
            <span
              className={`flex items-center gap-1 ${
                criteria.number
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-zinc-400 dark:text-zinc-500"
              }`}
            >
              {criteria.number ? "✓" : "○"} 1 number
            </span>
            <span
              className={`flex items-center gap-1 ${
                criteria.special
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-zinc-400 dark:text-zinc-500"
              }`}
            >
              {criteria.special ? "✓" : "○"} 1 symbol
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PasswordChecker;
