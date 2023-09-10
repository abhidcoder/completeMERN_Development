import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import config from './config.json';
import './Welcome.css';

function UserList() {

  const serverUrl = config.serverUrl;

  //Using the State to set the UserList from the API
  const [userList, setUserList] = useState([]);

  

  //Getting the List of the users from the API
  //Using the fetch APIs Instead of Axios to avoid additional Dependencies for the project to be lighter resulting in faster proccessing.

  useEffect(() => {
    const getUserList = async () => {
      try {
        const response = await fetch(serverUrl +'/getClientLists', {
          method: 'GET', 
        });
        if (!response.ok) {
          throw new Error('API request failed');
        }
        const datas = await response.json();
        const data = datas.data;
        console.log("I am the DATA",data);
        setUserList(data);
      } catch (error) {
        console.error('API request failed: While Getting the ClientList', error);
      }
    };
    getUserList();
  }, []);  // Insering Empty dependency array to ensure that useEffect runs only once and not Making any unnecessary requests to API



  //Keeping the track of the Deleted User list so that /getClientLists Endpoint should not be hit over and over again
  const deleteUser = async (Mobile) => {
    try {

      // Making a POST request to the API to delete the user via API, treating phone number as a unique identifier
      // Using a parameterized way and POST request to hit the API
      // Using parameterized query to increases the performance and keeping it readable as the data is not sensitive
      // Processing the deletion data by using filteration at client side saves API from too many requests while getting the list from the API after the deletion of the client from the list.

      const response = await fetch(serverUrl +'/deleteUser/' + Mobile, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // Handle success (e.g., remove the row from the state)
        setUserList((userList) =>
        userList.filter((user) => user.Mobile !== Mobile)
        );
      } else {
        throw new Error('Delete request failed');
      }
    } catch (error) {
      console.error('Delete request failed:', error);
    }
  };

  const { selectedUser, setSelectedUser } = useContext(UserContext);

  const editUser = (user) => {
    setSelectedUser(user);
    //window.location.href = '/Update/'
  };



  // Filter the user list based on the search input

  const [searchText, setSearchText] = useState('');
  const [newFilteredList, setNewFilteredList] = useState([]);

  useEffect(() => {
    // Filter the user list based on the search input and update newFilteredList
    const filteredList = userList.filter((user) =>
      user.Contact.toLowerCase().includes(searchText.toLowerCase())
    );
    setNewFilteredList(filteredList); // Set new filtered list

    // If searchText is empty, use the entire userList
    if (searchText === '') {
      setNewFilteredList(userList);
    }
  }, [searchText, userList]);



  const [sortOrder, setSortOrder] = useState('asc');

  // Function to toggle the sorting order
  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
  };

   // Function to sort the userList
   const sortUserList = () => {
    const sortedList = [...userList].sort((a, b) => {
      const aName = a.Contact.toLowerCase();
      const bName = b.Contact.toLowerCase();

      if (sortOrder === 'asc') {
        return aName.localeCompare(bName);
      } else {
        return bName.localeCompare(aName);
      }
    });

    setUserList(sortedList);
    console.log("SORTED_DATA",sortedList)
  };


  return (
    <div>
      <h1 className="heading" >User Lists</h1>

      <div style={{ textAlign: 'right', marginRight: '10px' }}>
        <input
          type="text"
          placeholder="Search by Name/Contact field"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            padding: '15px',
            width : '17%',
            borderRadius: '5px',
            border: '1px solid #ccc',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        />
      </div>

      <div style={{ textAlign: 'center' }}>

        <a href="/AddUser">
          <button className="dbutton">
            Create
          </button>
        </a>

        <button className="dbutton_2" onClick={() => { toggleSortOrder(); sortUserList(); }}>
        Sort ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
        </button>
        
        <a href="/numSearch">
        <button className="dbutton_3" >
        Seach by Number
        </button>
        </a>

        </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Contact</th>
            <th>CTA</th>
            <th>spoc</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>CreatedDate</th>
          </tr>
        </thead>
        <tbody>
          {newFilteredList.map((user) => (
            <tr key={user.Mobile}>
              <td>{user.Contact}</td>
              <td>{user.CTA}</td>
              <td>{user.SPOC}</td>
              <td>{user.Mobile}</td>
              <td>{user.Email}</td>
              <td>{user.CreatedDate}</td>
              <td className="actions">
                <span>
            
                <Link className="edit-button" onClick={() => editUser(user)} to="/Update/">
                  Edit
                </Link>
                </span>
              </td>
              <td className="actions">
                <span>
                  <button  className="delete-button"
                  onClick={() => deleteUser(user.Mobile)}>Delete</button>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
