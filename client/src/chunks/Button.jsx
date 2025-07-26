import React from 'react'

const Button = ({text, click}) => {
  return (
    <button
    onClick={click}
    className='bg-white text-black p-2 rounded-md text-sm cursor-pointer'
    >{text}</button>
  )
}

export default Button