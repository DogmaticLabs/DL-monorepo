import useLandingPageState from '@/hooks/useLandingPageState'
import {
  ArrowRight,
  CornerLeftUp,
  CornerRightUp,
  Loader2,
  Search,
  Trophy,
  User,
  Users,
} from 'lucide-react'
import Image from 'next/image'

const LandingPage2 = ({ onSubmit }: { onSubmit: (id: string) => void }) => {
  const {
    searchMode,
    groupSearchValue,
    bracketSearchValue,
    bracketFilterValue,
    selectedGroup,
    selectedBracket,
    showGroupDropdown,
    showBracketDropdown,
    showGroupSelection,
    dropdownRef,
    inputRef,
    bracketFilterInputRef,
    groupFilterInputRef,
    handleSearchChange,
    handleGroupSelect,
    toggleSearchMode,
    setGroupSearchValue,
    setBracketFilterValue,
    setSelectedGroup,
    setShowGroupDropdown,
    setShowBracketDropdown,
    setShowGroupSelection,
    setSelectedBracket,
    groups,
    groupsLoading,
    groupQuery,
    bracketsLoading,
    teams,
  } = useLandingPageState()

  console.log(selectedGroup)

  return (
    <div className='relative container mx-auto max-w-md inset-0 z-[-1] bg-[#1e293b] min-h-[100dvh] flex flex-col md:pt-[10%]'>
      <div>
        <div className='container mx-auto px-4 py-0 max-w-md'>
          {/* Logo */}
          <div className='flex justify-center -mt-2'>
            <Image src='/logo.png' alt='BracketWrap Logo' width={192} height={192} />
          </div>

          {/* Main Content */}
          <div className='space-y-1 -mt-4 md:min-w-[400px]'>
            <div className='text-center'>
              <h1 className='text-3xl font-bold text-white mb-1'>Find Your Bracket</h1>
              <p className='text-[#94a3b8]'>Paste your bracket or search for your group</p>
            </div>

            <div className='h-2'></div>

            {/* Search Box */}
            <div className='pt-2'>
              <div className='relative' ref={dropdownRef}>
                <div className='relative'>
                  {/* Group header when selecting bracket */}
                  {searchMode === 'group' && selectedGroup && showBracketDropdown && (
                    <div className='mb-3 flex items-center justify-between bg-[#374151] p-3 rounded-xl header-card'>
                      <div className='flex items-center'>
                        <Users className='h-5 w-5 text-[#94a3b8] mr-2' />
                        <div>
                          <div className='text-white font-medium'>{selectedGroup.name}</div>
                          <div className='flex items-center mt-1'>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                selectedGroup.public
                                  ? 'bg-[#ff6b35] text-white'
                                  : 'bg-[#3d4a61] text-[#94a3b8]'
                              }`}
                            >
                              {selectedGroup.public ? 'Public' : 'Private'}
                            </span>
                            <span className='text-xs text-[#94a3b8] ml-2'>
                              {selectedGroup.size} members
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* <button
                        onClick={() => {
                          if (selectedGroup) {
                            setGroupSearchValue(selectedGroup.groupSettings.name)
                          }
                          setShowBracketDropdown(false)
                          setShowGroupDropdown(true)
                          setSelectedGroup(null)
                        }}
                        className='px-3 py-2 bg-[#3d4a61] hover:bg-[#4d5a71] text-white text-xs rounded-full transition-colors shrink-0 ml-4'
                      >
                        Change Group
                      </button> */}
                    </div>
                  )}
                  {/* Only show search bar for initial group search or bracket ID */}
                  {!(showBracketDropdown && searchMode === 'group') && !showGroupSelection && (
                    <>
                      {searchMode !== 'group' ? (
                        <Trophy className='absolute left-4 top-1/2 transform -translate-y-1/2 text-[#94a3b8] h-5 w-5 z-50 pointer-events-none' />
                      ) : (
                        <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-[#94a3b8] h-5 w-5 z-50 pointer-events-none' />
                      )}
                      <input
                        ref={inputRef}
                        autoFocus={!selectedBracket && !selectedGroup}
                        type='text'
                        inputMode='text'
                        autoComplete='off'
                        className='w-full pl-12 pr-4 py-3 bg-[#374151] text-white placeholder-[#94a3b8] rounded-xl border-2 border-[#4b5563] focus:border-[#ff6b35] focus:bg-[#404a5e] hover:bg-[#404a5e] focus:outline-none transition-all duration-200 text-base'
                        placeholder={
                          searchMode === 'bracket'
                            ? 'Paste your ESPN Bracket ID or URL'
                            : 'Search for your ESPN Group'
                        }
                        value={searchMode === 'group' ? groupSearchValue : bracketSearchValue}
                        onChange={e => handleSearchChange(e.target.value)}
                        onFocus={() => {
                          if (searchMode === 'group') {
                            setSelectedGroup(null)
                            setSelectedBracket(null)
                            setShowGroupDropdown(true)
                            inputRef.current?.select()
                          }
                          if (searchMode === 'bracket' && bracketSearchValue) {
                            inputRef.current?.select()
                          }
                        }}
                      />
                      {groupsLoading && (
                        <div className='absolute right-4 top-1/2 transform -translate-y-1/2 text-[#94a3b8] h-5 w-5 z-50 pointer-events-none'>
                          <Loader2 className='animate-spin' />
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Group Dropdown */}
                {searchMode === 'group' &&
                  showGroupDropdown &&
                  !selectedGroup &&
                  groupSearchValue && (
                    <div className='absolute w-full mt-2 bg-white rounded-xl shadow-lg overflow-hidden z-20'>
                      <div className='max-h-[264px] overflow-y-auto'>
                        {groups?.map(group => (
                          <div
                            key={group.id}
                            className={`p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors flex justify-between items-center ${
                              group.name.toLowerCase() === groupSearchValue.toLowerCase()
                                ? 'bg-gray-50'
                                : ''
                            }`}
                            onClick={() => {
                              setSelectedGroup(group)
                              setGroupSearchValue(group.name)
                              setShowGroupDropdown(false)
                              setShowBracketDropdown(true)
                              // focus on the bracket search input and dont select the text
                              setTimeout(() => {
                                if (bracketFilterInputRef && bracketFilterInputRef.current) {
                                  bracketFilterInputRef.current.focus()
                                }
                              }, 0)
                            }}
                          >
                            <div className='flex flex-col'>
                              <div className='flex items-center'>
                                <Users className='h-5 w-5 text-gray-500 mr-2' />
                                <span className='font-medium text-gray-900'>{group.name}</span>
                              </div>
                              <div className='flex items-center mt-2'>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs ${
                                    group.public
                                      ? 'bg-[#ff6b35] text-white'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {group.public ? 'Public' : 'Private'}
                                </span>
                                <span className='text-xs text-gray-600 ml-2'>
                                  {group.size} members
                                </span>
                              </div>
                              <div className='mt-1'>
                                <span className='text-[10px] text-gray-400'>ID: {group.id}</span>
                              </div>
                            </div>
                            {group.logo && (
                              <div className='rounded-full p-1'>
                                <Image
                                  src={group.logo}
                                  alt={group.name}
                                  width={40}
                                  height={40}
                                  className='rounded-lg'
                                />
                              </div>
                            )}
                          </div>
                        ))}
                        {groups?.length === 0 && (
                          <div className='p-3 text-gray-400'>No groups found</div>
                        )}
                      </div>
                    </div>
                  )}

                {/* Group Selection for Bracket */}
                {showGroupSelection && selectedBracket && (
                  <>
                    {/* Bracket header when selecting group */}
                    <div className='mb-3 flex items-start justify-between bg-[#2d3a4f] p-3 rounded-xl header-card'>
                      <div className='flex items-start min-w-0'>
                        {/* TODO: Lookup winner logo using winnerId */}
                        {selectedBracket.winnerId && (
                          <Image
                            src={
                              teams[selectedBracket.winnerId]?.images.primary ||
                              '/placeholder-team.png'
                            }
                            alt='Winner'
                            width={28}
                            height={28}
                            className='h-7 w-7 mr-2 mt-0.5 shrink-0'
                          />
                        )}
                        <div className='min-w-0 flex-1'>
                          <h3 className='text-white font-medium break-words'>
                            {selectedBracket.name}
                          </h3>
                          <p className='text-sm text-[#94a3b8] mt-0.5'>
                            {selectedBracket.member.displayName}
                          </p>
                          <p className='text-[10px] text-[#6b7280] truncate'>
                            ID: {selectedBracket.id}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowBracketDropdown(true)
                          setShowGroupSelection(false)
                          setBracketFilterValue('')
                          // focus on the bracket search input and dont select the text
                          setTimeout(() => {
                            if (bracketFilterInputRef && bracketFilterInputRef.current) {
                              bracketFilterInputRef.current.focus()
                            }
                          }, 0)
                        }}
                        className='px-3 py-2 bg-[#3d4a61] hover:bg-[#4d5a71] text-white text-xs rounded-full transition-colors shrink-0 ml-4'
                      >
                        Change Bracket
                      </button>
                    </div>

                    {/* Group Selection with Search */}
                    <div className='absolute w-full mt-2 bg-white rounded-xl shadow-lg overflow-hidden z-20'>
                      <div className='p-3 bg-gray-50 border-b border-gray-100'>
                        <div className='relative'>
                          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                          <input
                            type='text'
                            className='w-full pl-9 pr-3 py-2 bg-white text-gray-900 placeholder-gray-400 rounded-lg border border-gray-200 focus:outline-none focus:border-[#ff6b35] text-base'
                            placeholder='Search groups...'
                            value={groupSearchValue}
                            onChange={e => setGroupSearchValue(e.target.value)}
                            ref={groupFilterInputRef}
                          />
                        </div>
                      </div>
                      <div className='max-h-[264px] overflow-y-auto'>
                        {selectedBracket.groups.map(group => (
                          <div
                            key={group.id!}
                            className='p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors'
                            onClick={() => handleGroupSelect(group)}
                          >
                            <div className='flex flex-col'>
                              <div className='flex items-center'>
                                <Users className='h-5 w-5 text-gray-500 mr-2' />
                                <span className='font-medium text-gray-900'>{group.name}</span>
                              </div>
                              <div className='flex items-center mt-2'>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    group.public
                                      ? 'bg-[#ff6b35] text-white'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {group.public ? 'Public' : 'Private'}
                                </span>
                                <span className='text-xs text-gray-600 ml-2'>
                                  {group.size} members
                                </span>
                              </div>
                              <div className='mt-1'>
                                <span className='text-[10px] text-gray-400'>ID: {group.id}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Bracket Selection with Search */}
                {searchMode === 'group' && selectedGroup && showBracketDropdown && (
                  <div
                    className={`${searchMode === 'group' && !selectedBracket ? 'absolute' : 'relative'} w-full mt-2 bg-white rounded-xl shadow-lg overflow-hidden z-20`}
                  >
                    <div className='p-3 bg-gray-50 border-b border-gray-100'>
                      <div className='relative'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                        <input
                          type='text'
                          className='w-full pl-9 pr-3 py-2 bg-white text-gray-900 placeholder-gray-400 rounded-lg border border-gray-200 focus:outline-none focus:border-[#ff6b35] text-base'
                          placeholder='Search brackets...'
                          value={bracketFilterValue}
                          onChange={e => setBracketFilterValue(e.target.value)}
                          ref={bracketFilterInputRef}
                        />
                        {bracketsLoading && (
                          <div className='absolute right-4 top-1/2 transform -translate-y-1/2 text-[#94a3b8] h-5 w-5 z-50 pointer-events-none'>
                            <Loader2 className='animate-spin' />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='max-h-[264px] overflow-y-auto'>
                      {groupQuery.data?.brackets
                        .filter(
                          bracket =>
                            !bracketFilterValue ||
                            bracket.name.toLowerCase().includes(bracketFilterValue.toLowerCase()) ||
                            bracket.member.displayName
                              .toLowerCase()
                              .includes(bracketFilterValue.toLowerCase()),
                        )
                        .map(bracket => (
                          <div
                            key={bracket.id}
                            className='p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors'
                            onClick={() => {
                              setSelectedBracket(bracket)
                              setShowBracketDropdown(false)
                              setBracketFilterValue('') // Clear filter when selecting a bracket
                            }}
                          >
                            <div className='flex items-center justify-between ml-1'>
                              <div>
                                <div className='flex items-center'>
                                  <Trophy className='h-4 w-4 text-[#ff6b35] mr-2' />
                                  <span className='font-medium text-gray-900'>{bracket.name}</span>
                                </div>
                                <div className='mt-1 text-sm text-gray-500'>
                                  {bracket.member.displayName}
                                </div>
                                <div className='mt-1'>
                                  <span className='text-[10px] text-gray-400'>
                                    ID: {bracket.id}
                                  </span>
                                </div>
                              </div>
                              <div className='flex items-center'>
                                {bracket.winnerId && (
                                  <Image
                                    src={
                                      teams[bracket.winnerId]?.images.primary ||
                                      '/placeholder-team.png'
                                    }
                                    alt='Team Logo'
                                    width={32}
                                    height={32}
                                    className='h-8 w-8'
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className='h-0.5'></div>

            {/* OR Divider */}
            <div className='flex items-center justify-center'>
              <div className='border-t border-[#3d4a61] w-full'></div>
              <span className='px-4 text-[#94a3b8] font-medium'>or</span>
              <div className='border-t border-[#3d4a61] w-full'></div>
            </div>

            <div className='h-0.5'></div>

            {/* Toggle Button */}
            <button
              className='w-full bg-transparent hover:bg-[#2d3a4f] text-[#94a3b8] hover:text-white font-medium py-3 px-6 rounded-xl border border-[#3d4a61] transition-colors duration-200 flex items-center justify-center'
              onClick={toggleSearchMode}
            >
              {searchMode === 'bracket' ? (
                <div className='flex items-center transition-colors'>
                  <CornerLeftUp className='h-4 w-4 mr-2' />
                  <span>Switch to Group Search</span>
                  <CornerRightUp className='h-4 w-4 ml-2' />
                </div>
              ) : (
                <div className='flex items-center transition-colors'>
                  <CornerLeftUp className='h-4 w-4 mr-2' />
                  <span>Switch to Bracket Search</span>
                  <CornerRightUp className='h-4 w-4 ml-2' />
                </div>
              )}
            </button>

            {/* Spacing between toggle button and selected bracket details */}
            <div className='h-4'></div>

            {/* Selected Bracket Details */}
            {selectedBracket &&
              !showGroupSelection &&
              !showBracketDropdown &&
              !showGroupDropdown && (
                <div className='bg-[#2d3a4f] rounded-xl p-4 space-y-3 outline outline-white outline-1'>
                  <div className='pb-3 border-b border-[#3d4a61]'>
                    <div className='flex items-start justify-between mb-1'>
                      <div className='flex items-start min-w-0 pr-3'>
                        <Image
                          src={
                            teams[selectedBracket.winnerId]?.images.primary ||
                            '/placeholder-team.png'
                          }
                          alt='Winner'
                          className='h-7 w-7 mr-2 -mt-1'
                          width={28}
                          height={28}
                        />
                        <div className='min-w-0'>
                          <h3 className='text-white font-medium break-words truncate'>
                            {selectedBracket.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-end justify-between'>
                      <div className='flex flex-col'>
                        <div className='flex items-center'>
                          <User className='h-4 w-4 text-[#94a3b8] mr-2' />
                          <span className='text-sm text-[#94a3b8]'>
                            {selectedBracket.member.displayName}
                          </span>
                        </div>
                        <p className='text-[10px] text-[#6b7280] truncate mt-3'>
                          ID: {selectedBracket.id}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setShowBracketDropdown(true)
                          setBracketFilterValue('') // Clear filter when changing groups
                          setTimeout(() => {
                            if (bracketFilterInputRef && bracketFilterInputRef.current) {
                              bracketFilterInputRef.current.focus()
                            }
                          }, 0)
                        }}
                        className='px-3 py-2 bg-[#3d4a61] hover:bg-[#4d5a71] text-white text-xs rounded-full transition-colors shrink-0 ml-4'
                      >
                        Change Bracket
                      </button>
                    </div>
                  </div>

                  {selectedGroup && (
                    <div className=' border-[#3d4a61]'>
                      <div className='flex items-start justify-between mb-1'>
                        <div className='flex items-start min-w-0 pr-3'>
                          {selectedGroup.logo ? (
                            <Image
                              src={selectedGroup.logo}
                              alt='group logo'
                              width={28}
                              height={28}
                              className='h-7 w-7 mr-2 -mt-1 shrink-0'
                            />
                          ) : (
                            <Users className='h-5 w-5 text-[#94a3b8] mr-2 -mt-1' />
                          )}
                          <div className='min-w-0'>
                            <h3 className='text-white font-medium break-words truncate'>
                              {selectedGroup.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                      <div className='flex items-end justify-between'>
                        <div className='flex flex-col'>
                          <div className='flex items-center'>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                selectedGroup.public
                                  ? 'bg-[#ff6b35] text-white'
                                  : 'bg-[#3d4a61] text-[#94a3b8]'
                              }`}
                            >
                              {selectedGroup.public ? 'Public' : 'Private'}
                            </span>
                            <span className='text-xs text-[#94a3b8] ml-2'>
                              {selectedGroup.size} members
                            </span>
                          </div>
                          <p className='text-[10px] text-[#6b7280] truncate mt-3'>
                            ID: {selectedGroup.id}
                          </p>
                        </div>
                        {(selectedBracket?.groups?.length ?? 0) > 1 && (
                          <button
                            onClick={() => {
                              setGroupSearchValue('')
                              setShowGroupSelection(true)
                              // focus on the group search input but dont select the text
                              setTimeout(() => {
                                if (groupFilterInputRef && groupFilterInputRef.current) {
                                  groupFilterInputRef.current.focus()
                                }
                              }, 0)
                            }}
                            className='px-3 py-2 bg-[#3d4a61] hover:bg-[#4d5a71] text-white text-xs rounded-full transition-colors shrink-0 ml-4'
                          >
                            Switch Group
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Start Button - Outside the scroll container */}
      <div className='fixed md:static bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]'>
        <div className='container mx-auto max-w-md'>
          <button
            className={`w-full bg-[#ff6b35] font-bold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center ${
              selectedBracket
                ? 'hover:bg-[#ff5a1f] text-white'
                : 'opacity-60 cursor-not-allowed text-white'
            }`}
            onClick={() => {
              if (selectedBracket) {
                console.log('Starting...', {
                  searchMode,
                  selectedGroup,
                  selectedBracket,
                  searchValue: bracketFilterValue,
                })
                onSubmit(selectedBracket.id)
              }
            }}
            disabled={!selectedBracket}
          >
            <span className='mr-2'>Let's Go!</span>
            <ArrowRight className='h-5 w-5' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default LandingPage2
