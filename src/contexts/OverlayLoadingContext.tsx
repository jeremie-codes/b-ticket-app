import { createContext, useCallback, useState, ReactNode } from "react";

interface OverlayLoadingContextProps {
  toggleLoading: (value?: boolean | null) => void;
  loading: boolean;
}

export const OverlayLoadingContext = createContext<OverlayLoadingContextProps>({
  toggleLoading: () => {},
  loading: false,
});

interface OverlayLoadingProviderProps {
  children: ReactNode;
}

const OverlayLoadingProvider = ({ children }: OverlayLoadingProviderProps) => {
  const [loading, setLoading] = useState(false);

  const toggleLoading = useCallback((value?: boolean | null) => {
    if (value !== null) {
      setLoading(value!);
    } else {
      setLoading((currentLoading) => !currentLoading);
    }
  }, []);

  const value: OverlayLoadingContextProps = {
    toggleLoading,
    loading,
  };

  return (
    <OverlayLoadingContext.Provider value={value}>
      {children}
    </OverlayLoadingContext.Provider>
  );
};

export default OverlayLoadingProvider;
