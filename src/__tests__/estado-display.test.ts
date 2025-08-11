import '../components/estado-display'
import type { EstadoDisplay } from '../components/estado-display'

describe('EstadoDisplay Component', () => {
  let element: EstadoDisplay

  beforeEach(() => {
    element = document.createElement('estado-display') as EstadoDisplay
    document.body.appendChild(element)
  })

  afterEach(() => {
    document.body.removeChild(element)
  })

  it('render mensaje de error con rol correcto', () => {
    element.showMessage('error', 'Test error message')

    const wrap = element.shadowRoot?.querySelector('.wrap')
    expect(wrap).toHaveAttribute('role', 'alert')
    expect(wrap).toHaveAttribute('aria-live', 'assertive')
    expect(element.shadowRoot?.querySelector('.message')).toHaveTextContent('Test error message')
    expect(element).not.toHaveAttribute('hidden')
  })

  it('render mensaje de info con rol correcto', () => {
    element.showMessage('info', 'Test info message')

    const wrap = element.shadowRoot?.querySelector('.wrap')
    expect(wrap).toHaveAttribute('role', 'status')
    expect(wrap).toHaveAttribute('aria-live', 'polite')
    expect(element.shadowRoot?.querySelector('.message')).toHaveTextContent('Test info message')
  })

  it('limpia mensaje y oculta elemento', () => {
    element.showMessage('error', 'Test message')
    expect(element).not.toHaveAttribute('hidden')

    element.clear()
    expect(element).toHaveAttribute('hidden')
    expect(element.shadowRoot?.querySelector('.message')).toHaveTextContent('')
  })

  it('trabaja con atributos', () => {
    element.setAttribute('type', 'success')
    element.setAttribute('message', 'Success message')

    expect(element.type).toBe('success')
    expect(element.message).toBe('Success message')
    expect(element).not.toHaveAttribute('hidden')
  })

  it('render estado completo con título y descripción', () => {
    element.showState('Sin resultados', 'Intenta otra búsqueda', '🔍')

    const wrap = element.shadowRoot?.querySelector('.wrap')
    expect(wrap).toHaveAttribute('role', 'status')
    expect(element.shadowRoot?.querySelector('.title')).toHaveTextContent('Sin resultados')
    expect(element.shadowRoot?.querySelector('.description')).toHaveTextContent('Intenta otra búsqueda')
    expect(element.shadowRoot?.querySelector('.icon')).toHaveTextContent('🔍')
    expect(element).not.toHaveAttribute('hidden')
  })

  it('render estado híbrido con todas las opciones', () => {
    element.show({
      type: 'success',
      title: '¡Éxito!',
      description: 'Operación completada',
      icon: '✅',
      message: 'Todo correcto'
    })

    const wrap = element.shadowRoot?.querySelector('.wrap')
    expect(wrap).toHaveAttribute('role', 'status')
    expect(element.shadowRoot?.querySelector('.title')).toHaveTextContent('¡Éxito!')
    expect(element.shadowRoot?.querySelector('.description')).toHaveTextContent('Operación completada')
    expect(element.shadowRoot?.querySelector('.icon')).toHaveTextContent('✅')
    expect(element.shadowRoot?.querySelector('.message')).toHaveTextContent('Todo correcto')
  })

  it('oculta elementos vacíos', () => {
    element.showMessage('info', 'Solo mensaje')

    expect(element.shadowRoot?.querySelector('.message')).toHaveTextContent('Solo mensaje')
    expect(element.shadowRoot?.querySelector('.title')).toHaveTextContent('')
    expect(element.shadowRoot?.querySelector('.description')).toHaveTextContent('')
    expect(element.shadowRoot?.querySelector('.icon')).toHaveTextContent('')
  })
})
