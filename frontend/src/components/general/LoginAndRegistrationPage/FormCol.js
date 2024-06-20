import { ErrorMessage, Field } from 'formik'
import { Col } from 'react-bootstrap'


export function FormCol(name, type, colName, size = 12, additionalOptions) {
  return (
    <Col className='form-group m-1' md={size}>
      <h6>{name}</h6>
      {type === 'select' ? (
        <Field className="form-control" name={colName} as="select" multiple={additionalOptions?.multiple ?? false}>
          {additionalOptions?.options?.map((option, index) => (
            <option key={option.value + index} value={option.value}>
              {option.name}
            </option>
          ))}
        </Field>
      ) : type === 'checkbox' ? (
        <div style={{ maxHeight: '100px', overflow: 'auto' }}>
          {additionalOptions?.options?.map((option, index) => (
            <div key={option.value + index} className="w-100">
              <label className="d-flex align-items-center">
                <Field
                  className="form-control h-25 mx-2"
                  style={{ width: 'inherit' }}
                  type={type}
                  name={colName}
                  value={option.value}
                />{' '}
                <span>{option.name}</span>
              </label>
            </div>
          ))}
        </div>
      ) : type === 'textarea' ? (
        <Field className="form-control" as="textarea" type="text" name={colName} />
      ) : type === 'file' ? (
        <input type="file" accept="image/png, image/jpeg" name={colName} />
      ) : type === 'dropdown' && colName === 'activityType' ? (
        <Field className="form-control" name={colName} as="select">
          <option value=""></option>
          <option value="colloquium_points">Kolokwium</option>
          <option value="laboratory_points">Spacer</option>
          <option value="additional_points">Dodatkowe punkty</option>
        </Field>
      ) : type === 'dropdown' && colName === 'role' ? (
        <Field className="form-control" name={colName} as="select">
          <option value=""></option>
          <option value="economist">Ekonom</option>
          <option value="cablemaster">Kabelmajster</option>
          <option value="scribe">Skyba</option>
          <option value="oboe">Obój</option>
        </Field>
      ) : (        
        <Field
          className='form-control'
          type={type}
          name={colName}
          min={type === 'number' ? additionalOptions?.min ?? 0 : 'none'}
          style={{backgroundColor: additionalOptions?.backgroundColor ?? "", color: additionalOptions?.fontColor ?? ""}}
        />
      )}
      <ErrorMessage name={colName} component='div'>
        {(msg) => <div style={{ color: additionalOptions.errorColor }}>{msg}</div>}
      </ErrorMessage>
    </Col>
  )
}
