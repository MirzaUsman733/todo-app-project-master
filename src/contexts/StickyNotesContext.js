import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { firestore } from 'config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuthContext } from './AuthContext';

const StickyNotesContext = createContext();

export function StickyNotesProvider({ children }) {
  const { user } = useAuthContext();
  const [stickyNotes, setStickyNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      if (user.uid) {
        const q = query(
          collection(firestore, 'sticky'),
          where('createdBy.uid', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const stickyNotesData = querySnapshot.docs.map((doc) => doc.data());
        setStickyNotes(stickyNotesData);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching sticky notes: ', error);
      setIsLoading(false);
    }
  }, [user.uid]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <StickyNotesContext.Provider
      value={{ stickyNotes, setStickyNotes, isLoading }}
    >
      {children}
    </StickyNotesContext.Provider>
  );
}

export function useStickyNotes() {
  return useContext(StickyNotesContext);
}
