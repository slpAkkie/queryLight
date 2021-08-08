/** queryLight */

/**
 * Скрипты предоставлены для queryLight (ql)
 *
 * Author: Alexandr Shamanin (@slpAkkie)
 * Version: 1.0.5
 * File Version: 1.0.15
*/





/**
 * Обертка qLWrapper
 */
class qLWrapper {
  qL: boolean = true
  _(input) { return _(input, this) }

  addClass(classString) { this.each(el => el.classList.add(classString)); return this }
  removeClass(classString) { this.each(el => el.classList.remove(classString)); return this }
  toggleClass(classString) { this.each(el => _(el).hasClass(classString) ? _(el).removeClass(classString) : _(el).addClass(classString)) }
  hasClass(classString) { return this.__elements.some(el => (<HTMLElement>el).classList.contains(classString)) }
  on(eventName, callback, alias = null) {
    this.each(function (el) {
      let handler = alias ? (el[`Handler_${alias}`] = callback.bind(_(this))) : callback.bind(_(this));
      el.addEventListener(eventName, handler);
    });
    return this
  }
  removeOn(eventName, alias) {
    this.each(function (el) {
      let handler = el.get()[`Handler_${alias}`] || null;
      if (handler !== null) el.removeEventListener(eventName, handler);
    });
    return this
  }
  each(callback) { this.__elements.forEach((el, i) => callback.call(_(el), _(el), i)); return this }
  insertBefore(sibling) {
    this.__aloneRequire();

    if (sibling.qL) {
      let parent = this.parent().get();

      sibling.each(ch => parent.insertBefore(ch.get(), this.get()));
    } else
      this.parent().get().insertBefore(sibling, this.get());

    return sibling
  }
  insertAfter(sibling) {
    // @ts-ignore
    let nextSibling = _(this.nextElementSibling);
    nextSibling
      ? nextSibling.insertBefore(sibling)
      : this.parent().insert(sibling);

    return sibling
  }
  insert(child, multiInsert = false) {
    !child.qL && (child = _(child));

    if (multiInsert) {
      this.each(el => child.each(ch => el.appendChild(ch.get().cloneNode(true))));

      return this
    } else {
      this.__aloneRequire();
      // @ts-ignore
      child.each(ch => this.appendChild(ch.get()));

      return child
    }
  }
  insertFirst(child, multiInsert = false) {
    !child.qL && (child = _(child));

    if (multiInsert) {
      this.each(el => child.each(ch => _(el.firstElementChild)?.insertBefore(ch.get().cloneNode(true)) || el.insert(ch)));

      return this
    } else {
      this.__aloneRequire();
      // @ts-ignore
      child.each(ch => _(this.firstElementChild)?.insertBefore(ch.get()) || this.insert(ch));

      return child
    }
  }
  // @ts-ignore
  replace(newElement) { this.replaceWith(newElement.qL ? newElement.get() : newElement); return newElement }
  clear() {
    this.each(el => el.innerHTML = '');

    return this
  }
  get(index = null, as_qL = false) { let el = (index === null) ? this.__elements[0] : this.__elements[index]; return as_qL ? _(el) : el }

  /** Основные геттеры */
  scrollTop() { return window.pageYOffset }
  // @ts-ignore
  topOffset() { return this.offsetTop }
  text(value = null) {
    if (value !== null) this.each(el => el.innerText = value);

    // @ts-ignore
    return value !== null ? value : this.innerText;
  }
  val(val = null) {
    // @ts-ignore
    val && (this.value = val);

    // @ts-ignore
    return this.value;
  }
  len() { return this.__elements.length }
  parent(selector = null) {
    // @ts-ignore
    if (!selector) return _(this.parentElement);

    this.__aloneRequire();
    let parent = this.parent();
    while (!parent.matches(selector)) {
      if (parent.matches(':root')) return null;

      parent = parent.parent();
    }

    return parent;
  }
  // @ts-ignore
  prev() { return _(this.previousElementSibling) }
  // @ts-ignore
  next() { return _(this.nextElementSibling) }
  elements() {
    this.__aloneRequire();

    const form = this.get();
    let elements = null;

    for (let key in form.elements)
      if (form.elements.hasOwnProperty(key) && Number.isNaN(parseInt(key)))
        elements ? elements.__push(form.elements[key]) : (elements = _(form.elements[key]));

    return elements;
  }
  formData() {
    this.__aloneRequire();

    let form: qLWrapper = this.get(0, true)
    let formData = new Object();

    if (!(form.get() instanceof HTMLFormElement)) throw new Error('Элемент не является формой');
    form.elements().each(el => formData[el.name] = el.value);

    return formData;
  }
  equalTo(element) {
    this.__aloneRequire();

    return this.get() === (element.ql ? element.get() : element);
  }
  inCollection(element) {
    let inCollection = false;

    this.each(el => {
      if (el.equalTo(element)) inCollection = true;
    });

    return inCollection;
  }



  __aloneRequire() { if (this.len() > 1) throw new Error(`Коллекция состоит из ${this.len()} элементов. Я не понимаю для какого элемента вы хотите получить значение`); return true }
  __push(element) {
    (element instanceof Element || element.qL)
      && !this.inCollection(element)
      && this.__elements.push(element.qL ? element.get() : element);
    return this
  }



  __elements: Array<Element | Document | Window>
}





/**
 * queryLight
 *
 * @param {string|Element} input Строка css селектора или DOM элемент
 * @param {Element} parent Элемент внутри которого будет производиться поиск. По умолчанию document
 *
 * @returns {Proxy} Обертка вокруг элементов
 */
export default function _(input, parent = null) {

  if (typeof input === 'function') { _(document).on('DOMContentLoaded', input); return; }



  /**
   * @var {Object} queryLight Объект queryLight
   */
  let queryLight = new qLWrapper();



  /** Проверка на входные параметры */
  if (parent && parent.qL && parent.__aloneRequire()) parent = parent.get()
  else if (!(parent instanceof Element)) {
    if (parent !== null) throw new Error('Родительский элемент не был DOM элементом. Если вы использовали элемент, взятый с помощью qL убедитесь что получили конкретный DOM элемент');
    parent = document;
  }

  if (input && input.qL === true) return input;

  if (typeof input === 'string') queryLight.__elements = Array.from(parent.querySelectorAll(input))
  else if (input instanceof Element || input instanceof Window || input instanceof Document) queryLight.__elements = [input]
  else return null;
  if (queryLight.len() === 0) return null;



  /** Вернем обертку над элементами */
  return new Proxy(queryLight, {
    get(target, prop, receiver) {
      if (!(prop in target)) {
        target.__aloneRequire();
        target = target.get();
        let gotten = Reflect.get(target, prop);

        if (typeof gotten === 'function') return gotten.bind(target)
        else return gotten;
      }

      return Reflect.get(target, prop, receiver);
    },

    set(target, name, val) {
      if (!(name in target)) {
        target.__aloneRequire();
        target = target.get();
        return Reflect.set(target, name, val);
      }

      return Reflect.set(target, name, val);
    }
  })

}
