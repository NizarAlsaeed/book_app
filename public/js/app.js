const secEl = document.querySelector('#dropNav');
const imgBtnEl = document.querySelector('#showBtnImg');
imgBtnEl.addEventListener('click',()=>{
    secEl.hasAttribute('style')?secEl.removeAttribute('style'):secEl.setAttribute('style','display:none;');
});

