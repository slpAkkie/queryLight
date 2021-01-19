/** queryLight */

/**
 * Скрипты предоставлены для queryLight (ql)
 *
 * Author: Alexandr Shamanin (@slpAkkie)
 * Version: 1.0.1
 * File Version: 1.0.1
*/





/**
 * queryLight
 *
 * @param {string|Element} input Строка css селектора или DOM элемент
 * @param {Element} parent Элемент внутри которого будет производиться поиск. По умолчанию document
 *
 * @returns {Proxy} Обертка вокруг элементов
 */
function qL( input, parent = null ) {

  if ( typeof input === 'function' ) { _( document ).on( 'DOMContentLoaded', input ); return; }



  /**
   * @var {Object} qL Объект queryLight
   */
  let qL = new Object( {
    /** Основные функции */
    addClass( classString ) { this.each( el => el.classList.add( classString ) ); return this },
    removeClass( classString ) { this.each( el => el.classList.remove( classString ) ); return this },
    toggleClass( classString ) { this.each( el => _( el ).hasClass( classString ) ? _( el ).removeClass( classString ) : _( el ).addClass( classString ) ) },
    hasClass( classString ) { return this.elements.some( el => el.classList.contains( classString ) ) },
    on( eventName, callback ) { this.each( el => el.addEventListener( eventName, callback ) ); return this },
    each( callback ) { this.elements.forEach( el => callback.call( el, el ) ); return this },
    get( index = null ) { return index === null ? this.elements[ 0 ] : this.elements[ index ] },

    /** Основные геттеры */
    get scrollTop() { return window.pageYOffset },
    get offsetTop() { this.__aloneRequire(); return this.get().offsetTop },
    get text() { this.__aloneRequire(); return this.get().innerText },
    get len() { return this.elements.length },



    /** Служебные функции */
    __aloneRequire() { if ( this.len > 1 ) throw new Error( `Коллекция состоит из ${this.len} элементов. Я не понимаю для какого элемента вы хотите получить значение` ); return true }
  } );



  /** Проверка на входные параметры */
  if ( !( parent instanceof Element ) ) {
    if ( parent !== null ) throw new Error( 'Родительский элемент не был DOM элементом. Если вы использовали элемент, взятый с помощью qL убедитесь что получили конкретный DOM элемент' );
    parent = document;
  }

  if ( typeof input === 'string' ) qL.elements = Array.from( parent.querySelectorAll( input ) );
  else if ( input instanceof Element || window instanceof Window ) qL.elements = [ input ];
  else return null;



  if ( qL.elements.length === 0 ) return null;



  /** Вернем обертку над элементами */
  return new Proxy( qL, {
    get( target, prop, receiver ) {
      if ( !( prop in target ) ) {
        target.__aloneRequire();
        target = target.get();
        let gotten = Reflect.get( target, prop );

        if ( typeof gotten === 'function' ) return gotten.bind( target );
        else return gotten;
      }

      return Reflect.get( target, prop, receiver );
    }
  } )

}

/** @constant {Function} _ Алиас для qL */
const _ = qL;
