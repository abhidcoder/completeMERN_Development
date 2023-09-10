import UserList from './UserList';
import AddUser from './AddAndDeleteForm/AddUser';
import Update from './AddAndDeleteForm/UpdateUser';
import NumberInput from './AddAndDeleteForm/NumberInput';
import {Routes,Route,BrowserRouter} from 'react-router-dom';
import { UserProvider } from './UserContext';

//Using App.js to handle the components to avoid the unecessary cluster at the root index.js

function App() {
  return (
    <div>
    <UserProvider>
      
    <BrowserRouter>
    <Routes>

    <Route index element={<UserList />} />
    <Route path="/AddUser" element={<AddUser />} />
    <Route path="/Update" element={<Update />} />
    <Route path="/numSearch" element={<NumberInput />} />

    </Routes>
    </BrowserRouter>

    </UserProvider>

    </div>
  );
}

export default App;
