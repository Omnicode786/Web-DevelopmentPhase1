let btn = `<button id="ham2" class="whiteBack"><span class="material-symbols-outlined">menu</span></button>
      <div class="sidebar behind red">
            <button id="close1" class="red"><span class="material-symbols-outlined">close</span></button>
            <ul class="topics">
                <li class="lists"><a class="anchors" href="js1.html">Introduction to C</a></li>
            </ul>
      </div>`

document.body.insertAdjacentHTML('afterbegin', btn);

document.querySelector('#close1').addEventListener('click',()=>{
    document.body.querySelector('.sidebar').classList.add('behind');
})

document.querySelector('#ham2').addEventListener('click',()=>{
    document.body.querySelector('.sidebar').classList.remove('behind');
})

// Checking for dark mode 
if (JSON.parse(myStorage.getItem('val')) === 1) {
    document.querySelector('.sidebar').classList.remove('red');
    document.querySelector('.sidebar').classList.add('gray');
    document.querySelector('#close1').classList.remove('red');
    document.querySelector('#close1').classList.add('gray');
    document.querySelector('#ham2').classList.remove('whiteBack');
    document.querySelector('#ham2').classList.add('black');
    document.querySelector('#ham2').classList.add('white');
}

Array.from(darkMode).forEach((val)=>{
    val.addEventListener('click',()=>{
        if (document.querySelector('#ham2').classList.contains('whiteBack') && document.querySelector('.sidebar').classList.contains('red') && document.querySelector('#close1').classList.contains('red')) {
            document.querySelector('#ham2').classList.add('white');
            document.querySelector('#ham2').classList.remove('whiteBack');
            document.querySelector('#ham2').classList.add('black');
            document.querySelector('.sidebar').classList.remove('red');
            document.querySelector('.sidebar').classList.add('gray');
            document.querySelector('#close1').classList.remove('red');
            document.querySelector('#close1').classList.add('gray');
        }
        else {
            document.querySelector('#ham2').classList.remove('white');
            document.querySelector('#ham2').classList.remove('black');
            document.querySelector('#ham2').classList.add('whiteBack');
            document.querySelector('.sidebar').classList.remove('gray');
            document.querySelector('.sidebar').classList.add('red');
            document.querySelector('#close1').classList.remove('gray');
            document.querySelector('#close1').classList.add('red');
        }
    })
})
