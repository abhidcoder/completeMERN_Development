import React, { useState, useContext  } from 'react';
import config from '../config.json';
import './UserForm.css';
import { UserContext } from '../UserContext';

export default function UpdateUser() {

    const serverUrl = config.serverUrl;

    const {selectedUser, setSelectedUser} = useContext(UserContext);

    const [formData, setFormData] = useState({
        name: selectedUser.Contact,
        cta: selectedUser.CTA,
        spoc: selectedUser.SPOC,
        mobile: selectedUser.Mobile,
        email: selectedUser.Email,
      });
  
     
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        
        });

        console.log(formData);
      };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

      //Regular expression for validation check
      const mobileNumberPattern = /^\d{10}$/;

       // Input is a valid 10-digit number
      if (mobileNumberPattern.test(formData.mobile)) {
         

        try {
          
          const requestBody = {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          };

          const Mobile = formData.mobile;
      
          const response = await fetch(serverUrl+'/updateUser/'+Mobile, requestBody);
          console.log(serverUrl+'/updateUser/'+Mobile);

          if (response.ok) {
            console.log('Update successful');
            window.alert('User has been updated');
          } else {
            console.error('Update failed');
            window.alert('User cannot be updated or the user does not exist');
          }
        } catch (error) {
          console.error('An error occurred:', error);
          window.alert('Internal server error please contact Admin');
        }

      } else {
        window.alert("please check that the mobile number is valid 10 digit number");
      }
      };
      
    
  return (
    <>
    <h1 className="heading" >Update User Form</h1>
    <p className="notice"> * Name and Mobile are Required fields</p>
    <div className="user-form">
       
      <form onSubmit={handleSubmit}>
        <label   style={{color:"red"}}>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            required={true}
            onChange={handleInputChange}
          />
        </label>
        <label>
          CTA:
          <input
            type="text"
            name="cta"
            value={formData.cta}
            onChange={handleInputChange}
          />
        </label>
        <label>
          SPOC:
          <input
            type="text"
            name="spoc"
            value={formData.spoc}
            onChange={handleInputChange}
          />
        </label>
        <label style={{color:"red"}}>
          Mobile:
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            required={true}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </label>
        <br></br>
        <button className="dbutton" type="submit">Submit</button>
      </form>
    </div>
    </>
  )
}




