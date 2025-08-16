export const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/

    return regex.test(email)
}

export const validateEmailMessage = 'Ingresa un correo válido'