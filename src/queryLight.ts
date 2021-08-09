/**
 * @fileOverview Lightweight module for DOM manipulations
 *
 * @author Alexandr Shamanin (slpAkkie)
 * @version 2.0.1
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
type qlInput = string | Array<Node> | qlElement | qlWrapper





//
class qlWrapper {

  /**
   * @property {qlCollection}
   */
  _entries: qlCollection

  get collection() { return this._entries }

  setCollection(value: Array<qlInput>) {
    if (value instanceof Array) {
      value.forEach(i => {
        if (typeof i === 'string' || i instanceof Node || i instanceof qlWrapper)
          this.pushElement(i instanceof qlWrapper ? i.unambiguityRequire().get() : i)

        throw new Error('qlWrapper может содержать только DOM узлы')
      })

      return this
    }

    throw new Error('Коллекция должна быть массивом')
  }

  constructor(elements) { this._entries = elements }

  /**
   * TODO: Update to find in several elements
   *
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
  hasClass(value: string): boolean { return this.collection.every(i => (<HTMLElement>i).classList.contains(value)) }

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
    this.collection.forEach((el, i) => callback.call(q(el), q(el), i))

    return this
  }

  /**
   * @param {qlCommonElement} sibling
   * @returns {qlCommonElement}
   */
  insertBefore(sibling: qlCommonElement): qlCommonElement {
    sibling = q(sibling)
    sibling.each(i => this.parent().get().insertBefore(i.get(), <Node>this.get()))

    return sibling
  }

  /**
   * @param {qlCommonElement} sibling
   * @returns {qlCommonElement}
   */
  insertAfter(sibling: qlCommonElement): qlCommonElement {
    let nextSibling = this.next()

    return nextSibling ? nextSibling.insertBefore(q(sibling)) : this.parent().insert(q(sibling))
  }

  /**
   * @param {qlCommonElement} sibling
   * @returns {qlCommonElement}
   */
  insert(child: qlCommonElement): qlCommonElement {
    child = q(child)
    child.each(i => this.unambiguityRequire().appendChild(i.get()))

    return child
  }

  /**
   * @param {qlCommonElement} sibling
   * @returns {qlCommonElement}
   */
  insertFirst(child: qlCommonElement): qlCommonElement {
    let firstElement = q(this.firstElementChild)

    return firstElement ? firstElement.insertBefore(child) : this.insert(child)
  }

  /**
   * @param {qlCommonElement} newElement
   * @returns {qlCommonElement}
   */
  replace(newElement: qlCommonElement): qlCommonElement { return this.replaceWith(q(newElement).get()) || newElement }

  /**
   * @returns {qlWrapper}
   */
  clear(): qlWrapper { return this.each(el => el.innerHTML = '') }

  /**
   * @param {number} index
   * @param {boolean} wrap
   * @returns {qlElement | qlWrapper}
   */
  get(index: number = 0, wrap: boolean = false): qlElement | qlWrapper { return wrap ? q(this.collection[index]) : this.collection[index] || null }

  /**
   * @returns {number}
   */
  topOffset(): number { return this.offsetTop }

  /**
   * @param {string} value
   * @returns {string}
   */
  text(value: string = null): string { return typeof value === 'string' && this.each(i => i.innerText = value) ? value : this.innerText }

  /**
   * @param {string} value
   * @returns {string}
   */
  html(value: string = null): string { return typeof value === 'string' && this.each(i => i.innerHTML = value) ? value : this.innerHTML }

  /**
   * @param {string} value
   * @returns {string}
   */
  val(value: string = null): string { return typeof value === 'string' && this.each(i => i.value = value) ? value : this.value }

  /**
   * @returns {number}
   */
  count(): number { return this.collection.length }

  /**
   * @param {string} selector
   * @returns {qlWrapper}
   */
  parent(selector: string = null): qlWrapper {
    let parent: qlWrapper = this.parentElement
    if (parent.matches(':root')) return null

    return !selector || parent.matches(selector) ? parent : parent.parent(selector)
  }

  /**
   * @returns {qlWrapper}
   */
  prev(): qlWrapper { return this.previousElementSibling }

  /**
   * @returns {qlWrapper}
   */
  next(): qlWrapper { return this.nextElementSibling }

  /**
   * @returns {qlWrapper}
   */
  elems(): qlWrapper { return this.get() instanceof HTMLFormElement ? q([...this.elements]) : null }

  /**
   * @returns {Object}
   */
  formData(): Object { return (<Array<HTMLInputElement>>this.elems()?.collection || []).reduce((carry, i) => i.name ? Object.assign(carry, { [i.name]: i.value }) : carry, {}) }

  /**
   * @param {qlCommonElement} element
   * @returns {boolean}
   */
  equalTo(element: qlCommonElement): boolean { return this.isEqualNode((element = q(element)).unambiguityRequire().get()) }

  /**
   * @param {qlCommonElement} element
   * @returns {boolean}
   */
  inCollection(element: qlCommonElement): boolean { return this.collection.some(i => q(i).equalTo(element)) }



  /**
   * @throws {Error}
   * @returns {qlWrapper}
   */
  unambiguityRequire(): qlWrapper {
    if (this.count() > 1) throw new Error(`Вызов не однозначен, в коллекции ${this.count()} элементов`)

    return this
  }

  /**
   * @param {qlInput} element
   * @returns {qlWrapper}
   */
  pushElement(...elements: qlInput[]): qlWrapper {
    elements.forEach(i => { if (i = q(i)) this.inCollection(i) || this._entries.push(<qlElement>i.get()) })

    return this
  }

}





/**
 * @param {qlInput | Function} input
 * @param {qlInput} parent
 * @returns {qlWrapper}
 */
export default function q(input: qlInput | Function, parent?: qlInput): qlWrapper {

  if (input instanceof Function) return q(document).on('DOMContentLoaded', input)
  else if (input instanceof qlWrapper) return input

  if (!(input instanceof Document)) {
    parent = q(parent || document)
    if (parent.count() !== 1) throw new Error('There are several elements into the qlWrapper')
    parent = <qlElement>parent.get()
  }



  let selected = []

  if (typeof input === 'string') selected = [...(<qlElement>parent).querySelectorAll(input)]
  else if (input instanceof HTMLElement || input instanceof Window || input instanceof Document) selected = [<qlElement>input]
  else if (input instanceof Array) selected = input

  if (selected.length === 0) return null



  return new Proxy(new qlWrapper(selected), {
    get(target, prop, receiver) {
      if (prop in target) return Reflect.get(target, prop, receiver)

      let gotten = Reflect.get(target.unambiguityRequire().get(), prop)

      return typeof gotten === 'function'
        ? gotten.bind(target.get())
        : gotten instanceof Node ? q(<qlInput>gotten) : gotten
    },

    set(target, name, val) {
      return name in target
        ? Reflect.set(target, name, val)
        : Reflect.set(target.unambiguityRequire().get(), name, val)
    }
  })

}
