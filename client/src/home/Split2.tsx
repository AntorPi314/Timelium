import TimeliumAI from './split2/TimeliumAI'
import TitleAndSearch from './split2/TitleAndSearch'
import SearchResult from './split2/SearchResult'

const Split2 = () => {
  return (
    <div className='w-[32%] h-full bg-[#381B5E]'>
      <TitleAndSearch/>
      <SearchResult/>
      <TimeliumAI/>
    </div>
  )
}

export default Split2