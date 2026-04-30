const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha:true });

renderer.setSize(innerWidth, innerHeight);
camera.position.z = 5;

/* الماوس */
let mouse = { x:0, y:0 };
window.addEventListener("mousemove",(e)=>{
  mouse.x = (e.clientX / innerWidth - 0.5) * 2;
  mouse.y = (e.clientY / innerHeight - 0.5) * 2;
});

/* نقاط */
const count = 400;
const geometry = new THREE.BufferGeometry();

let positions = new Float32Array(count * 3);
let sizes = new Float32Array(count);

for(let i=0;i<count;i++){
  positions[i*3] = (Math.random()-0.5)*12;
  positions[i*3+1] = (Math.random()-0.5)*12;
  positions[i*3+2] = (Math.random()-0.5)*12;

  sizes[i] = Math.random()*0.04;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));
geometry.setAttribute('size', new THREE.BufferAttribute(sizes,1));

/* Shader Glow */
const material = new THREE.ShaderMaterial({
  blending: THREE.AdditiveBlending,
  depthWrite:false,
  transparent:true,
  vertexShader: `
    attribute float size;
    void main(){
      vec4 mvPosition = modelViewMatrix * vec4(position,1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    void main(){
      float d = length(gl_PointCoord - vec2(0.5));
      float glow = 1.0 - smoothstep(0.2, 0.5, d);
      gl_FragColor = vec4(0.0,0.8,1.0,glow);
    }
  `
});

const points = new THREE.Points(geometry, material);
scene.add(points);

/* خطوط ديناميك */
let lines;
function createLines(){
  let lineGeo = new THREE.BufferGeometry();
  let arr = [];

  for(let i=0;i<count;i++){
    let x = positions[i*3];
    let y = positions[i*3+1];
    let z = positions[i*3+2];

    for(let j=i+1;j<count;j++){
      let dx = x - positions[j*3];
      let dy = y - positions[j*3+1];
      let dz = z - positions[j*3+2];
      let dist = Math.sqrt(dx*dx+dy*dy+dz*dz);

      if(dist < 1.5){
        arr.push(x,y,z);
        arr.push(
          positions[j*3],
          positions[j*3+1],
          positions[j*3+2]
        );
      }
    }
  }

  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(arr,3));

  let mat = new THREE.LineBasicMaterial({
    color:0x9b5cff,
    transparent:true,
    opacity:0.15
  });

  lines = new THREE.LineSegments(lineGeo, mat);
  scene.add(lines);
}

createLines();

/* انيميشن */
function animate(){
  requestAnimationFrame(animate);

  /* حركة ناعمة */
  points.rotation.y += 0.001;
  points.rotation.x += 0.0005;

  /* تأثير الماوس */
  camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
  camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.02;

  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}
animate();

/* ريسبونسيف */
window.addEventListener("resize",()=>{
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
});
//navbar
 
    const links = document.querySelectorAll(".navbar a");

    links.forEach(link => {
      link.addEventListener("click", function () {
        
        // شيل active من الكل
        links.forEach(l => l.classList.remove("active"));
        
        // حط active على اللي اتضغط عليه
        this.classList.add("active");

      });
    });
  
// stact
document.addEventListener('DOMContentLoaded', () => {
  const statItems = document.querySelectorAll('.stats div');

  const animateCount = (element) => {
    const text = element.textContent;
    // استخراج الأجزاء: البداية (مثل +)، الرقم، والباقي (مثل % أو النص)
    const match = text.match(/^([^\d]*)(\d+)(.*)/);
    if (!match) return;

    const prefix = match[1];       // مثال: "+"
    const target = parseInt(match[2], 10); // الرقم الهدف
    const rest = match[3];         // مثال: "% <span>نمو العملاء</span>"

    let current = 0;
    const duration = 9000; // مدة الحركة (مللي ثانية) - يمكنك تعديلها
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // دالة Ease-Out Cubic لحركة طبيعية وسلسة
      const ease = 1 - Math.pow(1 - progress, 3);
      current = Math.floor(ease * target);

      // تحديث النص مع الحفاظ على تنسيق <span>
      element.innerHTML = `${prefix}${current}${rest}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  // تشغيل العداد عند ظهور العنصر على الشاشة (Scroll Trigger)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target); // تشغيل مرة واحدة فقط
      }
    });
  }, { threshold: 0.5 }); // يبدأ عندما يظهر 50% من العنصر

  statItems.forEach(item => observer.observe(item));
});