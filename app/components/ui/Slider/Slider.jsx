"use client"

import { Splide, SplideSlide } from '@splidejs/react-splide';
import Image from 'next/image';
import '@splidejs/react-splide/css';

const Slider = () => {
  return (
<div className='max-w-360 mx-auto h-100vh'>
<Splide aria-labelledby="My Favorite Images">
  <SplideSlide>
    <Image src="/image1.webp" alt="Image 1" width={1440} height={800}/>
  </SplideSlide>
  <SplideSlide>
    <Image src="/image2.webp" alt="Image 2" width={1440} height={800}/>
  </SplideSlide>
</Splide>
</div>
  )
}

export default Slider

