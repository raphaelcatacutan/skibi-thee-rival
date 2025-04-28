import React, { use, useState } from 'react';
import '../styles/SubmitBtn-style.css'


type SubmitBtnProp = {
  name: string;
}

export default function SubmitBtn(){
  const [username, setName] = useState("");
        // getter, setter

  const updateName = () => {
    setName("Jieco");
  }

  return (  
    <div>
      <div>Name: {username}</div>
      <button value={`Hello, ${username}`} onClick={updateName}>Hello</button>
    </div>
  )
}


// const SubmitBtn = () => {
//   return (
//     <div>
//       <input type='button'></input>
//     </div>
//   )
// }