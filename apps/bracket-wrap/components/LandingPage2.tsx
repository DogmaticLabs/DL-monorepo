import { ArrowRight, CornerLeftUp, CornerRightUp, Search, Trophy, Users } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

interface Group {
  id: string
  name: string
  isPublic: boolean
  size: number
}

interface Bracket {
  id: string
  name: string
  owner: string
  picks: number
  lastUpdated: string
  logo: string
  groups: string[] // Array of group IDs this bracket belongs to
}

const mockGroups: Group[] = [
  { id: '9fbed432-c422-4c4c-8c82-57515301ce7a', name: 'Catonsville', isPublic: true, size: 32 },
  { id: '234323db-d93f-3c92-9f0b-84e347b27209', name: 'Shoreas', isPublic: false, size: 16 },
  {
    id: '7b12e5f0-e797-11ee-85df-890ecb069f66',
    name: 'Championship Bracket',
    isPublic: true,
    size: 64,
  },
  { id: '8c23f6g1-e797-11ee-85df-890ecb069f66', name: 'Office Pool', isPublic: false, size: 25 },
  { id: '9d34h7i2-e797-11ee-85df-890ecb069f66', name: 'Family Madness', isPublic: false, size: 12 },
  { id: 'ae45j8k3-e797-11ee-85df-890ecb069f66', name: 'College Friends', isPublic: true, size: 28 },
  {
    id: 'bf56l9m4-e797-11ee-85df-890ecb069f66',
    name: 'Baltimore Brackets',
    isPublic: true,
    size: 45,
  },
]

const mockBrackets: Bracket[] = [
  // Multi-group bracket (in 5 groups)
  {
    id: 'c067n0p5-e797-11ee-85df-890ecb069f66',
    name: "Sarah's Perfect Bracket",
    owner: 'sarahsmith',
    picks: 63,
    lastUpdated: '2024-03-17',
    groups: [
      '9fbed432-c422-4c4c-8c82-57515301ce7a',
      '234323db-d93f-3c92-9f0b-84e347b27209',
      '8c23f6g1-e797-11ee-85df-890ecb069f66',
      '9d34h7i2-e797-11ee-85df-890ecb069f66',
      'ae45j8k3-e797-11ee-85df-890ecb069f66',
    ],
    logo: '/team-logos/1.png',
  },
  // 8 brackets in Catonsville group
  {
    id: '81cd7df0-e797-11ee-85df-890ecb069f66',
    name: 'Ben Ballin',
    owner: 'benshum',
    picks: 63,
    lastUpdated: '2024-03-15',
    groups: ['9fbed432-c422-4c4c-8c82-57515301ce7a'],
    logo: '/team-logos/2.png',
  },
  {
    id: 'd178q1r6-e797-11ee-85df-890ecb069f66',
    name: "Mike's March Magic",
    owner: 'mikejohnson',
    picks: 61,
    lastUpdated: '2024-03-16',
    groups: ['9fbed432-c422-4c4c-8c82-57515301ce7a'],
    logo: '/team-logos/3.png',
  },
  {
    id: 'e289s2t7-e797-11ee-85df-890ecb069f66',
    name: "Lisa's Lucky Picks",
    owner: 'lisawilson',
    picks: 62,
    lastUpdated: '2024-03-15',
    groups: ['9fbed432-c422-4c4c-8c82-57515301ce7a'],
    logo: '/team-logos/4.png',
  },
  {
    id: 'f390u3v8-e797-11ee-85df-890ecb069f66',
    name: "Tom's Tournament Take",
    owner: 'tomsmith',
    picks: 60,
    lastUpdated: '2024-03-16',
    groups: ['9fbed432-c422-4c4c-8c82-57515301ce7a'],
    logo: '/team-logos/5.png',
  },
  {
    id: '04a1w4x9-e798-11ee-85df-890ecb069f66',
    name: "Amy's Amazing Bracket",
    owner: 'amychen',
    picks: 63,
    lastUpdated: '2024-03-17',
    groups: ['9fbed432-c422-4c4c-8c82-57515301ce7a', '234323db-d93f-3c92-9f0b-84e347b27209'],
    logo: '/team-logos/6.png',
  },
  {
    id: '15b2y5z0-e798-11ee-85df-890ecb069f66',
    name: "David's Dream Team",
    owner: 'davidlee',
    picks: 59,
    lastUpdated: '2024-03-16',
    groups: ['9fbed432-c422-4c4c-8c82-57515301ce7a'],
    logo: '/team-logos/7.png',
  },
  {
    id: '26c3a6b1-e798-11ee-85df-890ecb069f66',
    name: "Rachel's Roundball",
    owner: 'rachelkim',
    picks: 62,
    lastUpdated: '2024-03-15',
    groups: ['9fbed432-c422-4c4c-8c82-57515301ce7a'],
    logo: '/team-logos/8.png',
  },
  {
    id: '37d4c7d2-e798-11ee-85df-890ecb069f66',
    name: "Chris's Championship Chase",
    owner: 'chrisp',
    picks: 61,
    lastUpdated: '2024-03-17',
    groups: ['9fbed432-c422-4c4c-8c82-57515301ce7a'],
    logo: '/team-logos/1.png',
  },
  // Other brackets in different groups
  {
    id: '48e5d8e3-e798-11ee-85df-890ecb069f66',
    name: "John's Jumpers",
    owner: 'johnb',
    picks: 58,
    lastUpdated: '2024-03-16',
    groups: ['7b12e5f0-e797-11ee-85df-890ecb069f66'],
    logo: '/team-logos/2.png',
  },
  {
    id: '59f6e9f4-e798-11ee-85df-890ecb069f66',
    name: "Emily's Elite Eight",
    owner: 'emilyh',
    picks: 60,
    lastUpdated: '2024-03-15',
    groups: ['bf56l9m4-e797-11ee-85df-890ecb069f66'],
    logo: '/team-logos/3.png',
  },
]

const LandingPage2 = ({ onSubmit }: { onSubmit: (id: string) => void }) => {
  const [searchMode, setSearchMode] = useState<'bracket' | 'group'>('group')
  const [groupSearchValue, setGroupSearchValue] = useState('')
  const [bracketSearchValue, setBracketSearchValue] = useState('')
  const [bracketFilterValue, setBracketFilterValue] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [showGroupDropdown, setShowGroupDropdown] = useState(false)
  const [showBracketDropdown, setShowBracketDropdown] = useState(false)
  const [selectedBracket, setSelectedBracket] = useState<Bracket | null>(null)
  const [showGroupSelection, setShowGroupSelection] = useState(false)
  const [lastSelectedGroupForBracket, setLastSelectedGroupForBracket] = useState<{
    [bracketId: string]: string
  }>({})
  const [lastGroupSearchState, setLastGroupSearchState] = useState<{
    selectedGroup: Group | null
    selectedBracket: Bracket | null
    groupSearchValue: string
  } | null>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // // Add preload effect for images
  // React.useEffect(() => {
  //   // Get unique logo URLs
  //   const logoUrls = [...new Set(mockBrackets.map(bracket => bracket.logo))]

  //   // Preload all images
  //   logoUrls.forEach(url => {
  //     const img = new Image()
  //     img.src = url
  //   })
  // }, []) // Only run once on mount

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowGroupDropdown(false)
        setShowBracketDropdown(false)
        setShowGroupSelection(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const filteredGroups = mockGroups.filter(group =>
    group.name.toLowerCase().includes(groupSearchValue.toLowerCase()),
  )

  console.log('fg', filteredGroups)

  const handleSearchChange = (value: string) => {
    if (searchMode === 'group') {
      setGroupSearchValue(value)
      setSelectedGroup(null)
      setShowGroupDropdown(true)
      setShowBracketDropdown(false)
    } else {
      // Handle bracket ID search
      setBracketSearchValue(value)
      const bracket = mockBrackets.find(b => b.id.toLowerCase() === value.toLowerCase())
      if (bracket) {
        setSelectedBracket(bracket)
        // Auto-select the first group the bracket belongs to
        const firstGroup = mockGroups.find(g => g.id === bracket.groups[0])
        setSelectedGroup(firstGroup || null)
        setShowGroupSelection(false)
        // Dismiss keyboard after successful bracket paste
        inputRef.current?.blur()
      } else {
        setSelectedBracket(null)
        setSelectedGroup(null)
        setShowGroupSelection(false)
      }
    }
  }

  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group)
    setGroupSearchValue(group.name)
    setShowGroupSelection(false)
    if (selectedBracket) {
      setLastSelectedGroupForBracket(prev => ({
        ...prev,
        [selectedBracket.id]: group.id,
      }))
    }
  }

  const toggleSearchMode = () => {
    const newMode = searchMode === 'bracket' ? 'group' : 'bracket'
    setSearchMode(newMode)

    if (newMode === 'group') {
      // Switching to group mode - restore previous group state if it exists
      if (lastGroupSearchState) {
        setSelectedGroup(lastGroupSearchState.selectedGroup)
        setSelectedBracket(lastGroupSearchState.selectedBracket)
        setGroupSearchValue(lastGroupSearchState.groupSearchValue)
        if (lastGroupSearchState.selectedGroup && lastGroupSearchState.selectedBracket) {
          setShowBracketDropdown(true)
        }
      } else {
        setSelectedGroup(null)
        setSelectedBracket(null)
        setGroupSearchValue('')
      }
    } else {
      // Switching to bracket mode - save current group state
      setLastGroupSearchState({
        selectedGroup,
        selectedBracket,
        groupSearchValue,
      })

      // Reset bracket search state
      setSelectedGroup(null)
      setSelectedBracket(null)
    }

    setShowGroupDropdown(false)
    setShowBracketDropdown(false)
    setShowGroupSelection(false)

    // Focus input when switching modes
    setTimeout(() => {
      if (newMode === 'group') {
        inputRef.current?.focus()
      } else {
        // When switching to bracket mode
        inputRef.current?.focus()
        inputRef.current?.select()

        // If there's a bracket search value, try to find the bracket
        if (bracketSearchValue) {
          const bracket = mockBrackets.find(
            b => b.id.toLowerCase() === bracketSearchValue.toLowerCase(),
          )
          if (bracket) {
            setSelectedBracket(bracket)
            // Use the last selected group if we have one, otherwise default to first group
            const lastGroupId = lastSelectedGroupForBracket[bracket.id]
            const group = lastGroupId
              ? mockGroups.find(g => g.id === lastGroupId)
              : mockGroups.find(g => g.id === bracket.groups[0])
            setSelectedGroup(group || null)
            setShowGroupSelection(false)
            inputRef.current?.blur()
          }
        }
      }
    }, 0)
  }

  return (
    <div className='relative inset-0 z-[-1] bg-[#1e293b] min-h-[100dvh] flex flex-col md:justify-center'>
      <div className=''>
        <div className='container mx-auto px-4 py-0 max-w-md'>
          {/* Logo */}
          <div className='flex justify-center -mt-2'>
            <Image
              src='/logo.png'
              alt='BracketWrap Logo'
              width={192}
              height={192}
              // className='w-48 h-auto'
            />
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
                                selectedGroup.isPublic
                                  ? 'bg-[#ff6b35] text-white'
                                  : 'bg-[#3d4a61] text-[#94a3b8]'
                              }`}
                            >
                              {selectedGroup.isPublic ? 'Public' : 'Private'}
                            </span>
                            <span className='text-xs text-[#94a3b8] ml-2'>
                              {selectedGroup.size} members
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (selectedGroup) {
                            setGroupSearchValue(selectedGroup.name)
                          }
                          setShowBracketDropdown(false)
                          setShowGroupDropdown(true)
                          setSelectedGroup(null)
                        }}
                        className='px-3 py-2 bg-[#3d4a61] hover:bg-[#4d5a71] text-white text-xs rounded-full transition-colors shrink-0 ml-4'
                      >
                        Change Group
                      </button>
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
                        {filteredGroups.map(group => (
                          <div
                            key={group.id}
                            className={`p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                              group.name.toLowerCase() === groupSearchValue.toLowerCase()
                                ? 'bg-gray-50'
                                : ''
                            }`}
                            onClick={() => {
                              setSelectedGroup(group)
                              setGroupSearchValue(group.name)
                              setShowGroupDropdown(false)
                              setShowBracketDropdown(true)
                              // focus on the group search input and select the text
                            }}
                          >
                            <div className='flex flex-col'>
                              <div className='flex items-center'>
                                <Users className='h-5 w-5 text-gray-500 mr-2' />
                                <span className='font-medium text-gray-900'>{group.name}</span>
                              </div>
                              <div className='flex items-center mt-1 ml-7'>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs ${
                                    group.isPublic
                                      ? 'bg-[#ff6b35] text-white'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {group.isPublic ? 'Public' : 'Private'}
                                </span>
                                <span className='text-xs text-gray-600 ml-2'>
                                  {group.size} members
                                </span>
                              </div>
                              <div className='ml-7 mt-1'>
                                <span className='text-[10px] text-gray-400'>ID: {group.id}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Group Selection for Bracket */}
                {showGroupSelection && selectedBracket && (
                  <>
                    {/* Bracket header when selecting group */}
                    <div className='mb-3 flex items-start justify-between bg-[#2d3a4f] p-3 rounded-xl header-card'>
                      <div className='flex items-start min-w-0'>
                        <Image
                          src={selectedBracket.logo}
                          alt='Winner'
                          width={28}
                          height={28}
                          className='h-7 w-7 mr-2 mt-0.5 shrink-0'
                        />
                        <div className='min-w-0 flex-1'>
                          <h3 className='text-white font-medium break-words'>
                            {selectedBracket.name}
                          </h3>
                          <p className='text-sm text-[#94a3b8] mt-0.5'>{selectedBracket.owner}</p>
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
                          />
                        </div>
                      </div>
                      <div className='max-h-[264px] overflow-y-auto'>
                        {mockGroups
                          .filter(
                            group =>
                              selectedBracket.groups.includes(group.id) &&
                              group.name.toLowerCase().includes(groupSearchValue.toLowerCase()),
                          )
                          .map(group => (
                            <div
                              key={group.id}
                              className='p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors'
                              onClick={() => handleGroupSelect(group)}
                            >
                              <div className='flex flex-col'>
                                <div className='flex items-center'>
                                  <Users className='h-5 w-5 text-gray-500 mr-2' />
                                  <span className='font-medium text-gray-900'>{group.name}</span>
                                </div>
                                <div className='flex items-center mt-1 ml-7'>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      group.isPublic
                                        ? 'bg-[#ff6b35] text-white'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}
                                  >
                                    {group.isPublic ? 'Public' : 'Private'}
                                  </span>
                                  <span className='text-xs text-gray-600 ml-2'>
                                    {group.size} members
                                  </span>
                                </div>
                                <div className='ml-7 mt-1'>
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
                        />
                      </div>
                    </div>
                    <div className='max-h-[264px] overflow-y-auto'>
                      {mockBrackets
                        .filter(
                          bracket =>
                            bracket.groups.includes(selectedGroup.id) &&
                            (bracket.name
                              .toLowerCase()
                              .includes(bracketFilterValue.toLowerCase()) ||
                              bracket.owner
                                .toLowerCase()
                                .includes(bracketFilterValue.toLowerCase())),
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
                                <div className='mt-1 text-sm text-gray-500'>{bracket.owner}</div>
                                <div className='mt-1'>
                                  <span className='text-[10px] text-gray-400'>
                                    ID: {bracket.id}
                                  </span>
                                </div>
                              </div>
                              <div className='flex items-center'>
                                <Image
                                  src={bracket.logo}
                                  alt='Team Logo'
                                  width={32}
                                  height={32}
                                  className='h-8 w-8'
                                />
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
                  <CornerLeftUp className='h-5 w-5 mr-2' />
                  <span>Switch to Group Search</span>
                  <CornerRightUp className='h-4 w-4 ml-2' />
                </div>
              ) : (
                <div className='flex items-center transition-colors'>
                  <CornerLeftUp className='h-5 w-5 mr-2' />
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
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex items-start min-w-0 pr-3'>
                        <img
                          src={selectedBracket.logo}
                          alt='Winner'
                          className='h-7 w-7 mr-2 mt-0.5'
                        />
                        <div className='min-w-0'>
                          <h3 className='text-white font-medium break-words'>
                            {selectedBracket.name}
                          </h3>
                          <p className='text-sm text-[#94a3b8] mt-0.5'>{selectedBracket.owner}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowBracketDropdown(true)
                          setBracketFilterValue('') // Clear filter when changing groups
                        }}
                        className='px-3 py-2 bg-[#3d4a61] hover:bg-[#4d5a71] text-white text-xs rounded-full transition-colors shrink-0 ml-4'
                      >
                        Change Bracket
                      </button>
                    </div>
                    <p className='text-[10px] text-[#6b7280] truncate'>ID: {selectedBracket.id}</p>
                  </div>

                  {selectedGroup && (
                    <div>
                      <div className='flex items-start justify-between mb-3'>
                        <div className='flex items-start min-w-0 pr-3'>
                          <Users className='h-5 w-5 text-[#94a3b8] mr-2 mt-0.5' />
                          <span className='text-white font-medium break-words'>
                            {selectedGroup.name}
                          </span>
                        </div>
                        {selectedBracket.groups.length > 1 && (
                          <button
                            onClick={() => {
                              setShowGroupSelection(true)
                              setGroupSearchValue('')
                            }}
                            className='px-3 py-2 bg-[#3d4a61] hover:bg-[#4d5a71] text-white text-xs rounded-full transition-colors shrink-0'
                          >
                            Switch Group
                          </button>
                        )}
                      </div>
                      <div
                        className={`flex items-center mb-3 ${selectedBracket.groups.length > 1 ? '-mt-2.5' : 'mt-0'}`}
                      >
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            selectedGroup.isPublic
                              ? 'bg-[#ff6b35] text-white'
                              : 'bg-[#3d4a61] text-[#94a3b8]'
                          }`}
                        >
                          {selectedGroup.isPublic ? 'Public' : 'Private'}
                        </span>
                        <span className='text-xs text-[#94a3b8] ml-2'>
                          {selectedGroup.size} members
                        </span>
                      </div>
                      <p className='text-[10px] text-[#6b7280] truncate'>ID: {selectedGroup.id}</p>
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
