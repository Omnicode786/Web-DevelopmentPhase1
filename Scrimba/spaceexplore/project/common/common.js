let myStorage = localStorage;

let common = `<div class="nav red">
      <div class="myNav">
            Muzammil's Scripts!
            <nav>
                  <ul class="ul">
                        <li><a class="link navlinks" href="../index.html">Home</a></li>
                        <li><a class="link navlinks" href="../about.html">About Us</a></li>
                  </ul>
            </nav>
            <button id="ham1" class="red"><span class="material-symbols-outlined">menu</span></button> 
      </div>
      <div style="position: relative">
            <button class="link navlinks btn red" id="btn1">Languages</button>
            <div class="lang1 above red">
                  <ul>
                        <button id="close3" class="red"><span class="material-symbols-outlined">close</span></button>
                        <li class="li"><a class="link langlinks" href="../C/c1.html">C</a></li>
                        <li class="li"><a class="link langlinks" href="../JS/js1.html">JavaScript</a></li>
                        <li class="li"><a class="link langlinks" href="../PYTHON/py1.html">Python</a></li>
                  </ul>
            </div>
      </div>
      <button class="darkMode red"><img src="common\\night.png"></button>
</div>
<div class="response red">
      <nav>
      <button id="close2" class="red"><span class="material-symbols-outlined">close</span></button>
            <ul class="ul">
                  <li><a class="link navlinks" href="../index.html">Home</a></li>
                  <li><a class="link navlinks" href="../about.html">About Us</a></li>
            </ul>
      </nav>
</div>
<div class="lang2 above red">
      <ul>
            <button id="close4" class="red"><span class="material-symbols-outlined">close</span></button>
            <li class="li"><a class="link langlinks" href="../C/c1.html">C</a></li>
            <li class="li"><a class="link langlinks" href="../JS/js1.html">JavaScript</a></li>
            <li class="li"><a class="link langlinks" href="../PYTHON/py1.html">Python</a></li>
      </ul>
</div>`;


document.body.insertAdjacentHTML('afterbegin', common);

const hamButton = document.querySelector('#ham1');
const closeButton1 = document.querySelector('#close2');
const closeButton2 = document.querySelector('#close3');
const closeButton3 = document.querySelector('#close4');
const langButton = document.querySelector('#btn1');
const responseDiv = document.querySelector('.response');
const langDiv1 = document.querySelector('.lang1');
const langDiv2 = document.querySelector('.lang2');
const darkMode = document.querySelectorAll('.darkMode');
const redElements = document.querySelectorAll('.red');
const children = document.body.children;
const members = document.body.querySelectorAll('.organization');

// Checking for dark mode 
if (JSON.parse(myStorage.getItem('val')) === 1) {
      document.body.classList.add('black');
      Array.from(children).forEach(child => {
            child.classList.add('white');
      });
      members.forEach(child => {
            child.style.color = "white";
            child.style.textDecorationColor = "white";
      });
      redElements.forEach(element => {
            element.classList.remove('red');
            element.classList.add('gray');
      })
}


// Dark mode toggle
darkMode.forEach(button => {
      button.addEventListener('click', () => {
            document.body.classList.toggle('black');
            Array.from(children).forEach(child => {
                  child.classList.toggle('white');
            });
            members.forEach((child) => {
                  if (JSON.parse(myStorage.getItem('val')) === 0) {
                        child.style.color = "white";
                        child.style.textDecorationColor = "white";
                  } else {
                        child.style.color = "black";
                        child.style.textDecorationColor = "black";
                  }
            });

            redElements.forEach(element => {
                  if (element.classList.contains('red')) {
                        myStorage.setItem('val', 1);
                        element.classList.remove('red');
                        element.classList.add('gray');
                  } else {
                        myStorage.setItem('val', 0);
                        element.classList.remove('gray');
                        element.classList.add('red');
                  }
            });
      });
});
// // Toggle the navigation for mobile view
hamButton.addEventListener('click', () => {
      responseDiv.classList.add('below');
      if (!((langDiv1.classList.contains('above')) || (langDiv2.classList.contains('above')))) {
            langDiv1.classList.add('above');
            langDiv2.classList.add('above');
      }
});

// Toggle language menu
langButton.addEventListener('click', () => {
      langDiv1.classList.remove('above');
      langDiv2.classList.remove('above');
      if (!(responseDiv.classList.contains('above'))) {
            responseDiv.classList.remove('below');
      }
});


closeButton1.addEventListener('click',()=>{
      responseDiv.classList.remove('below');
})
closeButton2.addEventListener('click',()=>{
      langDiv1.classList.add('above');
})
closeButton3.addEventListener('click',()=>{
      langDiv2.classList.add('above');
})


