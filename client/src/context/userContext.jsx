import axios from 'axios';
import { createContext, useState,useEffect } from 'react';

export const UserContext = createContext({});
export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    useEffect(() => {
        if (!user) {
          axios.get('http://localhost:8000/api/profile').then(({ data }) => {
            console.log('User data:', data);
            setUser(data);  
          }).catch(err => {
            console.error('Error fetching user:', err);
          });
        }
      }, [user]); 
    const logout = () => {
        setUser(null);
        axios.post('http://localhost:8000/api/logout', {}, { withCredentials: true });
      };
    return (
        <UserContext.Provider value={{user,setUser,logout}}>
            {children}
        </UserContext.Provider>
    );
}