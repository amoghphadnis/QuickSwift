import React ,{useContext,useEffect,useState} from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProfileComponent=()=>{
    const { userType, userId } = useContext(UserContext);
    const [user, setUser] = useState(null);

      console.log('userId..!!',userId)
      console.log('userType..!!',userType)

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
              throw new Error('No token found. Please log in.');
                return;
              }
              try {
                const response = await fetch('http://localhost:5000/graphql', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Pass the token in the header
                  },
                  body: JSON.stringify({
                    query: `
                      query GetUser($id: ID!, $userType: String!) {
                        getUser(id: $id, userType: $userType) {
                          username
                          email
                          userType
                          profilePicture
                        }
                      }
                    `,
                    variables: {
                      id: userId,    // Use userId from the params
                      userType: userType,  // Pass userType from the context
                    },
                  }),
                });
        
                const result = await response.json();
                if (result.data && result.data.getUser) {
                  setUser(result.data.getUser);

                } else {
                  throw new Error('Failed to fetch user data');
                }
              } catch (err) {
                throw new Error('Failed to fetch user data');
              }

        }
        fetchUserData();

    },[userId, userType])
    return (
        <div>
        <h2>Dashboard</h2>
       {/* Display userType from context */}
      {user ? (
        <>
          <h3>Profile Information</h3>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>User Type: {user.userType}</p>
          {user.profilePicture && (
            <div>
              <h4>Profile Picture:</h4>
              <img
                src={user.profilePicture}  // If base64 encoded, this should display correctly
                alt="Profile"
                style={{ width: '150px', height: '150px', borderRadius: '50%' }}  // Style the profile picture
              />
            </div>
          )}
        </>
      ) : (
        <p>Loading user data...</p>
      )}
      </div>
    )
}

export default ProfileComponent