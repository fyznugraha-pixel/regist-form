import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  name: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  onChange?: (value: string) => void;
  value?: string;
}

export function CustomSelect({ name, options, placeholder = "-- Pilih --", required = false, onChange, value }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || "");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    setSelectedValue(val);
    setIsOpen(false);
    if (onChange) {
      onChange(val);
    }
  };

  const selectedOption = options.find(opt => opt.value === selectedValue);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Hidden input to ensure native form submission works */}
      <input type="hidden" name={name} value={selectedValue} required={required} />
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between glass-input px-4 py-3.5 border rounded-xl transition-all duration-200 
          ${isOpen ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)] bg-white/80 dark:bg-black/80' : 'border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/50 hover:border-slate-300 dark:hover:border-white/20'}`}
      >
        <span className={`${selectedValue ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-zinc-400'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-green-500' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 origin-top bg-white/95 dark:bg-[#12121A]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto p-1 py-2 custom-scrollbar">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors rounded-lg
                    ${selectedValue === option.value 
                      ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-medium' 
                      : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                >
                  {option.label}
                  {selectedValue === option.value && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
