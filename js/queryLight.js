/** queryLight */

/**
 * Скрипты предоставлены для queryLight (ql)
 *
 * Author: Alexandr Shamanin (@slpAkkie)
 * Version: 1.0.0
 * File Version: 1.0.0
*/





/**
 * queryLight
 *
 * @param {string|Element} input Строка css селектора или DOM элемент
 *
 * @returns {Proxy} Обертка вокруг элементов
 */
function qL( input ) {

  if ( typeof input === 'function' ) { document.addEventListener( 'DOMContentLoaded', input ); return; }



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
    get len() { return this.elements.length },



    /** Служебные функции */
    __aloneRequire() { if ( this.len > 1 ) throw new Error( `Коллекция состоит из ${this.len} элементов. Я не понимаю для какого элемента вы хотите получить значение` ); return true }
  } );



  /** Проверка на входной параметр */
  if ( typeof input === 'string' ) qL.elements = Array.from( document.querySelectorAll( input ) );
  else if ( input instanceof Element || window instanceof Window ) qL.elements = [ input ];
  else return null;



  /** Вернем обертку над элементами */
  return new Proxy( qL, {
    get( target, prop, receiver ) {
      return Reflect.get(
        prop in target
          ? target
          : target.elements,
        prop,
        receiver
      );
    }
  } )

}

/** @constant {Function} _ Алиас для qL */
const _ = qL;
