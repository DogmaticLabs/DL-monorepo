import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { motion } from 'motion/react'
import Image from 'next/image'
import { Dispatch, SetStateAction } from 'react'
import basketballLogo from '../public/bracket-wrap-2.png'

interface LandingPageProps {
  bracketId: string
  setBracketId: Dispatch<SetStateAction<string>>
  onSubmit: (id: string) => void
}

const LandingPage = ({ bracketId, setBracketId, onSubmit }: LandingPageProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBracketId(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (bracketId.trim()) {
      onSubmit(bracketId)
    }
  }

  return (
    <IntroContent
      bracketId={bracketId}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
    />
  )
}

const IntroContent = ({
  bracketId,
  handleInputChange,
  handleSubmit,
}: {
  bracketId: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => void
}) => {
  return (
    <div className='flex flex-col items-center justify-center gap-2 text-center'>
      <motion.div
        className='w-24 h-24 mb-4'
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Image
          src={basketballLogo}
          alt='Basketball Logo'
          width={400}
          height={400}
          className='-my-12'
        />
      </motion.div>
      <motion.p
        className='text-xl'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        Enter your Bracket ID below to start
      </motion.p>

      <motion.form
        className='mt-6 w-full max-w-xs'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
        onSubmit={handleSubmit}
      >
        <div className='flex flex-col gap-3'>
          <Input
            type='text'
            placeholder='Bracket ID'
            value={bracketId}
            onChange={handleInputChange}
            className='text-black placeholder:text-gray-500 bg-white/90'
            autoFocus
          />
          <Button type='submit'>Next</Button>
          <p className='text-sm text-gray-500'>What's my bracket ID?</p>
        </div>
      </motion.form>
    </div>
  )
}

export default LandingPage
