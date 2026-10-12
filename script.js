/* =========================================================
   SIGN-UP GATE
   Blocks the site behind a 3D sign-up card until the
   visitor signs up. This is a front-end-only gate stored
   in localStorage on their device — not real authentication.
========================================================= */

(function () {
    const gate = document.getElementById("gate");
    const gateCard = document.getElementById("gateCard");
    const form = document.getElementById("gateForm");

    if (!gate || !form) return;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const alreadySignedUp = localStorage.getItem("alpha_signed_up");

    if (alreadySignedUp) {
        gate.remove();
        return;
    }

    document.body.classList.add("locked");

    if (!reduceMotion) {
        gate.addEventListener("mousemove", e => {
            const rect = gate.getBoundingClientRect();

            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            gateCard.style.transform =
                `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
        });

        gate.addEventListener("mouseleave", () => {
            gateCard.style.transform = "rotateY(0deg) rotateX(0deg)";
        });
    }

    form.addEventListener("submit", e => {
        e.preventDefault();

        const name = document.getElementById("gateName").value.trim();
        const email = document.getElementById("gateEmail").value.trim();
        const studentClass = document.getElementById("gateClass").value;

        if (!name || !email || !studentClass) return;

        localStorage.setItem(
            "alpha_signed_up",
            JSON.stringify({ name, email, class: studentClass, at: Date.now() })
        );

        gate.classList.add("gate-exit");
        document.body.classList.remove("locked");

        setTimeout(() => gate.remove(), 550);
    });
})();



/* =========================================================
   3D TILT HELPER
   Tilts an element toward the cursor. Skipped entirely if
   the visitor prefers reduced motion.
========================================================= */

function apply3DTilt(el, max = 8) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.addEventListener("mousemove", e => {
        const rect = el.getBoundingClientRect();

        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        el.style.transform = `rotateY(${x * max}deg) rotateX(${-y * max}deg)`;
    });

    el.addEventListener("mouseleave", () => {
        el.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
}

document.querySelectorAll(".hero-card, .about-img").forEach(el =>
    apply3DTilt(el, 10)
);



let cls = "Class 10";
let cat = "Math";

const cats = document.getElementById("cats");
const chapters = document.getElementById("chapters");
const current = document.getElementById("current");
const search = document.getElementById("search");

function renderCats() {
    cats.innerHTML = "";

    Object.keys(MATERIALS[cls]).forEach(category => {
        const button = document.createElement("button");

        button.className =
            "cat " + (category === cat ? "active" : "");

        button.textContent = category;

        button.onclick = () => {
            cat = category;
            search.value = "";

            renderCats();
            renderChapters();
        };

        cats.appendChild(button);
    });
}

function renderChapters() {
    current.textContent = cat;

    const query = search.value.toLowerCase();

    const list = MATERIALS[cls][cat].filter(name =>
        name.toLowerCase().includes(query)
    );

    chapters.innerHTML = "";

    list.forEach(name => {

        const box = document.createElement("div");
        box.className = "chapter";

        const info = document.createElement("div");

        const title = document.createElement("h4");
        title.textContent = name;

        const small = document.createElement("small");
        small.textContent = `${cls} • ${cat}`;

        info.appendChild(title);
        info.appendChild(small);

        const button = document.createElement("button");
        button.className = "download";

        const pdf = DEMO_FILES[name];

        if (pdf) {
            button.textContent = "↓ Download PDF";

            button.onclick = () => {

                const link = document.createElement("a");

                link.href = pdf;
                link.download = pdf.split("/").pop();

                document.body.appendChild(link);

                link.click();

                document.body.removeChild(link);
            };

        } else {
            button.textContent = "＋ Add resource";

            button.onclick = () => {
                alert("PDF is not available yet.");
            };
        }

        box.appendChild(info);
        box.appendChild(button);

        apply3DTilt(box, 6);

        chapters.appendChild(box);
    });
}

document.querySelectorAll(".tabs button").forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelectorAll(".tabs button")
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        cls = button.dataset.class;

        cat = Object.keys(MATERIALS[cls])[0];

        search.value = "";

        renderCats();
        renderChapters();
    });

});

search.addEventListener("input", renderChapters);

renderCats();
renderChapters();

/* =========================================================
   ALPHA GALLERY (3D carousel)

   >>> EDIT THIS LIST to use your own pictures. <<<
   Put images in the assets/ folder, then set `img`
   to e.g. "assets/my-photo.jpg". Add or remove items
   freely (2 or more works).
========================================================= */

const ALPHA_GALLERY = [
    {
        img: "./gallery-1.jpg",
        pos: "70% 40%",
        title: "@umarpnj (Founder of ALPHA UNIVERSITY)",
        
        desc: "Umar Punjabi is a trading and finance content creator focused on market analysis, price action, risk management, and trading psychology. His content simplifies complex market concepts and helps aspiring traders develop a more structured, disciplined, and informed approach to trading (also founder of ALPHA UNIVERSITY)."
    },
    {
        img: "./gallery-2.jpg",
        pos: "50% 50%",
        title: "@atul shendge (King of Markets & NEWS)",
        desc: "TopG Traders is more than just a trading educator for me \u2014 he is someone who has genuinely influenced the way I see the market. His teachings helped me understand that trading is not about chasing quick profits but about patience, discipline, proper analysis, and continuous learning, also called the King of Markets as well as the NEWS King."
    },
    {
        img: "./gallery-3.jpg",
        pos: "45% 35%",
        title: "@AFFAN_PNJ {ex-JAMIANS, FOUNDER OF FX_COMMUNITY}",
        desc: "AFFAN_PNJ is a future cadet and aspiring trader focused on global financial markets, technical analysis, risk management, and strategic capital allocation. He continues to develop his knowledge through market research, observation, and disciplined practice.\n\n@umarpnj, @atulshendge & @affan_pnj \u2014 all are senior global financial market risk assessment & strategic capital allocation specialists. The word \u201cALPHA\u201d is inspired by UmarPNJ\u2019s university and represents a concept that has influenced my journey and mindset."
    }
];

(function () {
    const stage = document.getElementById("gStage");
    const ring = document.getElementById("gRing");
    if (!stage || !ring || !ALPHA_GALLERY.length) return;

    const dots = document.getElementById("gDots");
    const count = document.getElementById("gCount");
    const title = document.getElementById("gTitle");
    const desc = document.getElementById("gDesc");

    const n = ALPHA_GALLERY.length;
    const step = 360 / n;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let index = 0;
    let dragOffset = 0;
    let timer = null;

    function radius() {
        const w = ring.offsetWidth;
        return Math.max(w / 2 / Math.tan(Math.PI / Math.max(n, 3)) + 40, 200);
    }

    const cards = ALPHA_GALLERY.map((item, i) => {
        const card = document.createElement("div");
        card.className = "g-card";
        const img = document.createElement("img");
        img.src = item.img;
        img.alt = item.title;
        if (item.pos) img.style.objectPosition = item.pos;
        const cap = document.createElement("span");
        cap.textContent = item.title;
        card.append(img, cap);
        card.addEventListener("click", () => go(i));
        ring.appendChild(card);

        const dot = document.createElement("i");
        dot.addEventListener("click", () => go(i));
        dots.appendChild(dot);
        return card;
    });

    function layout() {
        const r = radius();
        cards.forEach((c, i) => {
            c.style.transform = `rotateY(${i * step}deg) translateZ(${r}px)`;
        });
        render();
    }

    function render() {
        ring.style.transform =
            `translateZ(${-radius()}px) rotateY(${-index * step + dragOffset}deg)`;
    }

    function show() {
        const k = ((index % n) + n) % n;
        cards.forEach((c, i) => c.classList.toggle("active", i === k));
        [...dots.children].forEach((d, i) => d.classList.toggle("on", i === k));
        count.textContent = `${k + 1} / ${n}`;
        title.textContent = ALPHA_GALLERY[k].title;
        desc.textContent = ALPHA_GALLERY[k].desc;
    }

    function go(i) {
        // shortest path so the ring never spins the long way round
        const k = ((index % n) + n) % n;
        let diff = i - k;
        if (diff > n / 2) diff -= n;
        if (diff < -n / 2) diff += n;
        index += diff;
        render();
        show();
        restart();
    }

    function move(d) {
        index += d;
        render();
        show();
        restart();
    }

    function restart() {
        clearInterval(timer);
        if (reduce) return;
        timer = setInterval(() => move(1), 5000);
    }

    document.getElementById("gPrev").addEventListener("click", () => move(-1));
    document.getElementById("gNext").addEventListener("click", () => move(1));

    // drag / swipe
    let startX = null;
    stage.addEventListener("pointerdown", e => {
        startX = e.clientX;
        stage.classList.add("dragging");
        clearInterval(timer);
    });
    window.addEventListener("pointermove", e => {
        if (startX === null) return;
        dragOffset = (e.clientX - startX) * 0.35;
        render();
    });
    window.addEventListener("pointerup", e => {
        if (startX === null) return;
        const dx = e.clientX - startX;
        startX = null;
        dragOffset = 0;
        stage.classList.remove("dragging");
        if (Math.abs(dx) > 40) move(dx < 0 ? 1 : -1);
        else { render(); restart(); }
    });

    stage.addEventListener("mouseenter", () => clearInterval(timer));
    stage.addEventListener("mouseleave", restart);
    window.addEventListener("resize", layout);

    layout();
    show();
    restart();
})();
