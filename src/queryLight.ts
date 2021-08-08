/**
 * @fileOverview Lightweight module for DOM manipulations
 *
 * @author Alexandr Shamanin (slpAkkie)
 * @version 2.0.0
 */





//
interface qlWrapper { [key: string]: any }
//
type qlElement = HTMLElement | HTMLDocument
//
type qlCommonElement = HTMLElement | qlWrapper
//
type qlCollection = Array<qlElement>
//
type qlInput = string | qlElement | qlWrapper





//
class qlWrapper {

  /**
   * @property {qlCollection}
   */
  #entries: qlCollection

  constructor(elements) { this.#entries = elements }

  /**
   * @param {qlInput} input
   * @returns {qlWrapper}
   */
  child(input: qlInput): qlWrapper { return q(input, this) }

  /**
   * @param {string} value
   * @returns {qlWrapper}
   */
  addClass(value: string): qlWrapper { return this.each(i => i.classList.add(value)) }

  /**
   * @param {string} value
   * @returns {qlWrapper}
   */
  removeClass(value: string): qlWrapper { return this.each(i => i.classList.remove(value)) }

  /**
   * @param {string} value
   * @returns {qlWrapper}
   */
  toggleClass(value: string): qlWrapper { return this.each(i => i.hasClass(value) ? i.removeClass(value) : i.addClass(value)) }

  /**
   * @param {string} value
   * @returns {qlWrapper}
   */
  hasClass(value: string): boolean { return this.#entries.every(i => (<HTMLElement>i).classList.contains(value)) }

  /**
   * @param {string} eventName
   * @param {Function} callback
   * @returns {qlWrapper}
   */
  on(eventName, callback): qlWrapper { return this.each(i => (<HTMLElement>i).addEventListener(eventName, callback)) }

  /**
   * @param {Function} callback
   * @returns {qlWrapper}
   */
  each(callback: Function): qlWrapper {
    this.#entries.forEach((el, i) => callback.call(q(el), q(el), i))

    return this
  }

  // The methods below this comment need refactoring

  /**
   * @param {qlCommonElement} sibling
   * @returns {qlCommonElement}
   */
  insertBefore(sibling: qlCommonElement): qlCommonElement {
    this.unambiguityRequire()

    if (sibling instanceof qlWrapper) {
      let parent = this.parent().get()

      sibling.each(ch => parent.insertBefore(ch.get(), <HTMLElement>this.get()))
    } else this.parent().get().insertBefore(sibling, <HTMLElement>this.get())

    return sibling
  }

  /**
   * @param {qlCommonElement} sibling
   * @returns {qlCommonElement}
   */
  insertAfter(sibling: qlCommonElement): qlCommonElement {
    let nextSibling = q(this.nextElementSibling)
    nextSibling
      ? nextSibling.insertBefore(sibling)
      : this.parent().insert(sibling)

    return sibling
  }

  /**
   * Insert child into the elements
   *
   * @param {qlWrapper | HTMLElement} sibling
   * @returns {qlWrapper | HTMLElement}
   */
  insert(child: qlWrapper | HTMLElement, multiInsert: boolean = false): qlWrapper | HTMLElement {
    !(child instanceof qlWrapper) && (child = q(child))

    if (multiInsert) {
      this.each((el: HTMLElement) => (<qlWrapper>child).each((ch: qlWrapper) => el.appendChild(ch.get().cloneNode(true))))

      return this
    } else {
      this.unambiguityRequire()
      child.each(ch => this.appendChild(ch.get()))

      return child
    }
  }

  /**
   * Insert child into the elements at the last position
   *
   * @param {qlWrapper | HTMLElement} sibling
   * @param {boolean} multiInsert
   * @returns {qlWrapper | HTMLElement}
   */
  insertFirst(child: qlWrapper | HTMLElement, multiInsert: boolean = false): qlWrapper | HTMLElement {
    !(child instanceof qlWrapper) && (child = q(child))

    if (multiInsert) {
      this.each(el => (<qlWrapper>child).each(ch => q(el.firstElementChild)?.insertBefore(ch.get().cloneHTMLElement(true)) || el.insert(ch)))

      return this
    } else {
      this.unambiguityRequire()
      child.each(ch => q(this.firstElementChild)?.insertBefore(ch.get()) || this.insert(ch))

      return child
    }
  }

  /**
   * Replace element with another one
   *
   * @param {qlWrapper | HTMLElement} newElement
   * @returns {qlWrapper | HTMLElement}
   */
  replace(newElement: qlWrapper | HTMLElement): qlWrapper | HTMLElement {
    this.replaceWith(newElement instanceof qlWrapper ? newElement.get() : newElement)

    return newElement
  }

  /**
   * Clear elements entry
   *
   * @returns {qlWrapper}
   */
  clear(): qlWrapper {
    this.each(el => el.innerHTML = '')

    return this
  }

  /**
   * Get specified elements from qlWrapper
   *
   * @param {number} index
   * @param {boolean} as_qL
   * @returns {qlWrapper | HTMLElement}
   */
  get(index: number = null, as_qL: boolean = false): qlElement | qlWrapper {
    let el: qlElement = (index === null) ? this.#entries[0] : this.#entries[index]

    if (el) return as_qL ? q(el) : el
    else return null
  }

  /**
   * Get window scroll top
   *
   * @returns {number}
   */
  scrollTop(): number { return window.pageYOffset }

  /**
   * Get element top offset
   *
   * @returns {number}
   */
  topOffset(): number { return this.offsetTop }

  /**
   * Get or set element innerText property
   *
   * @param {string} value
   * @returns {string}
   */
  text(value: string = null): string {
    if (value !== null) this.each(el => el.innerText = value)

    return value !== null ? value : this.innerText
  }

  /**
   * Get or set element value property
   *
   * @param {string} value
   * @returns {string}
   */
  val(val: string = null): string {
    val && (this.value = val)

    return this.value
  }

  /**
   * Get count of selected elements
   *
   * @returns {number}
   */
  len(): number { return this.#entries.length }

  /**
   * Get element parent
   *
   * @param {string} selector
   * @returns {qlWrapper}
   */
  parent(selector: string = null): qlWrapper {
    if (!selector) return q(this.parentElement)

    this.unambiguityRequire()
    let parent = this.parent()
    while (!parent.matches(selector)) {
      if (parent.matches(':root')) return null

      parent = parent.parent()
    }

    return parent
  }

  /**
   * Get previous element for this one
   *
   * @returns {qlWrapper}
   */
  prev(): qlWrapper { return q(this.previousElementSibling) }

  /**
   * Get next element for this one
   *
   * @returns {qlWrapper}
   */
  next(): qlWrapper { return q(this.nextElementSibling) }

  /**
   * Get form elements
   *
   * @returns {qlWrapper}
   */
  elements(): qlWrapper {
    this.unambiguityRequire()

    const form = <HTMLFormElement>this.get()
    let elements = null

    for (let key in form.elements)
      if (form.elements.hasOwnProperty(key) && Number.isNaN(parseInt(key)))
        elements ? elements.pushElement(form.elements[key]) : (elements = q(<qlInput>form.elements[key]))

    return elements
  }

  /**
   * Get formData for the selected form
   *
   * @returns {Object}
   */
  formData(): Object {
    this.unambiguityRequire()

    let form: qlWrapper = <qlWrapper>this.get(0, true)
    let formData = new Object()

    if (!(form.get() instanceof HTMLFormElement)) throw new Error('Элемент не является формой')
    form.elements().each(el => formData[el.name] = el.value)

    return formData
  }

  /**
   * Check if element equals to the selected one
   *
   * @param {qlWrapper | HTMLElement} element
   * @returns {boolean}
   */
  equalTo(element: qlWrapper | HTMLElement): boolean {
    this.unambiguityRequire()

    return this.get() === (element instanceof qlWrapper ? <HTMLElement>element.get() : <HTMLElement>element)
  }

  /**
   * Check if the element into selected collection
   *
   * @param {qlWrapper | HTMLElement} element
   * @returns {boolean}
   */
  inCollection(element: qlWrapper | HTMLElement): boolean {
    let inCollection = false

    this.each(el => {
      if (el.equalTo(element)) inCollection = true
    })

    return inCollection
  }



  /**
   * Check if collection must have only one element else Exception will be thrown
   *
   * @throws {Error}
   * @returns {boolean}
   */
  unambiguityRequire(): boolean {
    if (this.len() > 1)
      throw new Error(`Коллекция состоит из ${this.len()} элементов. Я не понимаю для какого элемента вы хотите получить значение`)

    return true
  }

  /**
   * Push a new element into the collection
   *
   * @param {qlWrapper | HTMLElement} element
   * @returns {qlWrapper}
   */
  pushElement(element: qlWrapper | HTMLElement): qlWrapper {
    (element instanceof HTMLElement || element instanceof qlWrapper)
      && !this.inCollection(element)
      && this.#entries.push(element instanceof qlWrapper ? <HTMLElement>element.get() : <HTMLElement>element)

    return this
  }

}

// The methods above this comment need refactoring





/**
 * Wrap elements with qlWrapper
 *
 * @param {qlInput | Function} input
 * @param {qlInput} parent
 * @returns {qlWrapper}
 */
function q(input: qlInput | Function, parent?: qlInput): qlWrapper {

  if (input instanceof Function) return q(document).on('DOMContentLoaded', input)
  else if (input instanceof qlWrapper) return input

  parent = q(parent || document)
  if (parent.len() !== 1) throw new Error('There are several elements into the qlWrapper')
  parent = <qlElement>parent.get()



  let selected = []

  if (typeof input === 'string') selected = [...parent.querySelectorAll(input)]
  else if (input instanceof HTMLElement || input instanceof Window || input instanceof HTMLDocument) selected = [<qlElement>input]

  if (selected.length === 0) return null



  return new Proxy(new qlWrapper(selected), {
    get(target, prop, receiver) {
      if (prop in target) return Reflect.get(target, prop, receiver)

      target.unambiguityRequire()
      let gotten = Reflect.get(target.get(), prop)

      return typeof gotten === 'function' ? gotten.bind(target.get()) : gotten
    },

    set(target, name, val) {
      if (name in target) return Reflect.set(target, name, val)

      target.unambiguityRequire()
      return Reflect.set(target.get(), name, val)
    }
  })

}
