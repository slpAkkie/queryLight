/** queryLight */

/**
 * Скрипты предоставлены для queryLight (ql)
 *
 * Author: Alexandr Shamanin (@slpAkkie)
 * Version: 1.0.5
 * File Version: 1.0.3
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
   * @var {Object} queryLight Объект queryLight
   */
  let queryLight = new Object( {
    /** Поле идентификации того, что это Проксированный элемент */
    qL: this,
    _( input ) { return qL( input, this ) },

    /** Основные функции */
    addClass( classString ) { this.each( el => el.classList.add( classString ) ); return this },
    removeClass( classString ) { this.each( el => el.classList.remove( classString ) ); return this },
    toggleClass( classString ) { this.each( el => _( el ).hasClass( classString ) ? _( el ).removeClass( classString ) : _( el ).addClass( classString ) ) },
    hasClass( classString ) { return this.elements.some( el => el.classList.contains( classString ) ) },
    on( eventName, callback ) { this.each( el => el.addEventListener( eventName, callback ) ); return this },
    each( callback ) { this.elements.forEach( el => callback.call( _( el ), _( el ) ) ); return this },
    insertBefore( sibling ) {
      this.parent.insertBefore( sibling, this.get() );

      return sibling
    },
    insertAfter( sibling ) {
      let nextSibling = this.nextSibling;
      nextSibling
        ? this.parent.insertBefore( sibling, this.nextSibling )
        : this.parent.appendChild( sibling );

      return sibling
    },
    insertLast( child ) {
      child.qL
        ? this.each( el => child.each( ch => el.insertLast( ch.get() ) ) )
        : this.each( el => el.appendChild( child.cloneNode( true ) ) );

      return this
    },
    get( index = null, as_qL = false ) { let el = ( index === null ) ? this.elements[ 0 ] : this.elements[ index ]; return as_qL ? qL( el ) : el },

    /** Основные геттеры */
    scrollTop() { return window.pageYOffset },
    topOffset() { return this.offsetTop },
    text( value = null ) {
      if ( value !== null ) this.each( el => el.innerText = value );

      return value || this.innerText;
    },
    len() { return this.elements.length },
    parent() { return this.parentElement },



    /** Служебные функции */
    __aloneRequire() { if ( this.len() > 1 ) throw new Error( `Коллекция состоит из ${this.len()} элементов. Я не понимаю для какого элемента вы хотите получить значение` ); return true }
  } );



  /** Проверка на входные параметры */
  if ( parent && parent.qL && parent.__aloneRequire() ) parent = parent.get();
  else if ( !( parent instanceof Element ) ) {
    if ( parent !== null ) throw new Error( 'Родительский элемент не был DOM элементом. Если вы использовали элемент, взятый с помощью qL убедитесь что получили конкретный DOM элемент' );
    parent = document;
  }

  if ( typeof input === 'string' ) queryLight.elements = Array.from( parent.querySelectorAll( input ) );
  else if ( input instanceof Element || window instanceof Window ) queryLight.elements = [ input ];
  else return null;



  if ( queryLight.len() === 0 ) return null;



  /** Вернем обертку над элементами */
  return new Proxy( queryLight, {
    get( target, prop, receiver ) {
      if ( !( prop in target ) ) {
        target.__aloneRequire();
        target = target.get();
        let gotten = Reflect.get( target, prop );

        if ( typeof gotten === 'function' ) return gotten.bind( target );
        else return gotten;
      }

      return Reflect.get( target, prop, receiver );
    },

    set( target, name, val ) {
      if ( !( name in target ) ) {
        target.__aloneRequire();
        target = target.get();
        return Reflect.set( target, name, val );
      }

      return Reflect.set( target, name, val );
    }
  } )

}

/** @constant {Function} _ Алиас для qL */
const _ = qL;
