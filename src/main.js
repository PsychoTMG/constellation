import './style.css'

const canvas = document.getElementById('canvas1')

const ctx = canvas.getContext('2d') //создание canvas
canvas.width = window.innerWidth // ширина всего экрана
canvas.height = window.innerHeight //ширина всей высоты
ctx.fillStyle = 'blue'
ctx.strokeStyle = 'white'


class Particle { // класс частиц 
    constructor(effect) {
        this.effect = effect
        this.radius = Math.random() * 20 + 1
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2)
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2)
        this.vx = Math.random() * 3 - 2
        this.vy = Math.random() * 3 - 2

    }
    draw(context) {
        context.fillStyle = `hsl(${this.x * 0.5} ,100%,50%)`
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fill()
        context.stroke()
    }
    update() {
        this.x += this.vx
        if (this.x > this.effect.width - this.radius || this.x < this.radius) {
            this.vx *= -1
        }
        this.y += this.vy
        if (this.y > this.effect.height - this.radius || this.y < this.radius) {
            this.vy *= -1
        }
    }
}

class Effect { // класс эффекта 
    constructor(canvas) {
        this.canvas = canvas
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.particles = []
        this.numberOfParticle = 200
        this.createParticle()
    }
    createParticle() {
        for (let i = 0; i <= this.numberOfParticle; i++) {
            this.particles.push(new Particle(this))
        }
    }
    handleParticles(context) {
        this.connectParticles(context)
        this.particles.forEach(particle => {
            particle.draw(context)
            particle.update()
        })
    }
    connectParticles(context) {
        const maxDistance = 100
        for (let i = 0; i < this.particles.length; i++) {
            for (let a = i; a < this.particles.length; a++) {
                const dx = this.particles[i].x - this.particles[a].x
                const dy = this.particles[i].y - this.particles[a].y
                const distance = Math.hypot(dx, dy)
                if (distance < maxDistance) {
                    context.save()
                    const opacity = 1 - (distance / maxDistance)
                    context.globalAlpha = opacity
                    context.beginPath()
                    context.moveTo(this.particles[i].x, this.particles[i].y)
                    context.lineTo(this.particles[a].x, this.particles[a].y)
                    context.stroke()
                    context.restore()
                }
            }
        }
    }
}

const effect = new Effect(canvas)


function animation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    effect.handleParticles(ctx)
    requestAnimationFrame(animation)

}
animation()