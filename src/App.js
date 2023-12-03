// App.js
import React, { useState, useEffect } from 'react';
import './App.css'; // You can create this CSS file for styling
import AdminDashboard from './AdminDashboard';

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
  // Fetch data from the API endpoint
    fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch(error => console.error('Error fetching data:', error));
    }, []);
  // Handle search
  useEffect(() => {
    const filteredResults = users.filter(user =>
      Object.values(user).some(value =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredUsers(filteredResults);
    setCurrentPage(1); // Reset to the first page after a new search
  }, [searchTerm, users]);

  const handleDeleteSelected = () => {
    const updatedUsers = users.filter(user => !selectedRows.includes(user.id));
    setUsers(updatedUsers);
    setSelectedRows([]);
  };

  // Calculate current items to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  // Handle pagination

  // const paginate = page => setCurrentPage(page > Math.ceil(users.length/itemsPerPage) ? Math.ceil(users.length/itemsPerPage) : page);
  const paginate = (page)=> {
    if(page<1) { setCurrentPage(1); }
    else if(page>Math.ceil(users.length/itemsPerPage)) { setCurrentPage(Math.ceil(users.length/itemsPerPage)); }
    else { setCurrentPage(page); }
  }

  return (
    <div className="App">
      <AdminDashboard
        setSelectedRows={setSelectedRows}
        users={currentItems}
        allusers = {users}
        setUsers={setUsers}
        selectedRows={selectedRows}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSelectRow={rowId => setSelectedRows([...selectedRows, rowId])}
        onDeselectRow={rowId =>
          setSelectedRows(selectedRows.filter(id => id !== rowId))
        }
        onDeleteSelected={handleDeleteSelected}

        onPageChange={paginate}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}

export default App;
