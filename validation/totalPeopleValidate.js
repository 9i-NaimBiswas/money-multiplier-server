const validate = (fields) => {
   const error = {}
   if (!fields.userId) {
      error.userId = "userid field is required"
   }
   if (!fields.price) {
      error.price = "Price field is required"
   }
   if (!fields.totalRemoved) {
      error.totalRemoved = "Number of removed field is required"
   }
   return {
      error,
      isValid: Object.keys(error).length === 0
   }

}

module.exports = validate