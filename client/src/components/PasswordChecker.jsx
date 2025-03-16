import { useState, useEffect } from 'react';

function PasswordChecker({ password, setPasswordStrength }) {
  const [strength, setStrength] = useState('');
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
      let strengthLevel = '';
      let color = '';

      if (metCriteria === 0) {
        strengthLevel = '';
        color = '';
      } else if (metCriteria <= 2) {
        strengthLevel = 'Weak';
        color = 'bg-red-500';
      } else if (metCriteria <= 4) {
        strengthLevel = 'Medium';
        color = 'bg-yellow-500';
      } else {
        strengthLevel = 'Strong';
        color = 'bg-green-500';
      }

      setStrength(strengthLevel);
      setPasswordStrength(strengthLevel); // Pass strength to parent
    };

    checkPassword();
  }, [password, setPasswordStrength]);

  return (
    <div className="mt-2 text-sm font-merriweather">
      {password && (
        <>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-full h-2 bg-gray-700 rounded-full">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  strength === 'Weak'
                    ? 'w-1/3 bg-red-500'
                    : strength === 'Medium'
                    ? 'w-2/3 bg-yellow-500'
                    : strength === 'Strong'
                    ? 'w-full bg-green-500'
                    : 'w-0'
                }`}
              ></div>
            </div>
            <span className="text-gray-300">{strength}</span>
          </div>
          <ul className="space-y-1 text-gray-400">
            <li className={criteria.length ? 'text-green-400' : 'text-red-400'}>
              {criteria.length ? '✓' : '✗'} At least 8 characters
            </li>
            <li className={criteria.uppercase ? 'text-green-400' : 'text-red-400'}>
              {criteria.uppercase ? '✓' : '✗'} At least 1 uppercase letter
            </li>
            <li className={criteria.lowercase ? 'text-green-400' : 'text-red-400'}>
              {criteria.lowercase ? '✓' : '✗'} At least 1 lowercase letter
            </li>
            <li className={criteria.number ? 'text-green-400' : 'text-red-400'}>
              {criteria.number ? '✓' : '✗'} At least 1 number
            </li>
            <li className={criteria.special ? 'text-green-400' : 'text-red-400'}>
              {criteria.special ? '✓' : '✗'} At least 1 special character
            </li>
          </ul>
        </>
      )}
    </div>
  );
}

export default PasswordChecker;