import React from 'react';
import Avatar1 from "../../assets/avatar/Chick_Avatar1.png";
import Avatar2 from "../../assets/avatar/Chick_Avatar2.png";
import Avatar3 from "../../assets/avatar/Chick_Avatar3.png";
import Avatar4 from "../../assets/avatar/Chick_Avatar4.png";

export default function AvatarChange({onSelect}) {
    const avatars = [Avatar1, Avatar2, Avatar3, Avatar4];

  return (
    <div className='flex flex-wrap md:flex-nowrap w-full gap-10 md:gap-20 justify-center items-center '>
        {avatars.map((img, i) => (
            <img
                key={i}
                src={img}
                alt={`avatar-${i}`}
                onClick={() => onSelect(img)}
                className='w-20 h-20 md:w-40 md:h-40 rounded-full'
            />
        ))}
    </div>
  )
}

