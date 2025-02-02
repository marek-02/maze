import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import authService from '../services/auth.service'

export const errorToast = (errorMsg, autoClose = 4000, position = 'top-right') =>
  toast.error(errorMsg ?? 'Coś poszło nie tak.', { autoClose, position })

export const refreshSessionToast = (extendSessionHandler) =>
  toast.warning(
    <div className="d-flex flex-column">
      <p className="text-center">Twoja sesja wygaśnie za mniej niż 15min.</p>
      <Button variant="outline-warning" onClick={extendSessionHandler}>
        Wydłuż sesję
      </Button>
    </div>,
    {
      autoClose: false,
      theme: 'dark',
    }
  )

export const successToast = (successMsg) => toast.success(successMsg ?? 'Zmiany dokonane pomyślnie.', { theme: 'dark' })
