import 'whatwg-fetch'
import '@testing-library/jest-dom'

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
  }),
})