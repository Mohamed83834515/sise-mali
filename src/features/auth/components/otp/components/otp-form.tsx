import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'
import { useVerifyOtp } from '@/features/auth/api/authHooks'
import { showSubmittedData } from '@/lib/show-submitted-data'

const formSchema = z.object({
  otp: z
    .string()
    .min(6, 'Veuillez saisir le code à 6 chiffres.')
    .max(6, 'Veuillez saisir le code à 6 chiffres.'),
})

type OtpFormProps = React.HTMLAttributes<HTMLFormElement>

export function OtpForm({ className, ...props }: OtpFormProps) {
  const { mutate: verifyOtp, isPending, isError, error } = useVerifyOtp()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: '' },
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const otp = form.watch('otp')

  function onSubmit(data: z.infer<typeof formSchema>) {
    showSubmittedData(data)
    const username =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('pending_otp_username') || undefined
        : undefined

    verifyOtp({
      otp: data.otp,
      otp_code: data.otp,
      id_personnel_perso: username,
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='otp'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='sr-only'>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  containerClassName='justify-between sm:[&>[data-slot="input-otp-group"]>div]:w-12'
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isError && (
          <div className='flex items-center gap-2 text-red-600 font-medium justify-center text-xs'>
            <TriangleAlert className='w-4 h-4' />
            {error?.message || 'Code OTP invalide ou expiré'}
          </div>
        )}

        <Button
          type='submit'
          className='mt-2 bg-[#009460] hover:bg-[#007a4f] text-white transition-colors'
          disabled={otp.length < 6 || isPending}
          aria-label='Verify'
        >
          {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          {isPending ? 'Vérification...' : 'Valider'}
        </Button>
      </form>
    </Form>
  )
}
