import { SearchIcon } from 'lucide-react'
import React, { useState } from 'react'

const Search = ({inputs, outputs}) => {
    const [query, setQuery] = useState('')

    const handleChange = (e) => {
        setQuery(e.target.value)
        const searchedItems = inputs.filter(input => input.title.toLowerCase().includes(query.toLowerCase()))
        outputs(searchedItems)
    }

   
  return (
    <form className=' bg-white rounded-2xl flex h-10 items-center'>
        <SearchIcon className='mx-2'/>
        <input 
        className='w-full outline-none '
        onChange={handleChange}
        type="text" 
        />
    </form>
  )
}

export default Search