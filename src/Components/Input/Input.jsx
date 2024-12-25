import React from 'react'
import Style from './Input.module.css'

const Input = ({inputType, title, placeholder, handleClick}) => {
  return (
    <div className={Style.input}>
      <p>{title}</p>
      {inputType === "text" ? (
        <div className={Style.input__box}>
          <input 
            type='text' 
            className={Style.input__box__form} 
            placeholder={placeholder} 
            onChange={handleClick} 
          />
        </div>
      ) : (
        // Handling other input types can go here if needed
        <div className={Style.input__box}>
          <input 
            type={inputType} 
            className={Style.input__box__form} 
            placeholder={placeholder} 
            onChange={handleClick} 
          />
        </div>
      )}
    </div>
  )
}

export default Input
