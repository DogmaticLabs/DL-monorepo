import { Button } from '@workspace/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import { CheckCircle2, ClockIcon, HeadphonesIcon } from 'lucide-react'
import { useState } from 'react'

const steps = [
  {
    title: 'Welcome to Conceal DC',
    description:
      'Let us help you get started with finding an earlier CCL appointment. This quick tour will show you how to use our service.',
    icon: CheckCircle2,
  },
  {
    title: 'View Available Appointments',
    description:
      'Click "View Schedule" to see all available appointment dates. You can browse through different weeks to find a time that works for you.',
    icon: ClockIcon,
  },
  {
    title: 'Enable Notifications',
    description:
      "Want an earlier appointment? Enable notifications and we'll alert you immediately when a closer date becomes available due to cancellations.",
    icon: HeadphonesIcon,
  },
]

type OnboardingTourProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function OnboardingTour({ open, onOpenChange }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onOpenChange(false)
      // Save to localStorage that the user has seen the tour
      localStorage.setItem('hasSeenTour', 'true')
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setCurrentStep(0)
    }
    onOpenChange(newOpen)
  }

  const CurrentIcon = steps[currentStep]!.icon

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <div className='mx-auto rounded-full bg-primary/10 p-3 mb-4'>
            <CurrentIcon className='w-6 h-6 text-primary' />
          </div>
          <DialogTitle className='text-center'>{steps[currentStep]!.title}</DialogTitle>
          <DialogDescription className='text-center'>
            {steps[currentStep]!.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className='w-full flex flex-row justify-between'>
            <div className='flex gap-2 items-center'>
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full ${
                    index === currentStep ? 'w-4 bg-primary' : 'w-1.5 bg-muted'
                  }`}
                />
              ))}
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' onClick={() => onOpenChange(false)}>
                Skip
              </Button>
              <Button onClick={handleNext}>
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
