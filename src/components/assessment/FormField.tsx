import { ComponentPropsWithoutRef } from 'react'

type FieldWrapperProps = {
  label: string
  htmlFor: string
  optional?: boolean
  error?: string
  children: React.ReactNode
}

export function FieldWrapper({ label, htmlFor, optional, error, children }: FieldWrapperProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {optional && <span className="ml-1.5 font-normal text-ink/45">(optional)</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-orange">
          {error}
        </p>
      )}
    </div>
  )
}

type TextInputProps = ComponentPropsWithoutRef<'input'> & { error?: boolean }

export function TextInput({ error, className = '', ...rest }: TextInputProps) {
  return (
    <input
      className={`min-h-[44px] w-full rounded border px-4 py-2.5 text-[15px] text-ink placeholder:text-ink/35 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-petrol ${
        error ? 'border-orange' : 'border-ink/20'
      } ${className}`}
      {...rest}
    />
  )
}

type TextAreaProps = ComponentPropsWithoutRef<'textarea'>

export function TextArea({ className = '', ...rest }: TextAreaProps) {
  return (
    <textarea
      className={`w-full rounded border border-ink/20 px-4 py-2.5 text-[15px] text-ink placeholder:text-ink/35 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-petrol ${className}`}
      {...rest}
    />
  )
}

type SelectProps = ComponentPropsWithoutRef<'select'>

export function Select({ className = '', children, ...rest }: SelectProps) {
  return (
    <select
      className={`min-h-[44px] w-full rounded border border-ink/20 bg-white px-4 py-2.5 text-[15px] text-ink focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-petrol ${className}`}
      {...rest}
    >
      {children}
    </select>
  )
}
