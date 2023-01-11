<template>
  <div id="box">
    <div class="question">
      <p class="one">59.</p>
      <p class="two">下列立体图形中，其视图（正视图、俯视图、侧视图）不可能是所给四个选项中的哪一项（）</p>
    </div>

    <img style="width: 40%" src="./img/pic(2).png"/>
    <img style="width: 100%;margin-bottom: 10px" src="./img/pic(1).png"/>
    <div id="down">
      <div class="options">
        <div @click="select('A')"><p :class="[answer==='A'?'select':'']" class="op">A</p>
          <p>A</p></div>
        <div @click="select('B')"><p :class="[answer==='B'?'select':'']" class="op">B</p>
          <p>B</p></div>
        <div @click="select('C')"><p :class="[answer==='C'?'select':'']" class="op">C</p>
          <p>C</p></div>
        <div @click="select('D')"><p :class="[answer==='D'?'select':'']" class="op">D</p>
          <p>D</p></div>
        <p v-if="answer!==''" class="tips" :class="[answer==='D'?'green':'red']">{{ answer === 'D' ? '恭喜你，答对了✅' : '很遗憾，答错了❌' }}</p>
      </div>
      <div :class="[answer===''?'hide':'show']" id="info">
        <canvas id="three">
        </canvas>
        <p>{{ text }}</p>
        <p class="figure">手指拖动👆，加深理解</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import {nextTick, onMounted, ref} from "vue";
import * as THREE from "three";
import {isNear} from "./utils";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

let camera, scene, renderer, frustumSize = 200;
const text = ref('')


const answer = ref('');
const a = [2.5, -2.6, 331]
const b = [331, -2.6, -2.5]
const c = [0, 331, 0]

onMounted(async _ => {
  init();
  await nextTick()
  await wait1s()
  render()
})
//创建一个函数等待1s后返回一个promise
const wait1s = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 500)
  })
}

const select = (v) => {
  answer.value = v;
}


const render = () => {
  const {x, y, z} = camera.position;
  if (isNear(x, a[0]) && isNear(y, a[1]) && isNear(z, a[2])) {
    text.value = 'A'
  } else if (isNear(x, b[0]) && isNear(y, b[1]) && isNear(z, b[2])) {
    text.value = 'B'
  } else if (isNear(x, c[0]) && isNear(y, c[1]) && isNear(z, c[2])) {
    text.value = 'C'
  } else {
    text.value = ''
  }
  renderer.render(scene, camera);
}
const onWindowResize = () => {
  const canvas = document.querySelector('#three')
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(200, 200);

  render();
}
const addShadowedLight = (x, y, z, color, intensity) => {

  const directionalLight = new THREE.DirectionalLight(color, intensity);
  directionalLight.position.set(x, y, z);
  scene.add(directionalLight);

  directionalLight.castShadow = true;

  const d = 1;
  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;

  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 4;

  directionalLight.shadow.bias = -0.002;

}
const createCube = (x, y, z, rot = [0, 0, 0, 0, 0]) => {
  let geometry = new THREE.BoxGeometry(50, 50, 50);
  let material = new THREE.MeshPhongMaterial({ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30});
  let texture = new THREE.TextureLoader();
  let textureList = ['./1.jpg', './2.jpg', './1.jpg', './2.jpg', './1.jpg', './2.jpg',].map(item => texture.load(item))

  textureList.forEach((item, index) => {
    if (rot[index]) {
      item.rotation = rot[index];
      item.center.set(0.5, 0.5)
    }
  })
  let materials = textureList.map(item => {
    return new THREE.MeshLambertMaterial({map: item})
  })
  let mesh = new THREE.Mesh(geometry, materials);
  mesh.position.y = y
  mesh.position.x = x
  mesh.position.z = z
  scene.add(mesh);
}
const init = () => {
  const canvas = document.querySelector('#three')
  renderer = new THREE.WebGLRenderer({canvas, antialias: true});
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(200, 200);
  renderer.shadowMap.enabled = true;
  document.getElementById('info').appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfafafa);
  scene.fog = new THREE.Fog(0x72645b, 2, 1);

  scene.add(new THREE.HemisphereLight(0x443333, 0x111122));

  addShadowedLight(100, 100, 200, 0xffffff, 1.35);


  //正交相机
  const aspect = canvas.clientWidth / canvas.clientHeight;
  camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 1, 1000);
  //透视相机
  // camera = new THREE.PerspectiveCamera(35, 1, 1, 10000);
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();

  camera.position.y = 100;
  camera.position.x = 100;
  camera.position.z = 300;

  scene.add(camera);

  const axesHelper = new THREE.AxesHelper(5000);
  // scene.add( axesHelper );

  createCube(-25, -25, -25)
  createCube(-25, 25, -25, [0, 0, 0, 0, Math.PI / 2, 0])
  createCube(25, -25, -25, [0, 0, Math.PI, 0, -Math.PI / 2, 0])
  createCube(-25, -25, 25, [Math.PI / 2, 0, Math.PI / 2, 0, Math.PI, 0])
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);
  controls.update();

  window.addEventListener('resize', onWindowResize);
}
</script>

<style scoped>
#info {
  transition: all 2s;
  opacity: 0;
}

.question {
  display: flex;
}

.one {
  font-size: 14px;
  font-weight: bold;
}

.two {
  font-size: 14px;
  text-align: justify;
  text-justify: newspaper;
  word-break: break-all;
}

#down {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.options {
  position: relative;
  width: 60px;
  flex-direction: column;
  justify-content: space-between;
  display: flex;
}

.options > div {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.options > div:last-child {
  margin-bottom: 0;
}

.options > div > .op {
  margin-right: 5px;
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-weight: lighter !important;
  font-size: 18px;
  color: #888888;
  border-radius: 20px;
  border: 1px solid #fafafa;
}

.options > div > p {
  margin: 0;
  font-weight: bold;
}

.hide {
  opacity: 0!important;
}

.show {
  opacity: 1!important;
}

.select {
  background: #f1f1f1;
}

.green {
  color: green;
}

.red {
  color: red;
}

#info {
  width: 200px;
  height: 200px;
  position: relative;
}

#info > p {
  position: absolute;
  left: 50%;
  color: #1a1a1a;
  font-weight: bold;
  margin: 0;
  transform: translateX(-50%);
  top: 5px;
}
#info .figure{

  position:absolute!important;
  left: 50%!important;
  transform: translateX(-50%)!important;
  top: 215px!important;
  white-space: nowrap;
}
.tips{
  position: absolute;
  bottom: -50px;
  white-space: nowrap;
}
</style>
