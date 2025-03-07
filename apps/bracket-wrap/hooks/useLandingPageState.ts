import {
  Bracket,
  getBracketsForGroup,
  getGroupsForBracket,
  getTeams,
  Group,
  searchGroupsByQuery,
} from '@/app/api/bracket-data'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState, useRef } from 'react'

const useLandingPageState = () => {
  const [searchMode, setSearchMode] = useState<'bracket' | 'group'>('group')
  const [groupSearchValue, setGroupSearchValue] = useState('')
  const [debouncedGroupSearchValue, setDebouncedGroupSearchValue] = useState('')
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
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const bracketFilterInputRef = useRef<HTMLInputElement>(null)
  const groupFilterInputRef = useRef<HTMLInputElement>(null)

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
    queryKey: ['group', selectedGroup?.id],
    queryFn: () => getBracketsForGroup(selectedGroup?.id ?? ''),
    enabled: !!selectedGroup?.id,
  })

  const groupsForBracketQuery = useQuery({
    queryKey: ['groups-for-bracket', selectedBracket?.id],
    queryFn: () => getGroupsForBracket(selectedBracket?.id ?? ''),
    enabled: !!selectedBracket?.id,
  })

  const teamsQuery = useQuery({
    queryKey: ['teams'],
    queryFn: () => getTeams(),
  })

  if (selectedBracket && groupsForBracketQuery.data) {
    selectedBracket.groups = groupsForBracketQuery.data?.groups
  }



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

  const handleSearchChange = (value: string) => {
    if (searchMode === 'group') {
      setGroupSearchValue(value)
      setSelectedGroup(null)
      setShowGroupDropdown(true)
      setShowBracketDropdown(false)
    } else {
      // Handle bracket ID search
      setBracketSearchValue(value)
      const bracket = groupQuery.data?.brackets.find(
        b => b.id.toLowerCase() === value.toLowerCase(),
      )
      if (bracket) {
        setSelectedBracket(bracket)
        // TODO: Fix this
        // Auto-select the first group the bracket belongs to
        // const firstGroup = mockGroups.find(g => g.id === bracket.groups[0])
        // setSelectedGroup(firstGroup || null)
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
          const bracket = groupQuery.data?.brackets.find(
            b => b.id.toLowerCase() === bracketSearchValue.toLowerCase(),
          )
          if (bracket) {
            setSelectedBracket(bracket)
            // Use the last selected group if we have one, otherwise default to first group
            const lastGroupId = lastSelectedGroupForBracket[bracket.id]
            // TODO: Fix this
            // const group = lastGroupId
            //   ? mockGroups.find(g => g.id === lastGroupId)
            //   : mockGroups.find(g => g.id === bracket.groups[0])
            // setSelectedGroup(group || null)
            setShowGroupSelection(false)
            inputRef.current?.blur()
          }
        }
      }
    }, 0)
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
    setSelectedGroup,
    setShowGroupDropdown,
    setShowBracketDropdown,
    setShowGroupSelection,
    setSelectedBracket,
    groups: groupsQuery.data,
    groupsLoading:
      groupsQuery.isLoading ||
      (groupSearchValue.length >= 3 && debouncedGroupSearchValue !== groupSearchValue),
    groupQuery,
    teams: teamsQuery.data || {},
    teamsLoading: teamsQuery.isLoading,
  }
}

export default useLandingPageState
