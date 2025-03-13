import {
  Bracket,
  getBracket,
  getBracketsForGroup,
  getTeams,
  Group,
  searchGroupsByQuery,
} from '@/app/api/bracket-data'
import { useUrlParam } from '@/hooks/useUrlParams'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'

type SearchMode = 'bracket' | 'group'

const useLandingPageState = () => {
  const [searchMode, setSearchMode] = useUrlParam<SearchMode>('mode', 'group', {
    persistDefault: true,
  })
  const [groupId, setGroupId] = useUrlParam<string>('group_id')
  const [bracketId, setBracketId] = useUrlParam<string>('bracket_id')
  const [groupSearchValue, setGroupSearchValue] = useState('')
  const [debouncedGroupSearchValue, setDebouncedGroupSearchValue] = useState('')
  const [bracketSearchValue, setBracketSearchValue] = useState(bracketId)
  const [bracketFilterValue, setBracketFilterValue] = useState('')
  const [showGroupDropdown, setShowGroupDropdown] = useState(false)
  const [showBracketDropdown, setShowBracketDropdown] = useState(false)
  const [showGroupSelection, setShowGroupSelection] = useState(false)
  const [lastSelectedGroupForBracket, setLastSelectedGroupForBracket] = useState<{
    [bracketId: string]: string
  }>({})
  const [lastGroupSearchState, setLastGroupSearchState] = useState<{
    selectedGroupId?: string
    selectedBracketId?: string
    groupSearchValue?: string
  }>({})
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const bracketFilterInputRef = useRef<HTMLInputElement>(null)
  const groupFilterInputRef = useRef<HTMLInputElement>(null)

  const isValidBracketId = (id: string) => {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id)
  }

  // Add debounce effect for group search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedGroupSearchValue(groupSearchValue)
    }, 300) // 300ms debounce delay

    return () => clearTimeout(timer)
  }, [groupSearchValue])

  const groupsQuery = useQuery({
    queryKey: ['group-search', debouncedGroupSearchValue],
    queryFn: () => searchGroupsByQuery(debouncedGroupSearchValue),
    enabled: debouncedGroupSearchValue.length >= 3,
  })

  const groupQuery = useQuery({
    queryKey: ['group', groupId],
    queryFn: () => getBracketsForGroup(groupId ?? ''),
    enabled: !!groupId,
  })

  const selectedGroup = groupQuery.data

  const bracketQuery = useQuery({
    queryKey: ['bracket', bracketId],
    queryFn: () => getBracket(bracketId ?? ''),
    enabled: !!bracketId,
  })

  const selectedBracket = bracketQuery.data

  const teamsQuery = useQuery({
    queryKey: ['teams'],
    queryFn: () => getTeams(),
  })

  if (selectedBracket && bracketQuery.data) {
    selectedBracket.groups = bracketQuery.data?.groups
  }

  const handleSearchChange = (value: string) => {
    if (searchMode === 'group') {
      setGroupSearchValue(value)
      setGroupId('')
      setShowGroupDropdown(true)
      setShowBracketDropdown(false)
    } else {
      // Handle bracket ID search
      setBracketSearchValue(value)
      if (isValidBracketId(value)) {
        setBracketId(value)
      }
    }
  }

  const handleGroupSelect = {
    bracket: (group: Group) => {
      setGroupId(group.id)
      setGroupSearchValue(group.name)
      setShowGroupSelection(false)
      setShowBracketDropdown(false)
      if (selectedBracket) {
        setLastSelectedGroupForBracket(prev => ({
          ...prev,
          [selectedBracket.id]: group.id,
        }))
      }
    },
    group: (group: Group) => {
      setGroupId(group.id)
      setGroupSearchValue(group.name)
      setShowGroupDropdown(false)
      if (!selectedBracket) {
        setShowBracketDropdown(true)
        setShowGroupSelection(true)
      }
      setShowGroupSelection(false)
      setTimeout(() => {
        if (bracketFilterInputRef && bracketFilterInputRef.current) {
          bracketFilterInputRef.current.focus()
        }
      }, 0)
    },
  }[searchMode!]

  const handleBracketSelect = {
    bracket: (bracket: Bracket) => {
      setBracketId(bracket.id)
      setBracketSearchValue(bracket.id)
      if (!groupId || !bracket.groups.find(g => g.id === groupId)) {
        setGroupId(bracket.groups[0]?.id)
      }
      setShowBracketDropdown(false)
    },
    group: (bracket: Bracket) => {
      setBracketId(bracket.id)
      setShowBracketDropdown(false)
      setBracketFilterValue('') // Clear filter when selecting a bracket
      setShowGroupSelection(false)
    },
  }[searchMode!]

  useEffect(() => {
    if (selectedGroup) handleGroupSelect(selectedGroup)
  }, [selectedGroup])

  useEffect(() => {
    if (selectedBracket) handleBracketSelect(selectedBracket)
  }, [selectedBracket])

  const toggleSearchMode = () => {
    setBracketId(undefined)
    setGroupId(undefined)
    setBracketSearchValue('')
    setGroupSearchValue('')
    setBracketFilterValue('')
    setShowGroupDropdown(false)
    setShowBracketDropdown(false)
    setShowGroupSelection(false)
    setSearchMode(searchMode === 'bracket' ? 'group' : 'bracket')
    // const newMode = searchMode === 'bracket' ? 'group' : 'bracket'
    // setSearchMode(newMode)

    // if (newMode === 'group') {
    //   // Switching to group mode - restore previous group state if it exists
    //   if (lastGroupSearchState) {
    //     if (lastGroupSearchState.selectedGroupId) setGroupId(lastGroupSearchState.selectedGroupId)
    //     if (lastGroupSearchState.selectedBracketId)
    //       setBracketId(lastGroupSearchState.selectedBracketId)
    //     // setSelectedBracket(lastGroupSearchState.selectedBracket)
    //     if (lastGroupSearchState.groupSearchValue)
    //       setGroupSearchValue(lastGroupSearchState.groupSearchValue)
    //     if (lastGroupSearchState.selectedGroupId && lastGroupSearchState.selectedBracketId) {
    //       setShowBracketDropdown(true)
    //     }
    //   } else {
    //     setGroupId('')
    //     setBracketId(undefined)
    //     // setSelectedBracket(null)
    //     setGroupSearchValue('')
    //   }
    // } else {
    //   // Switching to bracket mode - save current group state
    //   setLastGroupSearchState({
    //     selectedGroupId: selectedGroup?.id,
    //     selectedBracketId: selectedBracket?.id,
    //     groupSearchValue,
    //   })

    //   // Reset bracket search state
    //   setGroupId(undefined)
    //   setBracketId(undefined)
    // }

    // setShowGroupDropdown(false)
    // setShowBracketDropdown(false)
    // setShowGroupSelection(false)

    // // Focus input when switching modes
    // setTimeout(() => {
    //   if (newMode === 'group') {
    //     // inputRef.current?.focus()
    //   } else {
    //     // When switching to bracket mode
    //     inputRef.current?.focus()
    //     inputRef.current?.select()

    //     // If there's a bracket search value, try to find the bracket
    //     if (bracketId) {
    //       const bracket = groupQuery.data?.brackets.find(
    //         b => b.id.toLowerCase() === (bracketId as string).toLowerCase(),
    //       )
    //       if (bracket) {
    //         setBracketId(bracket.id)
    //         // setSelectedBracket(bracket)
    //         // Use the last selected group if we have one, otherwise default to first group
    //         const lastGroupId = lastSelectedGroupForBracket[bracket.id]
    //         // TODO: Fix this
    //         // const group = lastGroupId
    //         //   ? mockGroups.find(g => g.id === lastGroupId)
    //         //   : mockGroups.find(g => g.id === bracket.groups[0])
    //         // setSelectedGroup(group || null)
    //         setShowGroupSelection(false)
    //         inputRef.current?.blur()
    //       }
    //     }
    //   }
    // }, 0)
  }

  return {
    searchMode,
    groupSearchValue,
    debouncedGroupSearchValue,
    bracketSearchValue,
    bracketFilterValue,
    selectedGroup,
    showGroupDropdown,
    showBracketDropdown,
    selectedBracket,
    showGroupSelection,
    lastSelectedGroupForBracket,
    lastGroupSearchState,
    dropdownRef,
    inputRef,
    bracketFilterInputRef,
    groupFilterInputRef,
    handleSearchChange,
    handleGroupSelect,
    toggleSearchMode,
    setGroupSearchValue,
    setBracketSearchValue,
    setBracketFilterValue,
    setShowGroupDropdown,
    setShowBracketDropdown,
    setShowGroupSelection,
    handleBracketSelect,
    setGroupId,
    groupId,
    setBracketId,
    bracketId,
    groups: groupsQuery.data,
    groupsLoading:
      !bracketId &&
      (groupsQuery.isLoading ||
        (groupSearchValue.length >= 3 && debouncedGroupSearchValue !== groupSearchValue)),
    groupQuery,
    bracketsLoading: groupQuery.isLoading,
    teams: teamsQuery.data || {},
    teamsLoading: teamsQuery.isLoading,
  }
}

export default useLandingPageState
