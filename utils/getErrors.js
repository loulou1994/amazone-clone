const getError = (err) => {
    return err?.response?.data?.message || err.message
}

export default getError