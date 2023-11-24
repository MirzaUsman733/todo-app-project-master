// ListsContext.js
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { firestore } from 'config/firebase'; // Import your Firebase configuration
import { useAuthContext } from './AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';

const ListsContext = createContext();

export function ListsProvider({ children }) {
  const { user } = useAuthContext();
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      if (user.uid) {
        const q = query(
          collection(firestore, 'lists'),
          // where('id', '==', 'all'),
          where('createdBy.uid', '==', user.uid)
        );
        // const q2 = query(
        //   collection(firestore,'lists'),
        //   where("listId", '==', 'all')
        // )
        const querySnapshot = await getDocs(q);
        const listsData = querySnapshot.docs.map((doc) => doc.data());
        setLists(listsData);
        setIsLoading(false);
      } else {
        // Handle the case when user or user.uid is undefined
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching lists: ', error);
      setIsLoading(false);
    }
  }, [user.uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <ListsContext.Provider value={{ lists, setLists, isLoading }}>
      {children}
    </ListsContext.Provider>
  );
}

export function useLists() {
  return useContext(ListsContext);
}
