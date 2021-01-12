import './forms.css'
import { FormEvent as ReactFormEvent, useState } from 'react'
import {assertAttrsWithinFormProps, formToValues, ValidationErrorSet} from './forms.lib'

export default function LoginForm() {
  const [{ submitting, submitted, errors }, setFormState] = useState<{
    submitting: boolean,
    submitted: boolean,
    errors: Partial<Record<keyof LoginProps | 'form', any>>
  }>({
    submitting: false,
    submitted: false,
    errors: {}
  })

  return (
    <div>
      <h1>Login</h1>
      <h3>Status: Form {submitted ? 'has been' : 'has not been'} submitted.</h3>
      <form onSubmit={onSubmit}>
        <div className='textfield-div'>
          <label htmlFor='Email'>Email</label>
          <input name='email' placeholder='sally@forms.com' />
          {!!errors.email && <div className="input-error">{errors.email}</div>}
        </div>
        <div className='checkbox-div'>
          <label htmlFor='acceptedTerms'>Do you accept?</label>
          <input type='checkbox' name='acceptedTerms' />
          {!!errors.acceptedTerms && <div className="input-error">{errors.acceptedTerms}</div>}
        </div>
        {!!errors.form && <div className='form-error'>Error in Form: {errors.form}</div>}
        <button type='submit' disabled={submitting}>{submitting ? 'Submiting...' : 'Submit'}</button>
      </form>
    </div>
  );

  function onSubmit(formEvent: ReactFormEvent) {
    formEvent.preventDefault()
    setFormState(last => ({ ...last, submitting: true }))
    try {
      const formValues = new LoginProps(formToValues(formEvent.target))
      console.dir(formValues)
      // TODO: Post form data here
      setFormState(last => ({ ...last, submitting: false, submitted: true, errors: {} }))
    } catch (error) {
      if (error instanceof ValidationErrorSet) {
        setFormState(last => ({ ...last, submitting: false, submitted: false, errors: error.context.errorSet }))
        return
      }
      setFormState(last => ({ ...last, submitting: false, submitted: false, errors: {form: error.message} }))
    }
  }
}

class LoginProps {
  email: string
  acceptedTerms: boolean
  constructor(props: any) {
    assertAttrsWithinFormProps(props, this)
    const errors: Partial<Record<keyof LoginProps, string>> = {}
    if (!props.email) errors.email = 'email is invalid'
    if (!props.acceptedTerms) errors.acceptedTerms = 'terms must be accepted'
    if (Object.keys(errors).length) throw new ValidationErrorSet(props, errors)
    Object.assign(this, props) 
  }
}

