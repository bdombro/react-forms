export function formToValues(formElement: any) {
  let reqBody: Record<string, any> = {};
  Object.keys(formElement.elements).forEach(key => {
    let field = formElement.elements[key];
    if (field.type !== "submit") {
      reqBody[field.name] = field.type === 'checkbox' ? field.checked : field.value;
    }
  })
  return reqBody
}

export class ValidationErrorSet extends Error {
  type = 'ValidationErrorSet'
  context: {
    entity: any,
    errorSet: Record<string, any>
  } = {
      entity: null,
      errorSet: {}
    }
  constructor(entity: any, errorSet: Record<string, any>) {
    super('ValidationError: One or more fields are invalid')
    this.context.entity = entity
    this.context.errorSet = errorSet
  }
}

export function assertAttrsWithin(given: Record<string, any>, expected: Record<string, any>,) {
  const randos = arrayDifference(Object.keys(given), Object.keys(expected))
  if (randos.length) throw new ValidationErrorSet(
    given,
    Object.fromEntries(randos.map(k => [k, `${k} field is unexpected`]))
  )
}

// Like assertAttrWithin, but the errorSet only has one key = 'form'. Useful for form handling
export function assertAttrsWithinFormProps(given: Record<string, any>, expected: Record<string, any>,) {
  const randos = arrayDifference(Object.keys(given), Object.keys(expected))
  if (randos.length) throw new ValidationErrorSet(
    given,
    { form: `Some form inputs were not accepted: ${randos.join(',')}`}
  )
}

export const arrayDifference: ArrayDifferenceType = (...arrays: any[][]) => {
  return arrays.reduce((a, b) => a.filter((c) => !b.includes(c)))
}

// Returns the same type as args
export type ArrayDifferenceType = <T extends any>(...arrays: T[][]) => T[];
