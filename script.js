// 1. Configuração do tsParticles (Rede de Conexões Digitais Claras)
tsParticles.load("tsparticles", {
    particles: {
        number: {
            value: 80,
            density: { enable: true, value_area: 800 }
        },
        color: { value: "#cccccc" }, // Cinza tecnológico muito claro
        shape: { type: "circle" },
        opacity: {
            value: 0.5,
            random: false,
        },
        size: {
            value: 3,
            random: true,
        },
        links: {
            enable: true,
            distance: 150,
            color: "#cccccc", // Linhas conectando os pontos
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 1.2,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: "grab" // As linhas se conectam ao mouse
            },
            onclick: {
                enable: true,
                mode: "push" // Cria mais nós de rede ao clicar
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 200,
                links: { opacity: 0.8, color: "#00e5ff" } // A conexão com o mouse brilha em ciano
            },
            push: { particles_nb: 3 }
        }
    },
    retina_detect: true
});

// 3. Animação de Surgimento (Scroll Reveal)
const revealElements = document.querySelectorAll('.reveal');
const revealOptions = {
    threshold: 0.1, 
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        observer.unobserve(entry.target); 
    });
}, revealOptions);

revealElements.forEach(el => {
    revealOnScroll.observe(el);
});

// 4. Voltar ao Topo e Menu Ativo
const topBtn = document.getElementById('topBtn');
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', () => {
    topBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
        
    let current = "";
    const sections = document.querySelectorAll(".section");
    const links = document.querySelectorAll("nav a");
    
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120; 
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute("id");
        }
    });
    
    links.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
});

// 5. Gerar PDF do Site (html2pdf.js)
const downloadBtn = document.getElementById('download-pdf');

if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Verifica se a biblioteca carregou
        if (typeof html2pdf === 'undefined') {
            alert('Erro: A biblioteca PDF não carregou. Verifique sua conexão.');
            return;
        }

        // 1. Feedback Visual: Avisa que está processando
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = "⏳ Gerando PDF...";
        downloadBtn.style.pointerEvents = "none"; // Evita cliques repetidos

        // 2. Ativar Modo PDF (Simplifica CSS para evitar erros de renderização)
        document.body.classList.add('generating-pdf');

        const element = document.getElementById('portfolio-content');
        const opt = {
            margin:       [0, 0, 0, 0], // Margens zero
            filename:     'Curriculo_Maicon_Junior.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, scrollY: 0, letterRendering: true }, 
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        // Gera o PDF
        html2pdf().set(opt).from(element).save()
            .then(() => {
                // Sucesso: Restaura o site ao normal
                document.body.classList.remove('generating-pdf');
                downloadBtn.innerHTML = originalText;
                downloadBtn.style.pointerEvents = "auto";
            })
            .catch(err => {
                // Erro: Mostra aviso no botão
                console.error("Erro ao gerar PDF:", err);
                document.body.classList.remove('generating-pdf'); // Restaura mesmo com erro
                downloadBtn.innerHTML = "❌ Erro (Tente no PC)";
                
                setTimeout(() => {
                    downloadBtn.innerHTML = originalText;
                    downloadBtn.style.pointerEvents = "auto";
                }, 3000);
            });
    });
}

// 6. Atualizar Ano do Rodapé Automaticamente
document.getElementById('current-year').textContent = new Date().getFullYear();

// 7. Envio do Formulário via AJAX com SweetAlert2 (Efeito High-Tech)
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Impede o redirecionamento padrão do Formspree

        const form = e.target;
        const data = new FormData(form);
        const action = form.action;
        const btn = form.querySelector('button[type="submit"]');
        const originalBtnText = btn.innerHTML;

        // Feedback Visual: Muda o botão enquanto envia
        btn.innerHTML = "⏳ TRANSMITINDO...";
        btn.style.pointerEvents = "none";
        btn.style.opacity = "0.7";

        try {
            const response = await fetch(action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Sucesso! Mostra o pop-up futurista
                Swal.fire({
                    title: 'TRANSMISSÃO CONCLUÍDA!',
                    text: 'Sua mensagem foi recebida com sucesso. Retornarei em breve.',
                    icon: 'success',
                    background: '#ffffff', // Cor de fundo do pop-up
                    color: '#1a1a24', // Cor do texto
                    confirmButtonColor: '#6200ea', // Roxo tech do seu tema
                    confirmButtonText: 'OK',
                    iconColor: '#00e5ff' // Ciano holográfico no ícone de sucesso
                });
                form.reset(); // Limpa os campos do formulário
            } else {
                throw new Error('Erro na resposta do servidor');
            }
        } catch (error) {
            // Erro!
            Swal.fire({
                title: 'FALHA NA TRANSMISSÃO',
                text: 'Não foi possível enviar a mensagem. Por favor, tente me contatar pelo WhatsApp ou E-mail diretamente.',
                icon: 'error',
                confirmButtonColor: '#6200ea'
            });
        } finally {
            // Restaura o botão ao estado original
            btn.innerHTML = originalBtnText;
            btn.style.pointerEvents = "auto";
            btn.style.opacity = "1";
        }
    });
}