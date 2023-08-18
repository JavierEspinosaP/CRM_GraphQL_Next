'use client'

import { useState } from 'react'

import { useRouter, useParams } from 'next/navigation'

function editClient() {
  
  const params = useParams()

  console.log(params);

  return (
    <div>
      Hola
    </div>
  );
}

export default editClient