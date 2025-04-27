import React from 'react';

type DTProp = {
  name: string,
  age?: number // optional
}

function DisplayText(props: DTProp) {
  return (
    <div>Hey, {props.name}. I'm {props.age} years old</div>
  )
}

export default DisplayText