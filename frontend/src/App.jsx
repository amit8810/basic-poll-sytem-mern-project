import React, { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'

function App() {
  const navigate = useNavigate();

  const getCurrentUser = async () => {
    const response = await fetch(
      `http://localhost:8000/api/v1/users/current-user`,
      {
        credentials: "include",
      }
    );
      const jsonData = await response.json()
      if(jsonData.status == 200){
        navigate('/dashboard')
      } else {
        navigate('/login')
      }
  }

  useEffect(() => {
    getCurrentUser();
  })


  return (
    <div>App</div>
  )
}

export default App