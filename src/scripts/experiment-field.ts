/**
 * Static-first WebGL field.
 * The first frame is rendered immediately; animation starts only after the user presses Play.
 */

export function getDpr(devicePixelRatio: number): number {
  return Math.min(Math.max(devicePixelRatio || 1, 1), 2);
}

export function getCanvasSize(width: number, height: number, dpr: number) {
  return {
    width: Math.max(1, Math.floor(width * getDpr(dpr))),
    height: Math.max(1, Math.floor(height * getDpr(dpr))),
  };
}

export function initExperiment(scope: ParentNode = document): void {
  const canvas = scope.querySelector<HTMLCanvasElement>("[data-webgl-field]");
  const fallback = scope.querySelector<HTMLElement>("[data-webgl-fallback]");
  const toggle = scope.querySelector<HTMLButtonElement>("[data-webgl-toggle]");
  if (!canvas || !fallback) return;

  const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
  if (!gl) {
    canvas.hidden = true;
    fallback.hidden = false;
    return;
  }

  const vertexSource = "attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}";
  const fragmentSource = [
    "precision mediump float;",
    "uniform vec2 u_res;uniform float u_time;uniform vec2 u_mouse;",
    "void main(){",
    "vec2 uv=(gl_FragCoord.xy*2.0-u_res)/min(u_res.x,u_res.y);",
    "uv.x+=u_mouse.x*0.12;uv.y+=u_mouse.y*0.08;",
    "float wave=sin(uv.x*7.0+u_time*0.7)*cos(uv.y*6.0-u_time*0.45);",
    "float grid=step(0.42,fract(uv.y*9.0+uv.x*0.6+wave*0.12));",
    "float vignette=smoothstep(1.35,0.2,length(uv));",
    "float line=1.0-smoothstep(0.0,0.07,abs(fract(uv.x*4.0+wave*0.2)-0.5));",
    "vec3 accent=vec3(0.86,0.28,0.09);",
    "vec3 base=vec3(0.96,0.94,0.90);",
    "vec3 color=mix(base,accent,0.16+0.24*grid+0.12*line);",
    "float alpha=(0.15+0.28*grid+0.12*line)*vignette;",
    "gl_FragColor=vec4(color,alpha);",
    "}",
  ].join("");

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("shader");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) ?? "shader");
    }
    return shader;
  };

  try {
    const program = gl.createProgram();
    if (!program) throw new Error("program");
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const mouse = { x: 0, y: 0 };
    let frame = 0;
    let visible = true;
    let playing = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const size = getCanvasSize(rect.width, rect.height, window.devicePixelRatio || 1);
      canvas.width = size.width;
      canvas.height = size.height;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const render = (now: number) => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const draw = (now: number) => {
      render(now);
      if (playing && visible) frame = requestAnimationFrame(draw);
    };

    const setPlaying = (next: boolean) => {
      playing = next;
      if (toggle) {
        toggle.setAttribute("aria-pressed", String(playing));
        toggle.textContent = playing
          ? (toggle.dataset.pause ?? "Pause")
          : (toggle.dataset.play ?? "Play");
      }
      cancelAnimationFrame(frame);
      frame = 0;
      if (playing && visible) frame = requestAnimationFrame(draw);
    };

    canvas.addEventListener("pointermove", (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (event.clientX - rect.left) / rect.width - 0.5;
      mouse.y = 0.5 - (event.clientY - rect.top) / rect.height;
      if (!playing) render(performance.now());
    });

    toggle?.addEventListener("click", () => setPlaying(!playing));

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (playing) {
        frame = requestAnimationFrame(draw);
      }
    });
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener(
      "pagehide",
      () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
      },
      { once: true },
    );
    resize();
    render(start);
    if (reduce && toggle) toggle.hidden = true;
  } catch {
    canvas.hidden = true;
    fallback.hidden = false;
  }
}

if (typeof document !== "undefined") initExperiment();
