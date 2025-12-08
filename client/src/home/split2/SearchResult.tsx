import React from 'react'
import SearchProfileCard from '../../components/ui/SearchProfileCard'

const SearchResult = () => {
  return (
    <div className='w-full h-[40%] items-center  flex flex-col'>

      <SearchProfileCard
        name="Antor Hawlader"
        tags={["AppDev", "ReactDev", "AndroidDev", "WebDev"]}
        avatar="https://i.imgur.com/6VBx3io.jpeg"
      />

      <SearchProfileCard
        name="Adnan Halimi"
        tags={["AppDev", "ReactDev", "WebDev"]}
        avatar="https://i.imgur.com/kq2fQH2.jpeg"
      />

      <SearchProfileCard
        name="Shaon Hossain"
        tags={["Dancer"]}
        avatar="https://i.imgur.com/tZqVxm8.jpeg"
      />
      
    </div>
  )
}

export default SearchResult
