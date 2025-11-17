import React, { useState, useCallback, useEffect } from 'react';
import ThemeToggle from './components/ThemeToggle';
import { COUNTRIES } from './constants/countries';
import whatsAppLogo from './assets/whatsapp-logo.svg';

// Use a direct image link to the official SVG as requested.
const WhatsAppLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img src={whatsAppLogo} alt="WhatsApp Logo" className={className} />
);

// This is the phone icon part of the official logo, for use in buttons.
const WhatsAppIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="120 150 250 250" fill="currentColor">
         <path d="M362.4 311.9c-4.4-2.2-26-12.8-30-14.3-4-1.5-6.9-2.2-9.8 2.2-2.9 4.4-11.4 14.3-14 17.2-2.6 2.9-5.2 3.3-9.6 1.1s-18.5-6.8-35.2-21.7c-13-11.6-21.7-25.9-24.3-30.3-2.6-4.4-.3-6.8 2-9 2-2.1 4.4-5.6 6.6-8.4 2.2-2.9 2.9-4.4 4.4-7.3 1.5-2.9 0-5.6-1.1-7.8s-9.8-23.4-13.4-32.1c-3.6-8.7-7.3-7.5-9.8-7.6h-8.7c-2.5 0-6.6 1.1-9.8 5.6-3.3 4.4-12.5 12.3-12.5 29.8 0 17.6 12.8 34.6 14.6 37.1 1.8 2.5 25.1 40.5 62.1 55.4 37 14.8 37 9.9 43.6 9.2 6.6-.7 21.2-8.7 24.2-17.2 3-8.4 3-15.6 2.2-17.2-1-1.6-3.7-2.6-8.1-4.8z"/>
    </svg>
);


const PrivacyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full m-4" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Privacy Notice</h2>
                    <div className="text-gray-600 dark:text-gray-300 space-y-4">
                        <p>
                            <strong>No Data Storage:</strong> This application is a client-side tool. We do not store, track, or share any phone numbers you enter. All operations happen exclusively within your browser.
                        </p>
                        <p>
                            <strong>Not Affiliated with WhatsApp:</strong> This is an independent tool and is not affiliated, associated, authorized, or endorsed by WhatsApp Inc.
                        </p>
                        <p>
                            <strong>Geolocation (Optional):</strong> To make things easier, we ask for your location to automatically suggest your country's dialing code. This is completely optional. If you grant permission, your coordinates are sent to the free{' '}
                            <a href="https://nominatim.org/privacy.html" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">
                                Nominatim service by OpenStreetMap
                            </a> to determine your country. We do not store your location.
                        </p>
                         <p>
                            <strong>Local Storage:</strong> We use your browser's <code>localStorage</code> to save your theme preference (light or dark mode). This is for your convenience and is not used for tracking.
                        </p>
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg text-right">
                    <button onClick={onClose} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [fullNumber, setFullNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPrivacyModalOpen, setPrivacyModalOpen] = useState(false);

  useEffect(() => {
    const fetchCountryCode = async (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`);
            if (!response.ok) {
                console.error("Reverse geocoding request failed.");
                return;
            }
            const data = await response.json();
            const countryCode = data?.address?.country_code?.toUpperCase();

            if (countryCode) {
                const country = COUNTRIES.find((c) => c.code === countryCode);
                if (country) {
                    setFullNumber((currentNumber) => {
                        // Only set if the user hasn't typed anything yet
                        if (currentNumber === '') {
                            return country.dial_code + ' ';
                        }
                        return currentNumber;
                    });
                }
            }
        } catch (error) {
            console.error("Failed to fetch country code:", error);
        }
    };

    const handleGeolocationError = (error: GeolocationPositionError) => {
        console.warn(`Geolocation error (${error.code}): ${error.message}`);
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchCountryCode, handleGeolocationError);
    }
  }, []);

  const handleSend = useCallback(() => {
    const trimmedNumber = fullNumber.trim();
    if (!trimmedNumber) {
      setError('Phone number cannot be empty.');
      return;
    }
    if (!trimmedNumber.startsWith('+')) {
      setError('Number must start with a country code (e.g., +1).');
      return;
    }
    
    const digitsOnly = trimmedNumber.replace(/\D/g, '');
    if (digitsOnly.length < 5) { // Basic validation for number length
        setError('Please enter a valid phone number.');
        return;
    }
    
    setError(null);

    const url = `https://wa.me/${digitsOnly}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [fullNumber]);

  const handlePhoneNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    setFullNumber(e.target.value);
  }, [error]);

  return (
    <>
      {isPrivacyModalOpen && <PrivacyModal onClose={() => setPrivacyModalOpen(false)} />}
      <div className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 md:p-10 transform transition-all duration-300">
            <div className="text-center mb-8">
              <WhatsAppLogo className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Quick WhatsApp</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Send WhatsApp messages to new numbers without adding them as contacts</p>
            </div>
            
            <div className="space-y-6">
              <div>
                  <label htmlFor="full-phone-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Phone Number
                  </label>
                  <div className="rounded-md shadow-sm">
                      <input
                          type="tel"
                          id="full-phone-number"
                          value={fullNumber}
                          onChange={handlePhoneNumberChange}
                          onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                  handleSend();
                              }
                          }}
                          placeholder="+1 555 123 4567"
                          className="block w-full rounded-md border-0 py-2.5 px-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                  </div>
                  {error && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>}
              </div>

              <button
                  onClick={handleSend}
                  className="w-full flex items-center justify-center gap-2 bg-whatsapp hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-green-500 transition-transform transform hover:scale-105 duration-200"
              >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>Send Message</span>
              </button>
            </div>
          </div>
          <footer className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
              <p>
                  &copy; {new Date().getFullYear()} Quick WhatsApp.
                  <a href="https://github.com/mwatney-mars/Quick-Whatsapp" target="_blank" rel="noopener noreferrer" className="ml-2 underline hover:text-primary-500">GitHub</a>
                  <button onClick={() => setPrivacyModalOpen(true)} className="ml-2 underline hover:text-primary-500">
                    Privacy Notice
                  </button>
              </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default App;
