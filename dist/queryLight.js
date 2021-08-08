class qLWrapper{_(e){return qL(e,this)}addClass(t){return this.each(e=>e.classList.add(t)),this}removeClass(t){return this.each(e=>e.classList.remove(t)),this}toggleClass(t){return this.each(e=>qL(e).hasClass(t)?qL(e).removeClass(t):qL(e).addClass(t)),this}hasClass(t){return this.__elements.some(e=>e.classList.contains(t))}on(n,r,i=null){return this.each(function(e){var t=i?e[`Handler_${i}`]=r.bind(qL(this)):r.bind(qL(this));e.addEventListener(n,t)}),this}removeOn(n,r){return this.each(function(e){var t=e.get()[`Handler_${r}`]||null;null!==t&&e.removeEventListener(n,t)}),this}each(n){return this.__elements.forEach((e,t)=>n.call(qL(e),qL(e),t)),this}insertBefore(e){if(this.__aloneRequire(),e instanceof qLWrapper){let t=this.parent().get();e.each(e=>t.insertBefore(e.get(),this.get()))}else this.parent().get().insertBefore(e,this.get());return e}insertAfter(e){let t=qL(this.nextElementSibling);return t?t.insertBefore(e):this.parent().insert(e),e}insert(e,t=!1){return e instanceof qLWrapper||(e=qL(e)),t?(this.each(t=>e.each(e=>t.appendChild(e.get().cloneNode(!0)))),this):(this.__aloneRequire(),e.each(e=>this.appendChild(e.get())),e)}insertFirst(e,t=!1){return e instanceof qLWrapper||(e=qL(e)),t?(this.each(n=>e.each(e=>{var t;return(null===(t=qL(n.firstElementChild))||void 0===t?void 0:t.insertBefore(e.get().cloneNode(!0)))||n.insert(e)})),this):(this.__aloneRequire(),e.each(e=>{var t;return(null===(t=qL(this.firstElementChild))||void 0===t?void 0:t.insertBefore(e.get()))||this.insert(e)}),e)}replace(e){return this.replaceWith(e instanceof qLWrapper?e.get():e),e}clear(){return this.each(e=>e.innerHTML=""),this}get(e=null,t=!1){e=null===e?this.__elements[0]:this.__elements[e];return t?qL(e):e}scrollTop(){return window.pageYOffset}topOffset(){return this.offsetTop}text(t=null){return null!==t&&this.each(e=>e.innerText=t),null!==t?t:this.innerText}val(e=null){return e&&(this.value=e),this.value}len(){return this.__elements.length}parent(e=null){if(!e)return qL(this.parentElement);this.__aloneRequire();let t=this.parent();for(;!t.matches(e);){if(t.matches(":root"))return null;t=t.parent()}return t}prev(){return qL(this.previousElementSibling)}next(){return qL(this.nextElementSibling)}elements(){this.__aloneRequire();const e=this.get();let t=null;for(var n in e.elements)e.elements.hasOwnProperty(n)&&Number.isNaN(parseInt(n))&&(t?t.__push(e.elements[n]):t=qL(e.elements[n]));return t}formData(){this.__aloneRequire();let e=this.get(0,!0),t=new Object;if(!(e.get()instanceof HTMLFormElement))throw new Error("Элемент не является формой");return e.elements().each(e=>t[e.name]=e.value),t}equalTo(e){return this.__aloneRequire(),this.get()===(e instanceof qLWrapper?e.get():e)}inCollection(t){let n=!1;return this.each(e=>{e.equalTo(t)&&(n=!0)}),n}__aloneRequire(){if(1<this.len())throw new Error(`Коллекция состоит из ${this.len()} элементов. Я не понимаю для какого элемента вы хотите получить значение`);return!0}__push(e){return(e instanceof Node||e instanceof qLWrapper)&&!this.inCollection(e)&&this.__elements.push(e instanceof qLWrapper?e.get():e),this}}function qL(t,n=null){if("function"!=typeof t){let e=new qLWrapper;if(n&&n instanceof qLWrapper&&n.__aloneRequire())n=n.get();else if(!(n instanceof Element)){if(null!==n)throw new Error("Родительский элемент не был DOM элементом. Если вы использовали элемент, взятый с помощью qL убедитесь что получили конкретный DOM элемент");n=document}if(t&&t instanceof qLWrapper)return t;if("string"==typeof t)e.__elements=Array.from(n.querySelectorAll(t));else{if(!(t instanceof Element||t instanceof Window||t instanceof Document))return null;e.__elements=[t]}return 0===e.len()?null:new Proxy(e,{get(t,n,e){if(n in t)return Reflect.get(t,n,e);{t.__aloneRequire();t=t.get();let e=Reflect.get(t,n);return"function"==typeof e?e.bind(t):e}},set(e,t,n){if(t in e)return Reflect.set(e,t,n);e.__aloneRequire();e=e.get();return Reflect.set(e,t,n)}})}qL(document).on("DOMContentLoaded",t)}