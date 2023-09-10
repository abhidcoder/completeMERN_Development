import React, { useState, useEffect } from 'react';
import config from '../config.json';

export default function NumberInput() {


    const serverUrl = config.serverUrl;

    

    const [formData, setFormData] = useState({
        mobile:'',
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
            const Mobile = formData.mobile;
            const response = await fetch(serverUrl + '/fetchUserByNumber/' + Mobile, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
          
            if (response.ok) {
              console.log('Search was successful');
              const data = await response.json();
              window.alert('User Info --> ' + JSON.stringify(data));
            } else {
              console.error('Search failed');
              window.alert('User Not Found');
            }
          } catch (error) {
            console.error('An error occurred:', error);
            window.alert('Internal server error, please contact Admin');
          }
      } else {
        window.alert("please check that the mobile number is valid 10 digit number");
      }
      };


  return (
    <>
    <h1 className="heading" >Search By Mobile Number via API</h1>
    <p className="notice"> * Mobile is a Required field</p>
    <div className="user-form">
      <form onSubmit={handleSubmit}>
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
       
        <br></br>
        <button className="dbutton" type="submit">Submit</button>
      </form>
    </div>
    </>
  )
}
