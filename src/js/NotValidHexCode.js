export default class NotValidHexCode extends Error {
  constructor(hexCodeValue) {
    super(`'${hexCodeValue}' is not a vaid hex code`)
  }
}
