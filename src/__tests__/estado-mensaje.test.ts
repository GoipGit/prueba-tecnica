import '../components/estado-mensaje'
import type { EstadoMensaje } from '../components/estado-mensaje'

describe('EstadoMensaje Component', () => {
  let element: EstadoMensaje

  beforeEach(() => {
    element = document.createElement('estado-mensaje') as EstadoMensaje
    document.body.appendChild(element)
  })

  afterEach(() => {
    document.body.removeChild(element)
  })

  it('should render error message with correct role', () => {
    element.show('error', 'Test error message')

    const wrap = element.shadowRoot?.querySelector('.wrap')
    expect(wrap).toHaveAttribute('role', 'alert')
    expect(wrap).toHaveAttribute('aria-live', 'assertive')
    expect(element.shadowRoot?.querySelector('.text')).toHaveTextContent('Test error message')
    expect(element).not.toHaveAttribute('hidden')
  })

  it('should render info message with correct role', () => {
    element.show('info', 'Test info message')

    const wrap = element.shadowRoot?.querySelector('.wrap')
    expect(wrap).toHaveAttribute('role', 'status')
    expect(wrap).toHaveAttribute('aria-live', 'polite')
    expect(element.shadowRoot?.querySelector('.text')).toHaveTextContent('Test info message')
  })

  it('should clear message and hide element', () => {
    element.show('error', 'Test message')
    expect(element).not.toHaveAttribute('hidden')

    element.clear()
    expect(element).toHaveAttribute('hidden')
    expect(element.shadowRoot?.querySelector('.text')).toHaveTextContent('')
  })

  it('should work with attributes', () => {
    element.setAttribute('type', 'success')
    element.setAttribute('message', 'Success message')

    expect(element.type).toBe('success')
    expect(element.message).toBe('Success message')
    expect(element).not.toHaveAttribute('hidden')
  })
})
