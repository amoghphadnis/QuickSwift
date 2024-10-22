import React,{useEffect,useContext,useState} from 'react';
import { useNavigate} from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { jwtDecode } from 'jwt-decode';

const AdminUsers = () => {
    const {  setUserType } = useContext(UserContext); 
    const navigate = useNavigate();
    const [users, setUsers] = useState(null);

  


    useEffect(() => {
        const fetchAllUserData = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    const currentTime = Date.now() / 1000; // Current time in seconds
          
                    // Check if the token is expired
                    if (decodedToken.exp < currentTime) {
                      console.log('Token expired');
                      handleLogout(); // Log the user out if the token has expired
                    }
                    const response = await fetch('http://localhost:5000/graphql', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`, // Pass the token in the header
                        },
                        body: JSON.stringify({
                          query: `
                            query GetAllUsers {
                              getAllUsers {
                                id
                                userId
                                username
                                email
                                userType
                                status
                                driverInfo {
                                  driverLicense
                                  vehicle {
                                    make
                                    model
                                    year
                                    licensePlate
                                  }
                                }
                                businessInfo {
                                  businessLicense
                                  businessType
                                  businessLocation {
                                    address
                                    city
                                    postalCode
                                  }
                                }
                              }
                            }
                          `
                        }),
                      });
                      const result = await response.json();
                      if (result.errors) {
                        console.error('Error fetching users:', result.errors);
                        return [];
                      }
                    setUsers(result.data.getAllUsers);
                    console.log('id...!!',result.data.getAllUsers.id)

                    console.log('data...!!',result.data.getAllUsers)
                  } catch (error) {
                    console.error('Failed to decode token:', error);
                    handleLogout(); // Log out if token is invalid
                  }
            }
    
            
        }

            fetchAllUserData();
            
         
      
        
       
    },[])

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserType(null); // Reset user context
        navigate('/login'); // Redirect to login page
      };

    return(
        <div>
      {users && users.length > 0 ? (
        users.map(user => (
          <div key={user.userId} className="user-card">
            <h2>{user.username} ({user.userType})</h2>
            <p>Email: {user.email}</p>
            <p>Status: {user.status}</p>
            
            {user.userType === 'business' && user.businessInfo && (
              <div>
                <h3>Business Details:</h3>
                <p>License: {user.businessInfo.businessLicense}</p>
                <p>Type: {user.businessInfo.businessType}</p>
                <p>Location: {user.businessInfo.businessLocation.address}, {user.businessInfo.businessLocation.city}, {user.businessInfo.businessLocation.postalCode}</p>
              </div>
            )}

            {user.userType === 'driver' && user.driverInfo && (
              <div>
                <h3>Driver Details:</h3>
                <p>License: {user.driverInfo.driverLicense}</p>
                <p>Vehicle: {user.driverInfo.vehicle?.make} {user.driverInfo.vehicle?.model} ({user.driverInfo.vehicle?.year})</p>
                <p>License Plate: {user.driverInfo.vehicle?.licensePlate}</p>
              </div>
            )}

            <div className="user-actions">
              <button onClick={() => approveUser(user.id)}>Approve</button>
              <button onClick={() => rejectUser(user.id)}>Reject</button>
            </div>
          </div>
        ))
      ) : (
        <p>No users found.</p>
      )}
    </div>
    )

    
    
}

const approveUser = async (id) => {
    console.log('userId...!!',id)
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found, user not authenticated.');
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
                    mutation ApproveUser($id: ID!) {
                        approveUser(id: $id) {
                            id
                            userId
                            username
                            status
                        }
                    }
                `,
                variables: {
                    id,
                },
            }),
        });

        const data = await response.json();
        if (data.errors) {
            console.error('Error approving user:', data.errors);
            return;
        }

        console.log('User approved successfully:', data.data.approveUser);
        // Optionally, refresh the user list or update the state here
    } catch (error) {
        console.error('Error approving user:', error);
    }
};

const rejectUser = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found, user not authenticated.');
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
                    mutation RejectUser($id: ID!) {
                        rejectUser(id: $id) {
                            id
                            userId
                            status
                        }
                    }
                `,
                variables: {
                    id,
                },
            }),
        });

        const data = await response.json();
        if (data.errors) {
            console.error('Error rejecting user:', data.errors);
            return;
        }

        console.log('User rejected successfully:', data.data.rejectUser);
        // Optionally, refresh the user list or update the state here
    } catch (error) {
        console.error('Error rejecting user:', error);
    }
};

  
export default AdminUsers