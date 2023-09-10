import React, { useState } from 'react';
import config from '../config.json';
import './UserForm.css';



function AddUser() {

    const serverUrl = config.serverUrl;

    const [formData, setFormData] = useState({
        name: '',
        cta: '',
        spoc: '',
        mobile: '',
        email: '',
      });
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
       
       //Regular expression for validation check
       const mobileNumberPattern = /^\d{10}$/;

        // Input is a valid 10-digit number
       if (mobileNumberPattern.test(formData.mobile)) {
      
        try {
          
          const requestBody = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          };
      
          const response = await fetch(serverUrl+'/addUser/', requestBody);
     
      
          if (response.ok) {
            console.log('User added successfully');
            window.alert('User added successfully');
          } else {
            console.error('Creation failed');
            window.alert('User could not be added or PhoneNo / User already exists');
        
          }
        } catch (error) {
          console.error('An error occurred:', error);
          window.alert('Internal Server error please Contact Admin');
        }
      }
        else {
          window.alert("please check that the mobile number is valid 10 digit number");
        }
      };
    
  return (
    <>
    <h1 className="heading" >ADD User Form</h1>
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

export default AddUser;