/**
 * @fileOverview Lightweight module for DOM manipulations
 *
 * @author Alexandr Shamanin (slpAkkie)
 * @version 2.0.0
 */





interface qLCollection extends Array<Node> { }





interface qLWrapper {
  [key: string]: any
}





/**
 * @class
 */
class qLWrapper {

  /**
   * Find elements in this one
   *
   * @param {qLWrapper|Node} input
   * @returns {qLWrapper}
   */
  _(input: qLWrapper | Node): qLWrapper { return qL(input, this) }

  /**
   * Add class to the elements
   *
   * @param {string} classString
   * @returns {qLWrapper}
   */
  addClass(classString: string): qLWrapper {
    this.each(el => el.classList.add(classString));

    return this
  }

  /**
   * Remove class from the elements
   *
   * @param {string} classString
   * @returns {qLWrapper}
   */
  removeClass(classString: string): qLWrapper {
    this.each(el => el.classList.remove(classString));

    return this
  }

  /**
   * Toggle element's class
   *
   * @param {string} classString
   * @returns {qLWrapper}
   */
  toggleClass(classString: string): qLWrapper {
    this.each(el => qL(el).hasClass(classString) ? qL(el).removeClass(classString) : qL(el).addClass(classString))

    return this
  }

  /**
   * Check if at least one element has class
   *
   * @param {string} classString
   * @returns {qLWrapper}
   */
  hasClass(classString: string): boolean { return this.__elements.some(el => (<HTMLElement>el).classList.contains(classString)) }

  /**
   * Add event listener to the elements
   *
   * @param {string} eventName
   * @param {Function} callback
   * @param {string} alias
   * @returns {qLWrapper}
   */
  on(eventName, callback, alias = null): qLWrapper {
    this.each(function (el) {
      let handler = alias ? (el[`Handler_${alias}`] = callback.bind(qL(this))) : callback.bind(qL(this));
      el.addEventListener(eventName, handler);
    });

    return this
  }

  /**
   * Remove event handler from the elements
   *
   * @param {string} eventName
   * @param {string} alias
   * @returns {qLWrapper}
   */
  removeOn(eventName: string, alias: string): qLWrapper {
    this.each(function (el) {
      let handler = el.get()[`Handler_${alias}`] || null;
      if (handler !== null) el.removeEventListener(eventName, handler);
    });

    return this
  }

  /**
   * Exec callback at each of the elements
   *
   * @param {Function} callback
   * @returns {qLWrapper}
   */
  each(callback: Function): qLWrapper {
    this.__elements.forEach((el, i) => callback.call(qL(el), qL(el), i));

    return this
  }

  /**
   * Insert element before
   *
   * @param {qLWrapper | Node} sibling
   * @returns {qLWrapper | Node}
   */
  insertBefore(sibling: qLWrapper | Node): qLWrapper | Node {
    this.__aloneRequire();

    if (sibling instanceof qLWrapper) {
      let parent = this.parent().get();

      sibling.each(ch => parent.insertBefore(ch.get(), <Node>this.get()));
    } else this.parent().get().insertBefore(sibling, <Node>this.get());

    return sibling
  }

  /**
   * Insert element after
   *
   * @param {qLWrapper | Node} sibling
   * @returns {qLWrapper | Node}
   */
  insertAfter(sibling: qLWrapper | Node): qLWrapper | Node {
    let nextSibling = qL(this.nextElementSibling);
    nextSibling
      ? nextSibling.insertBefore(sibling)
      : this.parent().insert(sibling);

    return sibling
  }

  /**
   * Insert child into the elements
   *
   * @param {qLWrapper | Node} sibling
   * @returns {qLWrapper | Node}
   */
  insert(child: qLWrapper | Node, multiInsert: boolean = false): qLWrapper | Node {
    !(child instanceof qLWrapper) && (child = qL(child));

    if (multiInsert) {
      this.each((el: Node) => (<qLWrapper>child).each((ch: qLWrapper) => el.appendChild(ch.get().cloneNode(true))));

      return this
    } else {
      this.__aloneRequire();
      child.each(ch => this.appendChild(ch.get()));

      return child
    }
  }

  /**
   * Insert child into the elements at the last position
   *
   * @param {qLWrapper | Node} sibling
   * @param {boolean} multiInsert
   * @returns {qLWrapper | Node}
   */
  insertFirst(child: qLWrapper | Node, multiInsert: boolean = false): qLWrapper | Node {
    !(child instanceof qLWrapper) && (child = qL(child));

    if (multiInsert) {
      this.each(el => (<qLWrapper>child).each(ch => qL(el.firstElementChild)?.insertBefore(ch.get().cloneNode(true)) || el.insert(ch)));

      return this
    } else {
      this.__aloneRequire();
      child.each(ch => qL(this.firstElementChild)?.insertBefore(ch.get()) || this.insert(ch));

      return child
    }
  }

  /**
   * Replace element with another one
   *
   * @param {qLWrapper | Node} newElement
   * @returns {qLWrapper | Node}
   */
  replace(newElement: qLWrapper | Node): qLWrapper | Node {
    this.replaceWith(newElement instanceof qLWrapper ? newElement.get() : newElement);

    return newElement
  }

  /**
   * Clear elements entry
   *
   * @returns {qLWrapper}
   */
  clear(): qLWrapper {
    this.each(el => el.innerHTML = '');

    return this
  }

  /**
   * Get specified elements from qLWrapper
   *
   * @param {number} index
   * @param {boolean} as_qL
   * @returns {qLWrapper | Node}
   */
  get(index: number = null, as_qL: boolean = false): qLWrapper | Node {
    let el = (index === null) ? this.__elements[0] : this.__elements[index];

    return as_qL ? qL(el) : el
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
    if (value !== null) this.each(el => el.innerText = value);

    return value !== null ? value : this.innerText;
  }

  /**
   * Get or set element value property
   *
   * @param {string} value
   * @returns {string}
   */
  val(val: string = null): string {
    val && (this.value = val);

    return this.value;
  }

  /**
   * Get count of selected elements
   *
   * @returns {number}
   */
  len(): number { return this.__elements.length }

  /**
   * Get element parent
   *
   * @param {string} selector
   * @returns {qLWrapper}
   */
  parent(selector: string = null): qLWrapper {
    if (!selector) return qL(this.parentElement);

    this.__aloneRequire();
    let parent = this.parent();
    while (!parent.matches(selector)) {
      if (parent.matches(':root')) return null;

      parent = parent.parent();
    }

    return parent;
  }

  /**
   * Get previous element for this one
   *
   * @returns {qLWrapper}
   */
  prev(): qLWrapper { return qL(this.previousElementSibling) }

  /**
   * Get next element for this one
   *
   * @returns {qLWrapper}
   */
  next(): qLWrapper { return qL(this.nextElementSibling) }

  /**
   * Get form elements
   *
   * @returns {qLWrapper}
   */
  elements(): qLWrapper {
    this.__aloneRequire();

    const form = <HTMLFormElement>this.get();
    let elements = null;

    for (let key in form.elements)
      if (form.elements.hasOwnProperty(key) && Number.isNaN(parseInt(key)))
        elements ? elements.__push(form.elements[key]) : (elements = qL(form.elements[key]));

    return elements;
  }

  /**
   * Get formData for the selected form
   *
   * @returns {Object}
   */
  formData(): Object {
    this.__aloneRequire();

    let form: qLWrapper = <qLWrapper>this.get(0, true)
    let formData = new Object();

    if (!(form.get() instanceof HTMLFormElement)) throw new Error('Элемент не является формой');
    form.elements().each(el => formData[el.name] = el.value);

    return formData;
  }

  /**
   * Check if element equals to the selected one
   *
   * @param {qLWrapper | Node} element
   * @returns {boolean}
   */
  equalTo(element: qLWrapper | Node): boolean {
    this.__aloneRequire();

    return this.get() === (element instanceof qLWrapper ? <Node>element.get() : <Node>element);
  }

  /**
   * Check if the element into selected collection
   *
   * @param {qLWrapper | Node} element
   * @returns {boolean}
   */
  inCollection(element: qLWrapper | Node): boolean {
    let inCollection = false;

    this.each(el => {
      if (el.equalTo(element)) inCollection = true;
    });

    return inCollection;
  }



  /**
   * Check if collection must have only one element else Exception will be thrown
   *
   * @throws {Error}
   * @returns {boolean}
   */
  __aloneRequire(): boolean {
    if (this.len() > 1)
      throw new Error(`Коллекция состоит из ${this.len()} элементов. Я не понимаю для какого элемента вы хотите получить значение`);

    return true
  }

  /**
   * Push a new element into the collection
   *
   * @param {qLWrapper | Node} element
   * @returns {qLWrapper}
   */
  __push(element: qLWrapper | Node): qLWrapper {
    (element instanceof Node || element instanceof qLWrapper)
      && !this.inCollection(element)
      && this.__elements.push(element instanceof qLWrapper ? <Node>element.get() : <Node>element);

    return this
  }



  /**
   * Elements collection
   *
   * @property {qLCollection}
   */
  __elements: qLCollection
}





function qL(input: qLWrapper | Node | Function, parent: qLWrapper | Node = null): qLWrapper {

  if (typeof input === 'function') { qL(document).on('DOMContentLoaded', input); return; }



  let queryLight = new qLWrapper();



  if (parent && parent instanceof qLWrapper && parent.__aloneRequire()) parent = parent.get()
  else if (!(parent instanceof Element)) {
    if (parent !== null) throw new Error('Родительский элемент не был DOM элементом. Если вы использовали элемент, взятый с помощью qL убедитесь что получили конкретный DOM элемент');
    parent = document;
  }

  if (input && input instanceof qLWrapper) return input;

  if (typeof input === 'string') queryLight.__elements = Array.from((<HTMLElement>parent).querySelectorAll(input))
  else if (input instanceof Element || input instanceof Window || input instanceof Document) queryLight.__elements = [<Node>input]
  else return null;
  if (queryLight.len() === 0) return null;



  return new Proxy(queryLight, {
    get(target, prop, receiver) {
      if (!(prop in target)) {
        target.__aloneRequire();
        const t = target.get();
        let gotten = Reflect.get(t, prop);

        if (typeof gotten === 'function') return gotten.bind(t)
        else return gotten;
      }

      return Reflect.get(target, prop, receiver);
    },

    set(target, name, val) {
      if (!(name in target)) {
        target.__aloneRequire();
        const t = target.get();
        return Reflect.set(t, name, val);
      }

      return Reflect.set(target, name, val);
    }
  })

}
